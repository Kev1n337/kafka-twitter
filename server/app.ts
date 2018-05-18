import * as kafka from "kafka-node";
import {MongoClient, Db, MongoError} from 'mongodb';
import DbClient = require("./common/DbClient");
import * as express from 'express';
import {Request, Response} from 'express';
import * as request from 'request-promise';
import bodyParser = require ("body-parser");
import * as socket from 'socket.io';
import {Topic} from './model/Topic';
import {Tweet} from './model/Tweet';


class App {

  public db;
  public async start() {
    try {
      this.db = await DbClient.connect();

      const client = new kafka.KafkaClient({kafkaHost: 'localhost:9092'});
      const topics = [
        {
          topic: "twitter_germany"
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
        // this.db.collection(message.topic).insertOne(message);
      });
    } catch (err) {
      console.log(err);
    }
  }
}

const app = new App();
app.start();

let router = express();

let germany = new Topic('Germany');

router.use(bodyParser.json());

router.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

let server = router.listen(8080);

let io = socket(server);

io.on('connection', (socket) => {
  console.log('made socket connection', socket.id);

  socket.on('germany', function( user ){
    request({
      method: 'POST',
      body: {
        'ksql': 'SELECT CREATEDAT, USER_NAME, TEXT, HASHTAGENTITIES FROM GERMANY;',
        'streamsProperties': {
          'ksql.streams.auto.offset.reset': 'earliest'
        }
      },
      uri: 'http://localhost:8088/query',
      json: true
    }).on('data', (data: Buffer) => {
      data.toString('utf8').trim().split("\n").forEach(line => {
        try {
          let object = JSON.parse(line).row.columns;
          object[3] = JSON.parse(object[3]).map(entity => entity.Text);
          let tweet = new Tweet(object[0], object[1], object[2], object[3]);
          germany.tweets.push(tweet);
          socket.emit('tweets', tweet);
        } catch (e) {}
      });

    });
  });



});

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
    res.write(data.toString('utf8'));
  }).on('end', () => {
    res.end();
  })
});