import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AboutSchoolsComponent } from './about-schools.component';
describe('SchoolProfileComponent', () => {
  let component: AboutSchoolsComponent;
  let fixture: ComponentFixture<AboutSchoolsComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AboutSchoolsComponent]
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(AboutSchoolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
