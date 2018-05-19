import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {http} from 'stream-http';
import * as socket from 'socket.io-client';
import {Subject} from 'rxjs';
import {Tweet} from './tweet.model';
import {Topic} from './topic.model';

@Injectable({
  providedIn: 'root'
})
export class KsqlService {

  public germany: Topic;
  private socket;

  private germanTweetsFetchedSource = new Subject<void>();
  germanTweetsFetched$ = this.germanTweetsFetchedSource.asObservable();

  constructor(private httpClient: HttpClient) {
    this.socket = socket('http://localhost:8080');
    this.httpClient.get('http://localhost:8080/collection/germany').subscribe((data: any) => {
      this.germany.tweets = data.topic.tweets;
      this.germany.hashDict = data.topic.hashDict;

      this.germanTweetsFetchedSource.next();
    });
  }

  public initGermany(): void {
    this.germany = new Topic();
    this.germany.initSocket(this.socket);
  }
}
