import {Component, OnInit} from '@angular/core';
import {KsqlService} from '../ksql.service';

@Component({
  selector: 'app-twitter-dashboard',
  templateUrl: './twitter-dashboard.component.html',
  styleUrls: ['./twitter-dashboard.component.css']
})
export class TwitterDashboardComponent implements OnInit {
  constructor(public ksql: KsqlService) {}

  ngOnInit() {
    this.ksql.initGermany();
  }


}
