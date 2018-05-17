import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {tap} from 'rxjs/operators';
import {http} from 'stream-http';
import * as querystring from 'querystring';
import * as socket from 'socket.io-client';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KsqlService {

  private socket;

  constructor(private http: HttpClient) {

  }

  public initSocket(): void {
    this.socket = socket('http://localhost:8080');
    this.socket.emit('germany');
  }

  public onMessage(): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('tweets', (data: any) => observer.next(data));
    });
  }

  getTwitter() {
    this.http.post('http://localhost:8080/ksql', {'ksql': 'LIST TOPICS;'}).toPromise()
      .then((el: any) => {
        console.log(el);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getTopic() {
    this.http.post('http://localhost:8080/query', {'ksql': 'SELECT * FROM germany;'}).forEach((d) => { console.log(d); });

    /*
    const postData = querystring.stringify({
      'ksql': 'SELECT * FROM twitter;'
    });

    const postOptions = {
      host: 'http://localhost',
      port: '8080',
      path: '/query',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'Content-Length': Buffer.byteLength(postData)
      }
    };

    const postReq = http.request(postOptions, (res) => {
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
        console.log('Response: ' + chunk);
      });
    });

    postReq.write(postData);
    postReq.end();
    */
  }
}
