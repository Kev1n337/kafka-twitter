import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class KsqlService {

  constructor(private http: HttpClient) {  }

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
    return this.http.post('http://localhost:8080/query', {'ksql': 'SELECT * FROM twitter;'});
  }
}
