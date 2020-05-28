import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormControl, NgForm } from "@angular/forms";
import { OnlineClassMediaDetails } from "../interfaces/online-class-media-details.interface";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { MatChipInputEvent } from "@angular/material/chips";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { BehaviorSubject, Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { OnlineClassesService } from "../online-classes.service";
import { BusyIndicatorService } from "../../layout/busy-indicator.service";
import { OnlineClassInterface } from "../interfaces/online-class.interface";
import { MatCalendarCellCssClasses } from "@angular/material/datepicker";
import { MatDialog } from "@angular/material/dialog";
import { MatDialogRef } from "@angular/material/dialog/dialog-ref";
import { RightSidebarService } from "../../shared/services/rightsidebar.service";

@Component({
  selector: "app-manage-online-classes",
  templateUrl: "./manage-online-classes.component.html",
  styleUrls: ["./manage-online-classes.component.scss"],
})
export class ManageOnlineClassesComponent {
  onlineClass: OnlineClassInterface;
  minDate: Date;
  maxDate: Date;
  onlineClassFormTitle = "Add New Online Class";
  onlineClassFormDialogRef: MatDialogRef<any>;

  dateClass = (d: Date): MatCalendarCellCssClasses => {
    const date = d.getDate();
    return date === 1 || date === 20
      ? "bg-warning rounded-circle disabled"
      : "";
  };

  constructor(
    public onlineClassesService: OnlineClassesService,
    private busyIndicator: BusyIndicatorService,
    public dialog: MatDialog,
    private dataService: RightSidebarService
  ) {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const currentDate = new Date().getDate();
    this.minDate = new Date();
    this.maxDate = new Date(currentYear, currentMonth + 3, currentDate);

    this.dataService.pageTitle = "Manage Online Classes";
    this.dataService.breadCrumbData = [
      { label: "online-classes", link: "" },
      { label: "manage-online-classes", link: "" },
    ];
  }

  async saveOnlineClass(arrowForm: NgForm) {
    if (this.onlineClass) {
      const busyIndicatorId = this.busyIndicator.show();
      await this.onlineClassesService.updateOnlineClasses(
        arrowForm.value,
        this.onlineClass.id,
        this.onlineClass.createdOn
      );
      arrowForm.resetForm();
      this.busyIndicator.hide(busyIndicatorId);
      this.onlineClassFormDialogRef.close();
    } else {
      const busyIndicatorId = this.busyIndicator.show();
      await this.onlineClassesService.addOnlineClasses(arrowForm.value);
      arrowForm.resetForm();
      this.busyIndicator.hide(busyIndicatorId);
      this.onlineClassFormDialogRef.close();
    }
  }

  editOnlineClass(
    onlineClassFormTemplate,
    onLineClassToEdit: OnlineClassInterface
  ) {
    this.onlineClassFormTitle = `Edit Online Class`;
    this.onlineClass = JSON.parse(JSON.stringify(onLineClassToEdit));
    this.onlineClass.classTime = new Date(this.onlineClass.classTime);
    this.onlineClass.classDate = new Date(this.onlineClass.classDate);
    this.onlineClassFormDialogRef = this.dialog.open(onlineClassFormTemplate, {
      panelClass: "position-relative",
      disableClose: true,
      maxWidth: "95vw",
      width: "640px",
      height: "95vh",
    });
  }
}
