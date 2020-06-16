import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Component, Inject } from "@angular/core";
import { InstitutionsService } from "../../institutions.service";
import { InstitutionsInterface } from "../../institutions.model";
import { BusyIndicatorService } from "../../../../layout/busy-indicator.service";

@Component({
  selector: "app-delete",
  templateUrl: "./delete.component.html",
  styleUrls: ["./delete.component.sass"],
})
export class DeleteDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: InstitutionsInterface,
    private busyIndicator: BusyIndicatorService,
    public institutionsService: InstitutionsService
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  async confirmDelete() {
    const busyIndicatorId = this.busyIndicator.show();
    await this.institutionsService.deleteInstitutions(this.data.id);
    this.busyIndicator.hide(busyIndicatorId);
  }
}
