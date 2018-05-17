import {Component, OnInit} from '@angular/core';
import {KsqlService} from '../ksql.service';

@Component({
  selector: 'app-twitter-dashboard',
  templateUrl: './twitter-dashboard.component.html',
  styleUrls: ['./twitter-dashboard.component.css']
})
export class TwitterDashboardComponent implements OnInit {

  cards = [
    { title: 'Card 1', cols: 2, rows: 1 },
    { title: 'Card 2', cols: 1, rows: 1 },
    { title: 'Card 3', cols: 1, rows: 2 },
    { title: 'Card 4', cols: 1, rows: 1 }
  ];
  data = [];

  constructor(private ksql: KsqlService) {}

  ngOnInit() {



    this.ksql.initSocket();
    this.ksql.onMessage().subscribe((data: any) => {
      console.log(this.data.length);
      this.data.push(data);

      if (this.data.length > 10000) {
        this.data.shift();
      }
    });

    this.ksql.getTwitter();

  }


}
