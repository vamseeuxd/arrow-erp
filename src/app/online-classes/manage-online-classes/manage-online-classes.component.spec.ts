import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ManageOnlineClassesComponent } from "./manage-online-classes.component";

describe("ManageOnlineClassesComponent", () => {
  let component: ManageOnlineClassesComponent;
  let fixture: ComponentFixture<ManageOnlineClassesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ManageOnlineClassesComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageOnlineClassesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
