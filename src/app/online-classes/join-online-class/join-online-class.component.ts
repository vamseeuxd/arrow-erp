import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { RightSidebarService } from "../../shared/services/rightsidebar.service";
import { MatSliderChange } from "@angular/material/slider";

declare var Peer: any;

@Component({
  selector: "app-join-online-class",
  templateUrl: "./join-online-class.component.html",
  styleUrls: ["./join-online-class.component.scss"],
})
export class JoinOnlineClassComponent implements OnInit {
  peer;
  myPeerId = "";
  teacherChatId = "";
  videoWidth = 250;
  constraints = {
    audio: true,
    video: true,
  };
  playMyAudio = true;
  myStream: MediaStream;

  @ViewChild("steamingVideo") steamingVideo: ElementRef;

  constructor(private dataService: RightSidebarService) {
    this.dataService.pageTitle = "Join Online Class";
    this.dataService.breadCrumbData = [
      { label: "online-classes", link: "" },
      { label: "join-online-class", link: "" },
    ];
  }

  ngOnInit(): void {
    this.showVideo();
    this.setUpChart();
  }

  async showVideo() {
    this.myStream = await navigator.mediaDevices.getUserMedia(this.constraints);
  }

  setUpChart() {
    this.peer = new Peer({
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
    });

    /*this.peer.on('call', async (call) => {
      try {
        call.answer(this.myStream);
        call.on('stream', (remoteStream) => {
          this.otherCamera.nativeElement.srcObject = remoteStream;
        });
        console.log('setUpChart -> Done Video Call Setup for', myUserName);
      } catch (err) {
        console.error('Failed to get local stream', err);
      }
    });*/
  }

  async classTeacher() {
    const call = this.peer.call(this.teacherChatId, this.myStream);
    console.log(call);
    call.on("stream", (remoteStream) => {
      this.steamingVideo.nativeElement.srcObject = remoteStream;
    });
  }

  updateVideoWidth($event: MatSliderChange) {
    this.videoWidth = $event.value;
  }
}
