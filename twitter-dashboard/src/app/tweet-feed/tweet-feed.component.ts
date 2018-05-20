import { Component } from '@angular/core';
import {MatTableDataSource} from '@angular/material';
import {KsqlService} from '../ksql.service';
import {Tweet} from '../tweet.model';

@Component({
  selector: 'app-tweet-feed',
  templateUrl: './tweet-feed.component.html',
  styleUrls: ['./tweet-feed.component.css']
})
export class TweetFeedComponent {

  displayedColumns = ['time', 'name', 'text'];
  displayedTweets: Tweet[] = [];
  dataSource = new MatTableDataSource(this.displayedTweets);

  constructor(private ksql: KsqlService) {
    this.ksql.topicChanged$.subscribe(() => {
      console.log('Topic changed');
      this.displayedTweets = [];
      this.dataSource.data = this.displayedTweets;

      this.ksql.currentTopic.tweetAdded$.subscribe((tweet: Tweet) => {
        this.displayedTweets.push(tweet);
        if (this.displayedTweets.length > 5) {
          this.displayedTweets.shift();
        }
        this.dataSource.data = this.displayedTweets;
      });
    });
  }
}
