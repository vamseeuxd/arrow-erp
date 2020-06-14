import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { DynamicFormsListComponent } from "./dynamic-forms-list.component";

describe("DynamicFormsListComponent", () => {
  let component: DynamicFormsListComponent;
  let fixture: ComponentFixture<DynamicFormsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DynamicFormsListComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicFormsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
