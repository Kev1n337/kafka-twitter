import {Tweet} from './tweet.model';
import {Socket} from 'socket.io-client';
import * as socket from 'socket.io-client';
import {Subject} from 'rxjs';

export class Topic {
  name: string;
  tweets: Tweet[] = [];
  hashDict: { [id: string]: number} = {};
  nameDict: { [id: string]: number} = {};
  socket: Socket;

  private tweetAddedSource = new Subject<Tweet>();
  tweetAdded$ = this.tweetAddedSource.asObservable();

  constructor(name: string) {
    this.name = name;
    this.socket = socket('localhost:8080');
  }

  public initSocket(): void {
    this.socket.emit(this.name.toLowerCase());
    this.socket.on('newTweet', (data: Tweet) => {
      console.log(this.name);
      this.tweets.push(data);
      if (this.tweets.length > 10000) {
        this.tweets.shift();
      }
      this.calcTags(data.hashtags);
      this.calcUsers(data.name);
      this.tweetAddedSource.next(data);
    });
  }

  private calcTags(hashtags: string[]) {
    for (const tag of hashtags) {
      if (this.hashDict[tag]) {
        this.hashDict[tag]++;
      } else {
        this.hashDict[tag] = 1;
      }
    }
  }

  private calcUsers(user: string) {
    if (this.nameDict[name]) {
      this.nameDict[name]++;
    } else {
      this.nameDict[name] = 1;
    }
  }

}
