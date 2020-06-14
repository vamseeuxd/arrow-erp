import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ManageDynamicFormsComponent } from "./manage-dynamic-forms.component";

describe("ManageDynamicFormsComponent", () => {
  let component: ManageDynamicFormsComponent;
  let fixture: ComponentFixture<ManageDynamicFormsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ManageDynamicFormsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageDynamicFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
