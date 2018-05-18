import {Component, OnInit} from '@angular/core';
import {KsqlService} from '../ksql.service';

@Component({
  selector: 'app-twitter-dashboard',
  templateUrl: './twitter-dashboard.component.html',
  styleUrls: ['./twitter-dashboard.component.css']
})
export class TwitterDashboardComponent implements OnInit {

  data = [];


  constructor(private ksql: KsqlService) {}

  ngOnInit() {
    this.ksql.initSocket();
    this.ksql.onMessage().subscribe((data: any) => {
      this.data.push(data);
      if (this.data.length > 10000) {
        this.data.shift();
      }
      console.log(this.data.length);
    });

    // this.ksql.getTwitter();

  }


}
