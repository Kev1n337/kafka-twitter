import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {http} from 'stream-http';
import * as socket from 'socket.io-client';
import {Subject} from 'rxjs';
import {Tweet} from './tweet.model';

@Injectable({
  providedIn: 'root'
})
export class KsqlService {

  public tweets: Tweet[] = [];
  private socket;

  private germanTweetAddedSource = new Subject<Tweet>();
  germanTweetAdded$ = this.germanTweetAddedSource.asObservable();

  private germanTweetsFetchedSource = new Subject<void>();
  germanTweetsFetched$ = this.germanTweetsFetchedSource.asObservable();

  constructor(private httpClient: HttpClient) {
    this.httpClient.get('http://localhost:8080/collection/germany').subscribe((data: any) => {
      this.tweets = data.tweets;
      console.log(this.tweets.length);
      this.germanTweetsFetchedSource.next();
    });
  }

  public initSocket(): void {
    this.socket = socket('http://localhost:8080');
    this.socket.emit('germany');
    this.socket.on('tweets', (data: any) => {
      console.log('Tweet via WS');
      this.tweets.push(data);
      this.germanTweetAddedSource.next(data);
    });
  }
}
