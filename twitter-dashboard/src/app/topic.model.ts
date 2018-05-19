import {Tweet} from './tweet.model';
import {Socket} from 'socket.io-client';
import {Subject} from 'rxjs';

export class Topic {
  name: string;
  tweets: Tweet[] = [];
  hashDict: { [id: string]: number} = {};

  private tweetAddedSource = new Subject<Tweet>();
  tweetAdded$ = this.tweetAddedSource.asObservable();

  constructor() {}

  public calculateTags(hashtags: string[]) {
    for (const tag of hashtags) {
      if (this.hashDict[tag]) {
        this.hashDict[tag]++;
      } else {
        this.hashDict[tag] = 1;
      }
    }
  }

  public initSocket(socket: Socket): void {
    socket.emit('germany');
    socket.on('tweets', (data: Tweet) => {
      this.tweets.push(data);
      this.calculateTags(data.hashtags);
      this.tweetAddedSource.next(data);
    });
  }
}
