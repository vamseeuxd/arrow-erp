import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { OnlineClassesComponent } from './online-classes.component';
describe('CarouselComponent', () => {
  let component: OnlineClassesComponent;
  let fixture: ComponentFixture<OnlineClassesComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OnlineClassesComponent]
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(OnlineClassesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
