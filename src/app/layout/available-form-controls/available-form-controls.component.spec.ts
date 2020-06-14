import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AvailableFormControlsComponent } from "./available-form-controls.component";

describe("AvailableFormControlsComponent", () => {
  let component: AvailableFormControlsComponent;
  let fixture: ComponentFixture<AvailableFormControlsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AvailableFormControlsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvailableFormControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
