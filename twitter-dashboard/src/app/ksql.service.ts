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
  public currentTopic;

  private topicChangedSource = new Subject<void>();
  topicChanged$ = this.topicChangedSource.asObservable();

  constructor(private httpClient: HttpClient) {
  }

  public changeTopic(topic: string): void {
    if (this.currentTopic) { this.currentTopic.socket.close(); }
    this.currentTopic = new Topic(topic);
    this.topicChangedSource.next();
    this.httpClient.get(`http://localhost:8080/collection/${topic}`).subscribe((data: any) => {
      this.currentTopic.tweets = data.topic.tweets;
      this.currentTopic.hashDict = data.topic.hashDict;
      this.currentTopic.nameDict = data.topic.nameDict;
    });

    this.currentTopic.initSocket(socket('http://localhost:8080'));
  }
}
