import {Component, OnInit} from '@angular/core';
import {KsqlService} from '../ksql.service';
import {MatTableDataSource} from "@angular/material";

@Component({
  selector: 'app-twitter-dashboard',
  templateUrl: './twitter-dashboard.component.html',
  styleUrls: ['./twitter-dashboard.component.css']
})
export class TwitterDashboardComponent implements OnInit {

  displayedColumns = ['time', 'name', 'text'];
  displayedTweets = [];
  dataSource = new MatTableDataSource(this.displayedTweets);
  data = [];


  constructor(private ksql: KsqlService) {}

  ngOnInit() {
    this.ksql.initSocket();
    this.ksql.onMessage().subscribe((data: any) => {
      this.data.push(data);
      console.log(this.data.length);
      this.displayedTweets.push(data);
      /*if (this.data.length > 10000) {
        this.data.shift();
      }*/
      if (this.displayedTweets.length > 5) {
        this.displayedTweets.shift();
      }
      this.dataSource.data = this.displayedTweets;
    });

    this.ksql.getTwitter();

  }


}
