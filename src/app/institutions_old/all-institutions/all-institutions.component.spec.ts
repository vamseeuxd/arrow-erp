import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { AllInstitutionsComponent } from "./all-institutions.component";
describe("AllprofessorsComponent", () => {
  let component: AllInstitutionsComponent;
  let fixture: ComponentFixture<AllInstitutionsComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AllInstitutionsComponent],
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(AllInstitutionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
