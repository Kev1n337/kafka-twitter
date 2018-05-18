import { Component, OnInit } from '@angular/core';
import {KsqlService} from '../ksql.service';
import {Tweet} from '../tweet.model';

@Component({
  selector: 'app-hashtags',
  templateUrl: './hashtags.component.html',
  styleUrls: ['./hashtags.component.css']
})
export class HashtagsComponent implements OnInit {

  public dataDict: { [id: string]: number} = {};
  public displayTags = [];

  constructor(private ksql: KsqlService) { }

  ngOnInit() {
    this.ksql.germanTweetsFetched$.subscribe(() => {
      const hashtagsCollections = this.ksql.tweets.map(curTweet => curTweet.hashtags);
      hashtagsCollections.forEach((hashtags: string[]) => {
        console.log('CALC');
        this.calculateHashtags(hashtags);
      });
    });

    this.ksql.germanTweetAdded$.subscribe((tweet: Tweet) => {
      this.calculateHashtags(tweet.hashtags);
    });
  }

  calculateHashtags(hashtags: string[]) {
    for (const tag of hashtags) {
      if (this.dataDict[tag]) {
        this.dataDict[tag]++;
      } else {
        this.dataDict[tag] = 1;
      }
    }
    this.sortData();
  }

  sortData() {
    const items = Object.keys(this.dataDict).map(key => [key, this.dataDict[key]]);
    items.sort((first: any, second: any) => second[1] - first[1]);
    this.displayTags = items.slice(0, 5);
  }
}
