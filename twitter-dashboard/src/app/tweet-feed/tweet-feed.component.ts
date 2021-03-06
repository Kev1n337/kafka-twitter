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

  displayedTweets: Tweet[] = [];

  constructor(private ksql: KsqlService) {
    this.ksql.topicChanged$.subscribe(() => {
      this.displayedTweets = [];

      this.ksql.tweetsFetched$.subscribe(() => {
        let tweets = this.ksql.currentTopic.tweets;
        this.displayedTweets = tweets.slice(tweets.length - 6, tweets.length - 1)
      });
      
      this.ksql.currentTopic.tweetAdded$.subscribe((tweet: Tweet) => {
        this.displayedTweets.push(tweet);
        if (this.displayedTweets.length > 5) {
          this.displayedTweets.shift();
        }
      });
    });
  }
}
