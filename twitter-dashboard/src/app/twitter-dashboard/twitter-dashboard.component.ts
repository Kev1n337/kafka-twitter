import {Component, OnInit} from '@angular/core';
import {KsqlService} from '../ksql.service';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import {Topic} from '../topic.model';

@Component({
  selector: 'app-twitter-dashboard',
  templateUrl: './twitter-dashboard.component.html',
  styleUrls: ['./twitter-dashboard.component.css']
})
export class TwitterDashboardComponent implements OnInit {

  constructor(public ksql: KsqlService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      switch (params['topic']) {
        case 'germany':
          this.ksql.changeTopic('Germany');
          break;
        case 'trump':
          this.ksql.changeTopic('Trump');
          break;
        case 'cloud':
          this.ksql.changeTopic('Cloud');
          break;
      }
    });
  }


}
