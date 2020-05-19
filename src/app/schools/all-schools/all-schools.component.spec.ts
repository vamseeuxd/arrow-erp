import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AllSchoolsComponent } from './all-schools.component';
describe('AllprofessorsComponent', () => {
  let component: AllSchoolsComponent;
  let fixture: ComponentFixture<AllSchoolsComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AllSchoolsComponent]
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(AllSchoolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
