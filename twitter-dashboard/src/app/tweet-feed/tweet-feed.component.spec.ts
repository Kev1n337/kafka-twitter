import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TweetFeedComponent } from './tweet-feed.component';

describe('TweetFeedComponent', () => {
  let component: TweetFeedComponent;
  let fixture: ComponentFixture<TweetFeedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TweetFeedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TweetFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
