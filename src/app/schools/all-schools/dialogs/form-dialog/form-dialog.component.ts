import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Component, Inject} from '@angular/core';
import {Schools, SchoolsInterface} from '../../schools.model';

@Component({
  selector: 'app-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['./form-dialog.component.sass']
})
export class FormDialogComponent {
  action: string;
  dialogTitle: string;
  school: SchoolsInterface;

  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { school: SchoolsInterface, action: string },
  ) {
    // Set the defaults
    this.action = data.action;
    if (this.action === 'edit') {
      this.dialogTitle = data.school.institutionName;
      this.school = JSON.parse(JSON.stringify(data.school));
    }
    else {
      this.dialogTitle = 'New Schools';
      this.school = null;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  saveData(data: SchoolsInterface) {
    this.dialogRef.close({data});
  }
}
