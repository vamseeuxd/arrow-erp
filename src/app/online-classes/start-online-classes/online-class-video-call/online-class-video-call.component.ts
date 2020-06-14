import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import adapter from "webrtc-adapter";
import { MatSliderChange } from "@angular/material/slider";

declare var Peer: any;

@Component({
  selector: "app-online-class-video-call",
  templateUrl: "./online-class-video-call.component.html",
  styleUrls: ["./online-class-video-call.component.scss"],
})
export class OnlineClassVideoCallComponent implements OnInit {
  @Input() boundary = "";
  @ViewChild("myCamera") myCamera: ElementRef;
  @ViewChild("otherCamera") otherCamera: ElementRef;
  @Output() updateTeacherVideoChatId: EventEmitter<
    OnlineClassVideoCallComponent
  > = new EventEmitter<OnlineClassVideoCallComponent>();
  @Input() myStream: MediaStream;
  peer;
  myPeerId = "";
  videoWidth = 250;
  playMyVideo = true;
  playMyAudio = false;
  allCalls = [];

  setUpChart() {
    console.clear();
    console.log("new Peer");
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
      setTimeout(() => {
        this.updateTeacherVideoChatId.emit(this);
      }, 50);
    });

    /*setTimeout(() => {
      this.myPeerId = 'test123456';
      this.updateTeacherVideoChatId.emit('test123456');
    }, 500);*/

    this.peer.on("call", async (call) => {
      try {
        this.allCalls.push(call);
        call.answer(this.myStream);
        /*call.on('stream', (remoteStream) => {
          this.otherCamera.nativeElement.srcObject = remoteStream;
        });*/
        console.log("setUpChart -> Done Video Call Setup for");
      } catch (err) {
        console.error("Failed to get local stream", err);
      }
    });
  }

  ngOnInit(): void {
    this.showVideo();
  }

  async showVideo() {
    /*this.myStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: this.playMyAudio,
    });
    const video = this.myCamera.nativeElement;
    video.srcObject = this.myStream;*/
    setTimeout(() => {
      this.myPeerId = "test123456";
      this.updateTeacherVideoChatId.emit(this);
    }, 500);
    // this.setUpChart();
  }

  updateVideoWidth($event: MatSliderChange) {
    this.videoWidth = $event.value;
  }

  onVideoPlayClick($event: Event) {}

  stopVideoCam() {
    if (this.myStream) {
      this.myStream.getTracks().forEach((track) => {
        track.stop();
      });
    }
  }

  onVideoPauseClick($event: Event) {
    this.allCalls.forEach((call) => {
      call.answer(this.myStream);
    });
  }

  async muteAudio(playMyAudio: boolean) {
    this.playMyAudio = playMyAudio;
    this.myStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: this.playMyAudio,
    });
    const video = this.myCamera.nativeElement;
    video.srcObject = this.myStream;
    this.allCalls.forEach((call) => {
      call.answer(this.myStream);
    });
  }
}
