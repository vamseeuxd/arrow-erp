import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { OnlineClassChatComponent } from "./online-class-chat.component";
describe("ChatComponent", () => {
  let component: OnlineClassChatComponent;
  let fixture: ComponentFixture<OnlineClassChatComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OnlineClassChatComponent],
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(OnlineClassChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
