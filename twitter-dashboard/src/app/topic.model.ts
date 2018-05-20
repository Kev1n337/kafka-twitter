import {Tweet} from './tweet.model';
import {Socket} from 'socket.io-client';
import {Subject} from 'rxjs';

export class Topic {
  name: string;
  tweets: Tweet[] = [];
  hashDict: { [id: string]: number} = {};
  nameDict: { [id: string]: number} = {};

  private tweetAddedSource = new Subject<Tweet>();
  tweetAdded$ = this.tweetAddedSource.asObservable();

  constructor(name: string) {
    this.name = name;
  }

  public initSocket(socket: Socket): void {
    console.log('Topic init', this.name);
    socket.emit(this.name.toLowerCase());
    socket.on('tweets', (data: Tweet) => {
      this.tweets.push(data);
      console.log('Tweet added', this.name)
      console.log(data);
      if (this.tweets.length > 10000) {
        this.tweets.shift();
      }
      this.tweetAddedSource.next(data);
    });

    socket.on('tags', tags => this.hashDict = tags );
    socket.on('person', persons => this.nameDict = persons);
  }
}
