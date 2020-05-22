import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DomSanitizer} from '@angular/platform-browser';
import {NgForm} from '@angular/forms';
import {ONLINE_CLASS_ACTION} from '../interfaces/online-class-action.enum';
import {OnlineClassMediaDetails} from '../interfaces/online-class-media-details.interface';

export interface DialogData {
  action: ONLINE_CLASS_ACTION;
  mediaDetails?: OnlineClassMediaDetails;
}

@Component({
  selector: 'app-online-classes-add-media',
  templateUrl: './online-classes-add-media.component.html',
  styleUrls: ['./online-classes-add-media.component.scss']
})
export class OnlineClassesAddMediaComponent implements OnInit {
  modalTile = '';
  modalType = '';
  readonly OnlineClassAction = ONLINE_CLASS_ACTION;

  constructor(
    public sanitizer: DomSanitizer,
    public dialogRef: MatDialogRef<OnlineClassesAddMediaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.updateTitle();
  }

  updateTitle() {
    switch (this.data.action) {
      case ONLINE_CLASS_ACTION.ADD_IMAGE:
        this.modalTile = 'Add Image for Online Class';
        this.modalType = 'Media';
        break;
      case ONLINE_CLASS_ACTION.ADD_VIDEO:
        this.modalTile = 'Add Video for Online Class';
        this.modalType = 'Youtube Video';
        break;
      case ONLINE_CLASS_ACTION.UPDATE_IMAGE:
        this.modalTile = 'Update Image for Online Class';
        this.modalType = 'Image';
        break;
      case ONLINE_CLASS_ACTION.UPDATE_VIDEO:
        this.modalTile = 'Update Image for Online Class';
        this.modalType = 'Youtube Video';
        break;
    }
  }


  ngOnInit(): void {
  }

  saveMedialDetails(arrowForm: NgForm) {
    if (this.data.action === ONLINE_CLASS_ACTION.ADD_IMAGE) {
      this.dialogRef.close(arrowForm.value);
    }
    else if (this.data.action === ONLINE_CLASS_ACTION.UPDATE_IMAGE) {
      this.dialogRef.close({...arrowForm.value, id: this.data.mediaDetails.id, position: this.data.mediaDetails.position});
    }
    arrowForm.resetForm();
  }
}
