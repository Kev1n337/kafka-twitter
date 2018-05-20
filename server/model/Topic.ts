import {Tweet} from './Tweet';
import {EventEmitter} from 'events';
import request = require('request-promise');

export class Topic {
  name: string;
  tweets: Tweet[];
  hashDict: { [id: string]: number};
  nameDict: { [id: string]: number};
  emitter: EventEmitter;

  constructor(name: string) {
    this.name = name;
    this.tweets = [];
    this.emitter = new EventEmitter();
    this.hashDict = {};
    this.nameDict = {};
    this.fetchTweets();
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

  public calculatePersons (name: string) {
    if(this.nameDict[name]) {
      this.nameDict[name]++;
    } else {
      this.nameDict[name] = 1;
    }
  }

  public fetchTweets() {
    request({
      method: 'POST',
      body: {
        'ksql': `SELECT CREATEDAT, USER_NAME, TEXT, HASHTAGENTITIES FROM ${this.name};`,
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
          this.tweets.push(tweet);
          if(this.tweets.length > 10000) { this.tweets.shift(); }
          this.calculateTags(tweet.hashtags);
          this.calculatePersons(tweet.name);
          this.emitter.emit('tweet', tweet);
          console.log(this.name, tweet.time);
        } catch (e) {
          console.log(e);
        }
      });
    });
  }

}