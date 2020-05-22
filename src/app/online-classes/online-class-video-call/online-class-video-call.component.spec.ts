import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineClassVideoCallComponent } from './online-class-video-call.component';

describe('OnlineClassVideoCallComponent', () => {
  let component: OnlineClassVideoCallComponent;
  let fixture: ComponentFixture<OnlineClassVideoCallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnlineClassVideoCallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlineClassVideoCallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
