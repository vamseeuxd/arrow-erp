import { Component, Input, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";

@Component({
  selector: "app-online-class-chat",
  templateUrl: "./online-class-chat.component.html",
  styleUrls: ["./online-class-chat.component.scss"],
})
export class OnlineClassChatComponent implements OnInit {
  readonly CHATROOM = "CHATROOM";
  readonly STUDENT_LIST = "STUDENT_LIST";
  isOpenSidebar = false;
  rightSidePanelActiveTab = this.CHATROOM;
  @Input() hideStudentList = false;
  maxHeight: string;
  maxWidth: string;
  hideRequiredControl = new FormControl(false);

  constructor() {}

  ngOnInit() {
    this.setRightSidebarWindowHeight();
  }

  setRightSidebarWindowHeight() {
    const height = window.innerHeight - 137;
    this.maxHeight = height + "";
    this.maxWidth = "500px";
  }

  onClickedOutside($event: Event) {
    // this.isOpenSidebar = false;
  }

  toggleRightSidebar(show: boolean) {
    console.log(show);
    this.isOpenSidebar = show;
  }
}
