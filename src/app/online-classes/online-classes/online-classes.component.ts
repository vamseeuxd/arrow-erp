import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import adapter from 'webrtc-adapter';

const ICE_SERVERS: RTCIceServer[] = [
  {urls: ['stun:stun.example.com', 'stun:stun-1.example.com']},
  {urls: 'stun:stun.l.google.com:19302'}
];

const PEER_CONNECTION_CONFIG: RTCConfiguration = {
  iceServers: ICE_SERVERS
};

@Component({
  selector: 'app-carousel',
  templateUrl: './online-classes.component.html',
  styleUrls: ['./online-classes.component.scss']
})
export class OnlineClassesComponent {

  @ViewChild('myVideo', {static: true}) myVideo: ElementRef;
  @ViewChild('recordedVideo', {static: true}) recordedVideo: ElementRef;
  disableShowVideoButton = false;
  disableRecordButton = true;
  disablePlayButton = true;
  disableDownloadButton = true;
  isRecording = false;
  errorMessages = '';
  stream: MediaStream;
  constraints = {
    audio: {
      echoCancellation: true
    },
    video: {
      width: 1280, height: 720
    }
  };
  recordedBlobs = [];
  mediaRecorder;

  async showCamera($event: MouseEvent) {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia(this.constraints);
      this.handleSuccess(this.stream);
      this.disableShowVideoButton = true;
    } catch (e) {
      this.handleError(e);
    }
  }

  handleError(error) {
    if (error.name === 'ConstraintNotSatisfiedError') {
      const v = (window as any).constraints.video;
      this.errorMsg(`The resolution ${v.width.exact}x${v.height.exact} px is not supported by your device.`);
    }
    else if (error.name === 'PermissionDeniedError') {
      this.errorMsg(`Permissions have not been granted to use your camera and  microphone,
      you need to allow the page access to your devices in order for the demo to work.`);
    }
    this.errorMsg(`getUserMedia error: ${error.name}`, error);
  }

  handleSuccess(stream: MediaStream) {
    const video = this.myVideo.nativeElement;
    const videoTracks = stream.getVideoTracks();
    console.log('Got stream with constraints:', this.constraints);
    console.log(`Using video device: ${videoTracks[0].label}`);
    video.srcObject = stream;
    this.disableRecordButton = false;
  }

  errorMsg(msg, error = null) {
    this.errorMessages += `<p>${msg}</p>`;
    if (typeof error !== null) {
      console.error(error);
    }
  }

  recordingButtonClick($event: MouseEvent) {
    if (!this.isRecording) {
      this.startRecording();
    }
    else {
      this.stopRecording();
      this.isRecording = false;
      this.disablePlayButton = false;
      this.disableDownloadButton = false;
    }
  }

  startRecording() {
    this.recordedBlobs = [];
    let options = {mimeType: 'video/webm;codecs=vp9,opus'};
    if (!(window as any).MediaRecorder.isTypeSupported(options.mimeType)) {
      console.error(`${options.mimeType} is not supported`);
      options = {mimeType: 'video/webm;codecs=vp8,opus'};
      if (!(window as any).MediaRecorder.isTypeSupported(options.mimeType)) {
        console.error(`${options.mimeType} is not supported`);
        options = {mimeType: 'video/webm'};
        if (!(window as any).MediaRecorder.isTypeSupported(options.mimeType)) {
          console.error(`${options.mimeType} is not supported`);
          options = {mimeType: ''};
        }
      }
    }

    try {
      this.mediaRecorder = new (window as any).MediaRecorder(this.stream, options);
    } catch (e) {
      console.error('Exception while creating MediaRecorder:', e);
      this.errorMessages = `Exception while creating MediaRecorder: ${JSON.stringify(e)}`;
      return;
    }

    console.log('Created MediaRecorder', this.mediaRecorder, 'with options', options);
    this.isRecording = true;
    this.disablePlayButton = true;
    this.disableDownloadButton = true;
    this.mediaRecorder.onstop = (event) => {
      console.log('Recorder stopped: ', event);
      console.log('Recorded Blobs: ', this.recordedBlobs);
    };
    this.mediaRecorder.ondataavailable = this.handleDataAvailable.bind(this);
    this.mediaRecorder.start();
    console.log('MediaRecorder started', this.mediaRecorder);
  }

  handleDataAvailable(event) {
    console.log('handleDataAvailable', event);
    if (event.data && event.data.size > 0) {
      this.recordedBlobs.push(event.data);
    }
  }

  stopRecording() {
    this.mediaRecorder.stop();
  }

  downLoadVideo($event: MouseEvent) {
    const blob = new Blob(this.recordedBlobs, {type: 'video/webm'});
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'test.webm';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 100);
  }

  playVideo($event: MouseEvent) {
    const recordedVideo = this.recordedVideo.nativeElement;
    const superBuffer = new Blob(this.recordedBlobs, {type: 'video/webm'});
    recordedVideo.src = null;
    recordedVideo.srcObject = null;
    recordedVideo.src = window.URL.createObjectURL(superBuffer);
    recordedVideo.controls = true;
    recordedVideo.play();
  }

}
