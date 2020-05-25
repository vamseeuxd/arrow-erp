import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Component, Inject } from "@angular/core";
import { InstitutionsInterface } from "../../institutions.model";

@Component({
  selector: "app-form-dialog",
  templateUrl: "./form-dialog.component.html",
  styleUrls: ["./form-dialog.component.sass"],
})
export class FormDialogComponent {
  action: string;
  dialogTitle: string;
  institution: InstitutionsInterface;

  constructor(
    public dialogRef: MatDialogRef<FormDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { institution: InstitutionsInterface; action: string }
  ) {
    // Set the defaults
    this.action = data.action;
    if (this.action === "edit") {
      this.dialogTitle = data.institution.institutionName;
      this.institution = JSON.parse(JSON.stringify(data.institution));
    } else {
      this.dialogTitle = "New Institutions";
      this.institution = null;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  saveData(data: InstitutionsInterface) {
    this.dialogRef.close({ data });
  }
}
