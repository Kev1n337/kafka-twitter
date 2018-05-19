import * as express from 'express';
import {Request, Response} from 'express';
import * as bodyParser from 'body-parser';
import * as socket from 'socket.io';
import {Topic} from './model/Topic';


let router = express();

let germany = new Topic('Germany');
let trump = new Topic('Trump');
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
      socket.emit('tweets', tweet);
      socket.emit('tags', germany.hashDict);
      socket.emit('person', germany.nameDict);
    });
  });

  socket.on('trump', function( user ){
    trump.emitter.on('tweet', (tweet) => {
      socket.emit('tweets', tweet);
      socket.emit('tags', trump.hashDict);
      socket.emit('person', trump.nameDict);
    });
  });

  socket.on('cloud', function( user ){
    cloud.emitter.on('tweet', (tweet) => {
      socket.emit('tweets', tweet);
      socket.emit('tags', cloud.hashDict);
      socket.emit('person', cloud.nameDict);
    });
  });
});

router.get("/collection/:stream", (req: Request, res: Response) => {
  switch(req.params['stream']) {
    case 'germany':
      res.json({topic: germany});
      break;
    case 'trump':
      res.json({topic: trump});
      break;
    case 'cloud':
      res.json({topic: cloud});
    default:
      res.status(404).json({message: 'Stream not found'});
  }
});

