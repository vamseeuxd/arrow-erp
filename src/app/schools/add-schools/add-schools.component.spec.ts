import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AddSchoolsComponent } from './add-schools.component';
describe('AddSchoolComponent', () => {
  let component: AddSchoolsComponent;
  let fixture: ComponentFixture<AddSchoolsComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddSchoolsComponent]
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(AddSchoolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
