
import { fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { TwitterDashboardComponent } from './twitter-dashboard.component';

describe('TwitterDashboardComponent', () => {
  let component: TwitterDashboardComponent;
  let fixture: ComponentFixture<TwitterDashboardComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TwitterDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TwitterDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
