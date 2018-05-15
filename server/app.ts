import * as kafka from "kafka-node";
import {MongoClient, Db, MongoError} from 'mongodb';
import DbClient = require("./common/DbClient");


class App {
  public async start() {
    try {
      let db = await DbClient.connect();

      const client = new kafka.KafkaClient({kafkaHost: 'localhost:9092'});
      const topics = [
        {
          topic: "twitter_json_01"
        }
      ];
      const options = {
        autoCommit: true,
        fetchMaxWaitMs: 1000,
        fetchMaxBytes: 1024 * 1024,
        encoding: "utf8"
      };

      const consumer = new kafka.Consumer(client, topics, options);

      consumer.on("message", function(message) {
        db.collection(message.topic).insertOne(message);
        console.log(message);
      });

      consumer.on("error", function(err) {
        console.log("error", err);
      });
    } catch (err) {
      console.log(err);
    }
  }
}

const app = new App();
app.start();

class Tweet {
  topic: string;
  value: string;
  offset: number;
  partition: number;
  highWaterOffset: number;
  key: string;
  timestamp: Date;
}



