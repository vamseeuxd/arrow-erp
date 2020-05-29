import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { JoinOnlineClassComponent } from "./join-online-class.component";

describe("JoinOnlineClassComponent", () => {
  let component: JoinOnlineClassComponent;
  let fixture: ComponentFixture<JoinOnlineClassComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [JoinOnlineClassComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinOnlineClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
