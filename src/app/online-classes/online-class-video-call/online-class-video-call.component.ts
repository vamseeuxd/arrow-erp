import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import adapter from 'webrtc-adapter';

declare var Peer: any;

@Component({
  selector: 'app-online-class-video-call',
  templateUrl: './online-class-video-call.component.html',
  styleUrls: ['./online-class-video-call.component.scss']
})
export class OnlineClassVideoCallComponent {
  @ViewChild('myCamera') myCamera: ElementRef;
  @ViewChild('otherCamera') otherCamera: ElementRef;
  peer;
  myPeerId = '';
  constraints = {
    audio: {
      echoCancellation: true
    },
    video: {
      width: 1280, height: 720
    }
  };

  async startCamera(otherUserName) {
    try {
      console.log('startCamera -> Preparing Video Call Setup for', otherUserName);
      const stream = await navigator.mediaDevices.getUserMedia(this.constraints);
      const video = this.myCamera.nativeElement;
      const videoTracks = stream.getVideoTracks();
      video.srcObject = stream;
      const call = this.peer.call(otherUserName, stream);
      call.on('stream', (remoteStream) => {
        this.otherCamera.nativeElement.srcObject = remoteStream;
      });
      console.log('startCamera -> Done Video Call Setup for', otherUserName);
    } catch (err) {
      console.error('Failed to get local stream', err);
    }
  }

  setUpChart(myUserName: string) {
    console.log('setUpChart -> Preparing Video Call Setup for', myUserName);
    this.peer = new Peer(
      {
        debug: 3,
        config: {
          iceServers: [
            {url: 'stun:stun.l.google.com:19302'},
            {url: 'stun:stun1.l.google.com:19302'},
          ]
        }
      }
    );

    this.peer.on('open', () => {
      this.myPeerId = this.peer.id;
    });

    this.peer.on('call', async (call) => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(this.constraints);
        const video = this.myCamera.nativeElement;
        const videoTracks = stream.getVideoTracks();
        video.srcObject = stream;
        call.answer(stream);
        call.on('stream', (remoteStream) => {
          this.otherCamera.nativeElement.srcObject = remoteStream;
        });
        console.log('setUpChart -> Done Video Call Setup for', myUserName);
      } catch (err) {
        console.error('Failed to get local stream', err);
      }
    });
  }
}
