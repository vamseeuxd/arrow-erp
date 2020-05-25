import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { OnlineClassesAddMediaComponent } from "./online-classes-add-media.component";

describe("OnlineClassesAddMediaComponent", () => {
  let component: OnlineClassesAddMediaComponent;
  let fixture: ComponentFixture<OnlineClassesAddMediaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OnlineClassesAddMediaComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlineClassesAddMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
