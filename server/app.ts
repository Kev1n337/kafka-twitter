import * as kafka from "kafka-node";
import {MongoClient, Db, MongoError} from 'mongodb';
import DbClient = require("./common/DbClient");
import * as express from 'express';
import {Request, Response} from 'express';
import * as request from 'request-promise';
import bodyParser = require ("body-parser");

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
        //console.log(message);
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



router.use(bodyParser.json());

router.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

router.listen(8080);

router.get("/collection/:stream", (req: Request, res: Response) => {
  let cursor = app.db.collection(req.params['stream']).find().limit(1000).stream()
    .on("data", function(d) {
      res.write(JSON.stringify(d));
    })
  cursor.stream().on("end", function() {
    res.end();
  });
});

router.post("/ksql", function(req: Request, res: Response) {
  request({
    method: 'POST',
    body: {
      'ksql': req.body['ksql']
    },
    uri: 'http://localhost:8088/ksql',
    json: true
  }).then((resp) => {
    res.status(200).json(resp);
  })
    .catch((err) => {
      res.status(500).json({error: err});
    });

});


router.post('/query', function(req: Request, res: Response) {


  request({
    method: 'POST',
    body: {
      'ksql': req.body['ksql']
    },
    uri: 'http://localhost:8088/query',
    json: true
  }).on('data', (data: Buffer) => {
    let buff = new Buffer(data.toString(), 'utf8');
    res.write(data.toString('utf8'));
  }).on('end', () => {
    res.end();
  })
});

