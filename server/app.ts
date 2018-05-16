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
/*  res.set('Content-Type', 'application/json');
  res.write('[');
  var prevChunk = null;

  app.db.collection(req.params['stream']).find().limit(10000)
    .on('data', function onData(data) {
      if (prevChunk) {
        res.write(JSON.stringify(prevChunk) + ',');
      }
      prevChunk = data;
    })
    .on('end', function onEnd() {
      if (prevChunk) {
        res.write(JSON.stringify(prevChunk));
      }
      res.end(']');
    });
    */
  let query = app.db.collection(req.params['stream']).find().limit(10000)
  query.stream().on("data", function(d) { res.json(d); });
  query.stream().on("end", function() { console.log("done"); res.end(); });
});



