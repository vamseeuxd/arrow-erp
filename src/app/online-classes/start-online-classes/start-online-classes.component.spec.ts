import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { StartOnlineClassesComponent } from "./start-online-classes.component";
describe("CarouselComponent", () => {
  let component: StartOnlineClassesComponent;
  let fixture: ComponentFixture<StartOnlineClassesComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StartOnlineClassesComponent],
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(StartOnlineClassesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
