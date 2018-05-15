import * as kafka from "kafka-node";
import {MongoClient, Db, MongoError} from 'mongodb';
import DbClient = require("./common/DbClient");
import * as express from 'express';
import {Request, Response} from 'express';

class App {

  public db;

  public async start() {
    try {
      this.db = await DbClient.connect();

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

      consumer.on("message", (message) => {
        this.db.collection(message.topic).insertOne(message);
        console.log(message);
      });

      consumer.on("error", (err) => {
        console.log("error", err);
      });
    } catch (err) {
      console.log(err);
    }
  }
}

const app = new App();
app.start();

let router = express();

router.listen(8080);

router.get("/collection/:stream", (req: Request, res: Response) => {
  app.db.collection(req.params['stream']).find().toArray().then((tweets: Tweet[]) => {
    res.status(200).json({tweets: tweets});
  });
});


