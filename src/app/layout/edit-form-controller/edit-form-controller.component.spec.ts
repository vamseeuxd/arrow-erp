import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { EditFormControllerComponent } from "./edit-form-controller.component";

describe("EditFormControllerComponent", () => {
  let component: EditFormControllerComponent;
  let fixture: ComponentFixture<EditFormControllerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditFormControllerComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditFormControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
