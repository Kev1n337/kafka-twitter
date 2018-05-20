import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {http} from 'stream-http';
import * as socket from 'socket.io-client';
import {Subject} from 'rxjs';
import {Topic} from './topic.model';

@Injectable({
  providedIn: 'root'
})
export class KsqlService {

  public germany: Topic;
  public trump: Topic;
  public cloud: Topic;

  public currentTopic;

  private socket;

  private tweetsFetchedSource = new Subject<void>();
  tweetsFetched$ = this.tweetsFetchedSource.asObservable();

  constructor(private httpClient: HttpClient) {
    this.socket = socket('http://localhost:8080');
  }

  public changeTopic(topic: string): void {
    this.currentTopic = new Topic(topic);
    this.httpClient.get(`http://localhost:8080/collection/${topic}`).subscribe((data: any) => {
      this.currentTopic.tweets = data.topic.tweets;
      this.currentTopic.hashDict = data.topic.hashDict;
      this.currentTopic.nameDict = data.topic.nameDict;

      this.tweetsFetchedSource.next();
    });

    this.currentTopic.initSocket(this.socket);
  }
}
