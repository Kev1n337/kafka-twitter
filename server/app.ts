import * as express from 'express';
import {Request, Response} from 'express';
import * as bodyParser from 'body-parser';
import * as socket from 'socket.io';
import {Topic} from './model/Topic';


let router = express();

let germany = new Topic('Germany');
let developer = new Topic('Developer');
let cloud = new Topic('Cloud');

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
      socket.emit('newTweet', tweet);
    });
  });

  socket.on('developer', function( user ){
    developer.emitter.on('tweet', (tweet) => {
      socket.emit('newTweet', tweet);
    });
  });

  socket.on('cloud', function( user ){
    cloud.emitter.on('tweet', (tweet) => {
      socket.emit('newTweet', tweet);
    });
  });
});

router.get("/collection/:stream", (req: Request, res: Response) => {
  switch(req.params['stream'].toLowerCase()) {
    case 'germany':
      res.json({
        tweets: germany.tweets,
        nameDict: germany.nameDict,
        hashDict: germany.hashDict
      });
      break;
    case 'developer':
      res.json({
        tweets: developer.tweets,
        nameDict: developer.nameDict,
        hashDict: developer.hashDict
      });
      break;
    case 'cloud':
      res.json({
        tweets: cloud.tweets,
        nameDict: cloud.nameDict,
        hashDict: cloud.hashDict
      });
      break;
    default:
      res.status(404).json({message: 'Stream not found'});
  }
});

router.use('/', express.static(__dirname + '/../twitter-dashboard/dist/twitter-dashboard'));
router.use('/*', express.static(__dirname + '/../twitter-dashboard/dist/twitter-dashboard'));
