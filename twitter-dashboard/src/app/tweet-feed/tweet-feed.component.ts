import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from '@angular/material';
import {KsqlService} from '../ksql.service';
import {Tweet} from '../tweet.model';
import {ActivatedRoute} from '@angular/router';
import {Topic} from '../topic.model';

@Component({
  selector: 'app-tweet-feed',
  templateUrl: './tweet-feed.component.html',
  styleUrls: ['./tweet-feed.component.css']
})
export class TweetFeedComponent implements OnInit {

  displayedColumns = ['time', 'name', 'text'];
  displayedTweets: Tweet[] = [];
  dataSource = new MatTableDataSource(this.displayedTweets);

  constructor(private ksql: KsqlService) {}

  ngOnInit() {
    this.ksql.topicChanged$.subscribe(() => {
      this.displayedTweets = [];
      this.dataSource.data = this.displayedTweets;
    });

    this.ksql.currentTopic.tweetAdded$.subscribe((tweet: Tweet) => {
      this.displayedTweets.push(tweet);
      if (this.displayedTweets.length > 5) {
        this.displayedTweets.shift();
      }
      this.dataSource.data = this.displayedTweets;
    });
  }

}
