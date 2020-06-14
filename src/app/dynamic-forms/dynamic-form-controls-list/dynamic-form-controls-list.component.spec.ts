import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { DynamicFormControlsListComponent } from "./dynamic-form-controls-list.component";

describe("DynamicFormControlsListComponent", () => {
  let component: DynamicFormControlsListComponent;
  let fixture: ComponentFixture<DynamicFormControlsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DynamicFormControlsListComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicFormControlsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
