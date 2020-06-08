import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { RightSidebarService } from "../../shared/utilities/rightsidebar.service";
import { MatSliderChange } from "@angular/material/slider";
import { OnlineClassesService } from "../online-classes.service";
import { map } from "rxjs/operators";
import { OnlineClassInterface } from "../interfaces/online-class.interface";
import { BusyIndicatorService } from "../../layout/busy-indicator.service";
import { MatDialog } from "@angular/material/dialog";
import { CdkDragEnd } from "@angular/cdk/drag-drop";
import { OnlineClassChatComponent } from "../start-online-classes/online-class-chat/online-class-chat.component";

declare var Peer: any;
const document: any = window.document;

@Component({
  selector: "app-join-online-class",
  templateUrl: "./join-online-class.component.html",
  styleUrls: ["./join-online-class.component.scss"],
})
export class JoinOnlineClassComponent implements OnInit {
  isChatOpen = false;
  peer;
  isFullScreenDrag = false;
  @ViewChild("teacherVideo") teacherVideo: ElementRef;
  studentId = "student1";
  selectedClass: OnlineClassInterface;
  teacherChatDetails: { peerID: string; role: string; userId: string };
  window$ = window;
  fullScreen = false;
  filteredClasses = this.onlineClassesService.onlineClassesList.pipe(
    map((value) => {
      return value.filter((d) => d.students.includes(this.studentId));
    })
  );
  private myPeerId: string;
  private onlineCall: any;

  constructor(
    public onlineClassesService: OnlineClassesService,
    private busyIndicator: BusyIndicatorService,
    public dialog: MatDialog,
    private dataService: RightSidebarService
  ) {
    this.dataService.pageTitle = "Join Online Class";
    this.dataService.breadCrumbData = [
      { label: "online-classes", link: "" },
      { label: "join-online-class", link: "" },
    ];
  }

  onFullScreenDragEnd($event: CdkDragEnd) {
    this.isFullScreenDrag = true;
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

  async callOnlineClassFullscreen(stopClassConfirmation) {
    if (this.isFullScreenDrag) {
      this.isFullScreenDrag = false;
    } else {
      if (this.fullScreen && stopClassConfirmation) {
        this.dialog.open(stopClassConfirmation);
        return null;
      }
      if (this.fullScreen) {
        this.selectedClass = null;
        this.fullScreen = false;
        this.busyIndicator.showSideNav = true;
        this.busyIndicator.showAppHeader = true;
      } else {
        this.fullScreen = true;
        this.busyIndicator.showSideNav = false;
        this.busyIndicator.showAppHeader = false;
      }
      return;
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

  ngOnInit(): void {}

  updateSelectedOnlineClass(
    onlineClass: OnlineClassInterface,
    onlineClassNotStartedTemplate
  ) {
    if (onlineClass.chatMembers) {
      this.teacherChatDetails = onlineClass.chatMembers.find(
        (value) => value.role === "teacher"
      );
      if (this.teacherChatDetails) {
        this.callOnlineClassFullscreen(null);
        setTimeout(() => {
          this.selectedClass = onlineClass;
          this.connectTeacherVideo();
        });
      } else {
        this.dialog.open(onlineClassNotStartedTemplate);
      }
    } else {
      this.dialog.open(onlineClassNotStartedTemplate);
    }
  }

  connectTeacherVideo() {
    this.myPeerId = "123123";
    this.updateStudentVideoChatId();
    /*this.peer = new Peer({
      debug: 3,
      config: {
        iceServers: [
          { url: "stun:stun.l.google.com:19302" },
          { url: "stun:stun1.l.google.com:19302" },
        ],
      },
    });
    this.peer.on("open", () => {
      this.myPeerId = this.peer.id;
      setTimeout(() => {
        this.updateStudentVideoChatId();
      }, 50);
    });*/
  }

  async updateStudentVideoChatId() {
    const busyIndicatorId = this.busyIndicator.show();
    const chatMemberInfo: any = {};
    chatMemberInfo.peerID = this.myPeerId;
    chatMemberInfo.role = "student";
    chatMemberInfo.userId = this.studentId;
    chatMemberInfo.joinTime = this.onlineClassesService.getServerTime();
    this.selectedClass.chatMembers.push(chatMemberInfo);
    await this.onlineClassesService.updateOnlineClasses(
      this.selectedClass,
      this.selectedClass.id,
      this.selectedClass.createdOn
    );
    if (this.peer) {
      this.onlineCall = this.peer.call(this.teacherChatDetails.peerID, null);
      this.onlineCall.on("stream", (stream) => {
        (this.teacherVideo
          .nativeElement as HTMLVideoElement).srcObject = stream;
      });
    }
    this.busyIndicator.hide(busyIndicatorId);
  }
}
