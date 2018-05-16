import {Component, OnInit} from '@angular/core';
import {KsqlService} from '../ksql.service';

@Component({
  selector: 'app-twitter-dashboard',
  templateUrl: './twitter-dashboard.component.html',
  styleUrls: ['./twitter-dashboard.component.css']
})
export class TwitterDashboardComponent implements OnInit{

  cards = [
    { title: 'Card 1', cols: 2, rows: 1 },
    { title: 'Card 2', cols: 1, rows: 1 },
    { title: 'Card 3', cols: 1, rows: 2 },
    { title: 'Card 4', cols: 1, rows: 1 }
  ];

  constructor(private ksql: KsqlService) {}

  ngOnInit() {
    this.ksql.getTwitter();
    this.ksql.getTopic().subscribe(
    data => {
      console.log(data);
    },
    (err) => {
      console.log(err);
    },
    () => {
      console.log('Comp');
    });
  }
}
