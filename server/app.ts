import * as express from 'express';
import {Request, Response} from 'express';
import * as request from 'request-promise';
import * as bodyParser from 'body-parser';
import * as socket from 'socket.io';
import {Topic} from './model/Topic';
import {Tweet} from './model/Tweet';


let router = express();

let germany = new Topic('Germany');

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
    if (line == "") { return; }
    try {
      let object = JSON.parse(line).row.columns;
      object[3] = JSON.parse(object[3]).map(entity => entity.Text);
      let tweet = new Tweet(object[0], object[1], object[2], object[3]);
      germany.tweets.push(tweet);
      if(germany.tweets.length > 10000) { germany.tweets.shift(); }
      germany.calculateTags(tweet.hashtags);
      germany.emitter.emit('tweet', tweet);
    } catch (e) {
      console.log(e);
    }
  });
});


router.use(bodyParser.json());

router.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

let server = router.listen(8080, () => console.log('Server started'));

let io = socket(server);

io.on('connection', (socket) => {
  console.log('made socket connection', socket.id);

  socket.on('germany', function( user ){
    germany.emitter.on('tweet', (tweet) => {
      socket.emit('tweets', tweet);
      socket.emit('tags', germany.hashDict);
    });
  });

});

router.get("/collection/:stream", (req: Request, res: Response) => {
  switch(req.params['stream']) {
    case 'germany':
      res.json({topic: germany});
      break;
    default:
      res.status(404).json({message: 'Stream not found'});
  }
});

