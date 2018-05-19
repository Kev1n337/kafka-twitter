import {Tweet} from './Tweet';
import {EventEmitter} from 'events';

export class Topic {
  name: string;
  tweets: Tweet[];
  hashDict: { [id: string]: number};
  emitter: EventEmitter;

  constructor(name: string) {
    this.name = name;
    this.tweets = [];
    this.emitter = new EventEmitter();
    this.hashDict = {};
  }

  public calculateTags(hashtags: string[]) {
    for (const tag of hashtags) {
      if (this.hashDict[tag]) {
        this.hashDict[tag]++;
      } else {
        this.hashDict[tag] = 1;
      }
    }
  }

}