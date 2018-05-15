# Kafka Twitter Project

## Configuration

1. Install [Confluent](http://confluent.io)
2. Start confluent with `confluent start`
3. Compile Kafka-Connect-Module with 

```
$ cd kafka-connect-twitter 
$ mvn clean package
$ cd target
$ tar -xvf kafka-connect-twitter-0.2-SNAPSHOT.tar.gz
```
To get Kafka Connect use the connector, the schema-registry configuration file needs to be modified

`etc/schema-registry/connect-avro-distributed.properties` needs the following line added: 

```
plugin.path=share/java,/PATH_TO_REPO/kafka-connect-twitter/
```

Restart confluent Connect:

```
$ confluent stop connect
$ confluent start connect
```

After the Twitter API keys are added to `twitter_source.json`, it can be loaded.

```
$ confluent load twitter_source -d twitter-source.json
```

Make sure tweets are displayed running:

```
$ kafka-console-consumer --bootstrap-server localhost:9092 --from-beginning --topic twitter_json_01|jq '.Text'
```

## Troubleshooting

`LEADER_NOT_AVAILABLE`:
Modify `etc/kafka/server.properties`:

Add the line:

```
listeners = PLAINTEXT://localhost:9092
```

## KSQL

Using KSQL a stream could be created by:

```
CREATE STREAM twitter_raw (CreatedAt bigint,Id bigint, Text VARCHAR, SOURCE VARCHAR, Truncated VARCHAR, InReplyToStatusId VARCHAR, InReplyToUserId VARCHAR, InReplyToScreenName VARCHAR, GeoLocation VARCHAR, Place VARCHAR, Favorited VARCHAR, Retweeted VARCHAR, FavoriteCount VARCHAR, User VARCHAR, Retweet VARCHAR, Contributors VARCHAR, RetweetCount VARCHAR, RetweetedByMe VARCHAR, CurrentUserRetweetId VARCHAR, PossiblySensitive VARCHAR, Lang VARCHAR, WithheldInCountries VARCHAR, HashtagEntities VARCHAR, UserMentionEntities VARCHAR, MediaEntities VARCHAR, SymbolEntities VARCHAR, URLEntities VARCHAR) WITH (KAFKA_TOPIC='twitter_json_01',VALUE_FORMAT='JSON');
```



