import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { TwitterDashboardComponent } from './twitter-dashboard/twitter-dashboard.component';
import {
  MatGridListModule,
  MatCardModule,
  MatMenuModule,
  MatIconModule,
  MatButtonModule,
  MatToolbarModule,
  MatSidenavModule,
  MatListModule,
  MatTableModule
} from '@angular/material';
import { NavigationComponent } from './navigation/navigation.component';
import { LayoutModule } from '@angular/cdk/layout';
import {AppRoutingModule} from './routing-module.module';
import {KsqlService} from './ksql.service';
import {HttpClientModule} from '@angular/common/http';
import { TweetFeedComponent } from './tweet-feed/tweet-feed.component';
import { HashtagsComponent } from './hashtags/hashtags.component';
import { TopUserComponent } from './top-user/top-user.component';

@NgModule({
  declarations: [
    AppComponent,
    TwitterDashboardComponent,
    NavigationComponent,
    TweetFeedComponent,
    HashtagsComponent,
    TopUserComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    LayoutModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    AppRoutingModule,
    HttpClientModule,
    MatTableModule
  ],
  providers: [KsqlService],
  bootstrap: [AppComponent]
})
export class AppModule { }
