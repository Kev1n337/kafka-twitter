import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopUserComponent } from './top-user.component';

describe('TopUserComponent', () => {
  let component: TopUserComponent;
  let fixture: ComponentFixture<TopUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
