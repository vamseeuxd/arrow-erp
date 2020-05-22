import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineClassesMediaGalleryComponent } from './online-classes-media-gallery.component';

describe('OnlineClassesMediaGalleryComponent', () => {
  let component: OnlineClassesMediaGalleryComponent;
  let fixture: ComponentFixture<OnlineClassesMediaGalleryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnlineClassesMediaGalleryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlineClassesMediaGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
