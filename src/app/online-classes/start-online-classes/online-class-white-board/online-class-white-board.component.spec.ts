import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { OnlineClassWhiteBoardComponent } from "./online-class-white-board.component";

describe("OnlineClassWhiteBoardComponent", () => {
  let component: OnlineClassWhiteBoardComponent;
  let fixture: ComponentFixture<OnlineClassWhiteBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OnlineClassWhiteBoardComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlineClassWhiteBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
