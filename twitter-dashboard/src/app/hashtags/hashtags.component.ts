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
      this.sortData();
    });

    this.ksql.germany.tweetAdded$.subscribe((tweet: Tweet) => {
      this.sortData();
    });
  }

  sortData() {
    const items = Object.keys(this.ksql.germany.hashDict).map(key => [key, this.ksql.germany.hashDict[key]]);
    items.sort((first: any, second: any) => second[1] - first[1]);
    this.displayTags = items.slice(0, 5);
  }
}
