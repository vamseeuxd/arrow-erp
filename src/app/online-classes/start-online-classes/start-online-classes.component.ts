import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import adapter from "webrtc-adapter";
import { RightSidebarService } from "../../shared/utilities/rightsidebar.service";
import { OnlineClassesService } from "../online-classes.service";
import { BusyIndicatorService } from "../../layout/busy-indicator.service";
import { MatDialog } from "@angular/material/dialog";
import { map, switchMap } from "rxjs/operators";
import { OnlineClassInterface } from "../interfaces/online-class.interface";
import { CdkDragEnd } from "@angular/cdk/drag-drop";
import { OnlineClassChatComponent } from "./online-class-chat/online-class-chat.component";
import { OnlineClassVideoCallComponent } from "./online-class-video-call/online-class-video-call.component";
import { ChatMemberInterface } from "../interfaces/chat-member.interface";

const document: any = window.document;

@Component({
  selector: "app-carousel",
  templateUrl: "./start-online-classes.component.html",
  styleUrls: ["./start-online-classes.component.scss"],
})
export class StartOnlineClassesComponent implements OnInit {
  teacherId = "teacher2";
  isChatOpen = false;
  showMyVideo = false;
  isFullScreenDrag = false;
  window$ = window;
  fullScreen = false;
  showPaintTool = true;
  showImageGallery = false;
  selectedClass: OnlineClassInterface;
  filteredClasses = this.onlineClassesService.onlineClassesList.pipe(
    map((value) => {
      const returnList = value.filter((d) => d.teacher === this.teacherId);
      return returnList;
    })
  );
  private videoCallComponent: OnlineClassVideoCallComponent;
  whiteBoardImageUrl = "";

  constructor(
    public onlineClassesService: OnlineClassesService,
    private busyIndicator: BusyIndicatorService,
    public dialog: MatDialog,
    private dataService: RightSidebarService
  ) {
    this.dataService.pageTitle = "Start Online Classes";
    this.dataService.breadCrumbData = [
      { label: "online-classes", link: "" },
      { label: "start-online-classes", link: "" },
    ];
  }

  ngOnInit(): void {}

  updateSelectedOnlineClass(onlineClass: OnlineClassInterface) {
    this.callOnlineClassFullscreen(null);
    setTimeout(() => {
      this.selectedClass = onlineClass;
    });
  }

  async updateTeacherVideoChatId(
    videoCallComponent: OnlineClassVideoCallComponent
  ) {
    this.videoCallComponent = videoCallComponent;
    const busyIndicatorId = this.busyIndicator.show();
    /*this.selectedClass.chatMembers = [
      {
        peerID: videoCallComponent.myPeerId,
        role: 'teacher',
        userId: this.teacherId,
      },
    ];*/
    const member: ChatMemberInterface = {
      onlineClassId: this.selectedClass.id,
      role: "teacher",
      peerID: videoCallComponent.myPeerId,
      userId: this.teacherId,
    };
    await this.onlineClassesService.joinIntoChat(member);
    this.selectedClass.isStarted = true;
    this.selectedClass.startTime = this.onlineClassesService.getServerTime();
    await this.onlineClassesService.updateOnlineClasses(
      this.selectedClass,
      this.selectedClass.id,
      this.selectedClass.createdOn
    );
    this.busyIndicator.hide(busyIndicatorId);
  }

  async callOnlineClassFullscreen(stopClassConfirmation) {
    if (this.isFullScreenDrag) {
      this.isFullScreenDrag = false;
    } else {
      if (this.fullScreen && stopClassConfirmation) {
        this.dialog.open(stopClassConfirmation);
        return null;
      }
      /*  ????????????????????????????????????  */
      if (this.fullScreen) {
        this.fullScreen = false;
        this.busyIndicator.showSideNav = true;
        this.busyIndicator.showAppHeader = true;
      } else {
        this.fullScreen = true;
        this.busyIndicator.showSideNav = false;
        this.busyIndicator.showAppHeader = false;
      }
      return;
      /*  ????????????????????????????????????  */
      /*  ------------------------------------  */
      if (
        !document.fullscreenElement &&
        !document.mozFullScreenElement &&
        !document.webkitFullscreenElement &&
        !document.msFullscreenElement
      ) {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
          this.fullScreen = true;
          this.busyIndicator.showSideNav = false;
          this.busyIndicator.showAppHeader = false;
        } else if (document.documentElement.msRequestFullscreen) {
          await document.documentElement.msRequestFullscreen();
          this.fullScreen = true;
          this.busyIndicator.showSideNav = false;
          this.busyIndicator.showAppHeader = false;
        } else if (document.documentElement.mozRequestFullScreen) {
          await document.documentElement.mozRequestFullScreen();
          this.fullScreen = true;
          this.busyIndicator.showSideNav = false;
          this.busyIndicator.showAppHeader = false;
        } else if (document.documentElement.webkitRequestFullscreen) {
          await document.documentElement.webkitRequestFullscreen();
          this.fullScreen = true;
          this.busyIndicator.showSideNav = false;
          this.busyIndicator.showAppHeader = false;
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
          this.fullScreen = false;
          this.selectedClass = null;
          this.busyIndicator.showSideNav = true;
          this.busyIndicator.showAppHeader = true;
        } else if (document.msExitFullscreen) {
          await document.msExitFullscreen();
          this.fullScreen = false;
          this.selectedClass = null;
          this.busyIndicator.showSideNav = true;
          this.busyIndicator.showAppHeader = true;
        } else if (document.mozCancelFullScreen) {
          await document.mozCancelFullScreen();
          this.fullScreen = false;
          this.selectedClass = null;
          this.busyIndicator.showSideNav = true;
          this.busyIndicator.showAppHeader = true;
        } else if (document.webkitExitFullscreen) {
          await document.webkitExitFullscreen();
          this.fullScreen = false;
          this.selectedClass = null;
          this.busyIndicator.showSideNav = true;
          this.busyIndicator.showAppHeader = true;
        }
      }
      /*  ------------------------------------  */
    }
  }

  onFullScreenDragEnd($event: CdkDragEnd) {
    this.isFullScreenDrag = true;
  }

  toggleMyVideo() {
    if (this.isFullScreenDrag) {
      this.isFullScreenDrag = false;
    } else {
      this.showMyVideo = !this.showMyVideo;
    }
  }

  toggleChat(onLineClassChat: OnlineClassChatComponent) {
    if (this.isFullScreenDrag) {
      this.isFullScreenDrag = false;
    } else {
      this.isChatOpen
        ? onLineClassChat.closeSideBar()
        : onLineClassChat.openSideBar();
    }
  }

  async endOnlineClass() {
    this.callOnlineClassFullscreen(null);
    this.videoCallComponent?.stopVideoCam();
    const busyIndicatorId = this.busyIndicator.show();
    this.selectedClass.isStarted = false;
    this.selectedClass.endTime = this.onlineClassesService.getServerTime();
    await this.onlineClassesService.updateOnlineClasses(
      this.selectedClass,
      this.selectedClass.id,
      this.selectedClass.createdOn
    );
    this.selectedClass = null;
    this.busyIndicator.hide(busyIndicatorId);
  }

  async resetClass(selectedClass: OnlineClassInterface) {
    delete selectedClass.startTime;
    delete selectedClass.endTime;
    delete selectedClass.chatMembers;
    delete selectedClass.isStarted;
    const busyIndicatorId = this.busyIndicator.show();
    await this.onlineClassesService.updateOnlineClasses(
      selectedClass,
      selectedClass.id,
      selectedClass.createdOn
    );
    this.busyIndicator.hide(busyIndicatorId);
  }
}
