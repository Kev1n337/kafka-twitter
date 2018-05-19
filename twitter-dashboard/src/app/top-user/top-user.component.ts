import { Component, OnInit } from '@angular/core';
import {Tweet} from '../tweet.model';
import {KsqlService} from '../ksql.service';

@Component({
  selector: 'app-top-user',
  templateUrl: './top-user.component.html',
  styleUrls: ['./top-user.component.css']
})
export class TopUserComponent implements OnInit {

  public displayNames = [];

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
    const items = Object.keys(this.ksql.germany.nameDict).map(key => [key, this.ksql.germany.nameDict[key]]);
    items.sort((first: any, second: any) => second[1] - first[1]);
    this.displayNames = items.slice(0, 8);
  }
}
