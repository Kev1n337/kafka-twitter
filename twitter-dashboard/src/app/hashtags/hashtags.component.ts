import { Component } from '@angular/core';
import {KsqlService} from '../ksql.service';
import {Tweet} from '../tweet.model';

@Component({
  selector: 'app-hashtags',
  templateUrl: './hashtags.component.html',
  styleUrls: ['./hashtags.component.css']
})
export class HashtagsComponent {

  public displayTags = [];

  constructor(private ksql: KsqlService) {
    this.ksql.topicChanged$.subscribe(() => {
      this.displayTags = [];
      this.ksql.currentTopic.tweetAdded$.subscribe((tweet: Tweet) => {
        this.sortData();
      });
    });

    this.ksql.tweetsFetched$.subscribe(() => {
      this.sortData();
    });
  }

  sortData() {
    const items = Object.keys(this.ksql.currentTopic.hashDict).map(key => [key, this.ksql.currentTopic.hashDict[key]]);
    items.sort((first: any, second: any) => second[1] - first[1]);
    this.displayTags = items.slice(0, 8);
  }
}
