import { Component } from '@angular/core';
import {Tweet} from '../tweet.model';
import {KsqlService} from '../ksql.service';

@Component({
  selector: 'app-top-user',
  templateUrl: './top-user.component.html',
  styleUrls: ['./top-user.component.css']
})
export class TopUserComponent {

  public displayNames = [];

  constructor(private ksql: KsqlService) {
    this.ksql.topicChanged$.subscribe(() => {
      this.displayNames = [];
      this.ksql.currentTopic.tweetAdded$.subscribe((tweet: Tweet) => {
        this.sortData();
      });
    });
  }

  sortData() {
    const items = Object.keys(this.ksql.currentTopic.nameDict).map(key => [key, this.ksql.currentTopic.nameDict[key]]);
    items.sort((first: any, second: any) => second[1] - first[1]);
    this.displayNames = items.slice(0, 8);
  }
}
