import { Component } from "@angular/core";
import { DbListCreatorService } from "../../db-model/db-list-creator.service";
import { StudentService } from "../student.service";
import { MatDialog } from "@angular/material/dialog";
import { WebcamImage, WebcamInitError } from "ngx-webcam";
import { Subject } from "rxjs";
import { AngularFireStorage } from "@angular/fire/storage";

@Component({
  selector: "app-add-student",
  templateUrl: "./add-student.component.html",
  styleUrls: ["./add-student.component.sass"],
})
export class AddStudentComponent {
  previewPhoto = true;
  public webcamImage: WebcamImage = null;
  private triggerAction: Subject<void> = new Subject<void>();
  trigger$ = this.triggerAction.asObservable();
  public errors: WebcamInitError[] = [];

  constructor(
    public db: DbListCreatorService,
    public storage: AngularFireStorage,
    public studentService: StudentService,
    public dialog: MatDialog
  ) {}

  triggerSnapshot(): void {
    this.triggerAction.next();
  }

  handleImage(webcamImage: WebcamImage): void {
    this.webcamImage = webcamImage;
    this.previewPhoto = true;
    console.log(webcamImage);
    const file = new Blob([webcamImage.imageAsBase64], { type: "image/jpeg" });
    const filePath = "katyayini";
    this.storage
      .upload(filePath, this.b64toBlob(webcamImage.imageAsBase64))
      .then((a) => {
        debugger;
      });
  }

  b64toBlob(dataURI) {
    const byteString = atob(dataURI.split(",")[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: "image/jpeg" });
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  openImageEditor(imageEditor) {
    const dialogRef = this.dialog.open(imageEditor);
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  closeWebCamera() {
    const isConfirm = confirm("Are you sure! do you want to Close?");
    if (isConfirm) {
      this.webcamImage = null;
      this.dialog.closeAll();
    }
  }
}
