import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormControl } from "@angular/forms";
import { CdkDragEnd } from "@angular/cdk/drag-drop";

@Component({
  selector: "app-online-class-chat",
  templateUrl: "./online-class-chat.component.html",
  styleUrls: ["./online-class-chat.component.scss"],
})
export class OnlineClassChatComponent implements OnInit {
  readonly CHATROOM = "CHATROOM";
  readonly STUDENT_LIST = "STUDENT_LIST";
  @Input() isOpenSidebar = false;
  isDragEnd = false;
  rightSidePanelActiveTab = this.CHATROOM;
  @Input() hideStudentList = false;
  maxHeight: string;
  maxWidth: string;
  hideRequiredControl = new FormControl(false);
  @Output() isOpenSidebarChange: EventEmitter<boolean> = new EventEmitter<
    boolean
  >();

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
    this.isOpenSidebar = show;
    this.isOpenSidebarChange.emit(this.isOpenSidebar);
  }

  onDragEnd($event: CdkDragEnd) {
    this.isDragEnd = true;
  }

  openSideBar() {
    if (this.isDragEnd) {
      this.isDragEnd = false;
    } else {
      this.isOpenSidebar = true;
      this.isOpenSidebarChange.emit(this.isOpenSidebar);
    }
  }

  closeSideBar() {
    this.isOpenSidebar = false;
    this.isOpenSidebarChange.emit(this.isOpenSidebar);
  }
}
