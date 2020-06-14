import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { OnlineClassesListComponent } from "./online-classes-list.component";

describe("OnlineClassesListComponent", () => {
  let component: OnlineClassesListComponent;
  let fixture: ComponentFixture<OnlineClassesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OnlineClassesListComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlineClassesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
