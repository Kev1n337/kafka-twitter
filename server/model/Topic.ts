import {Tweet} from './Tweet';
import {EventEmitter} from 'events';
import request = require('request-promise');

export class Topic {
  name: string;
  tweets: Tweet[];
  hashDict: { [id: string]: number};
  nameDict: { [id: string]: number};
  emitter: EventEmitter;
  serviceDown: boolean;
  static cacheSize = 5000;

  constructor(name: string) {
    this.name = name;
    this.tweets = [];
    this.emitter = new EventEmitter();
    this.hashDict = {};
    this.nameDict = {};
    this.fetchTweets();
    this.serviceDown = false;
    this.checkTopicStatus();
  }

  public calculateTags(hashtags: string[]) {
    for (const tag of hashtags) {
      if (this.hashDict[tag]) {
        this.hashDict[tag]++;
      } else {
        this.hashDict[tag] = 1;
      }
    }
    if(this.tweets.length > 5000) {
      for (const tag of this.tweets[0].hashtags) {
        this.hashDict[tag]--;
      }
    }
  }

  public calculatePersons (name: string) {
    if(this.nameDict[name]) {
      this.nameDict[name]++;
    } else {
      this.nameDict[name] = 1;
    }

    if (this.tweets.length > 5000) {
      this.nameDict[this.tweets[0].name]--;
    }
  }

  public fetchTweets() {
    request({
      method: 'POST',
      body: {
        'ksql': `SELECT CREATEDAT, USER_NAME, TEXT, HASHTAGENTITIES FROM ${this.name};`,
        'streamsProperties': {
          'ksql.streams.auto.offset.reset': 'earliest'
        }
      },
      uri: 'http://localhost:8088/query',
      json: true
    }).on('data', (data: Buffer) => {
      data.toString('utf8').trim().split("\n").forEach(line => {
        if (line == "") { return; }
        try {
          let object = JSON.parse(line).row.columns;
          object[3] = JSON.parse(object[3]).map(entity => entity.Text);
          let tweet = new Tweet(object[0], object[1], object[2], object[3]);
          this.serviceDown = false;
          this.tweets.push(tweet);
          this.calculateTags(tweet.hashtags);
          this.calculatePersons(tweet.name);
          if(this.tweets.length > 5000) {
            this.tweets.shift();
          }
          console.log(this.name, tweet.time);
          this.emitter.emit('tweet', tweet);
        } catch (e) {
        }
      });
    });
  }

  private checkTopicStatus() {
    this.serviceDown = true;
    setTimeout(() => {
      if(this.serviceDown == true) {
        request({
          method: 'POST',
          body: {
            'ksql': `DROP STREAM ${this.name}; CREATE STREAM ${this.name} AS SELECT TIMESTAMPTOSTRING(CreatedAt, 'yyyy-MM-dd HH:mm:ss.SSS') AS CreatedAt, EXTRACTJSONFIELD(user,'$.Name') AS user_Name, Text,hashtagentities FROM ${this.name}_raw ;`
          },
          uri: 'http://localhost:8088/ksql',
          json: true
        });
      }
      this.checkTopicStatus();
    }, 120000);
  }

}