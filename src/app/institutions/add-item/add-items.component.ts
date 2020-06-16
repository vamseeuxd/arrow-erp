import { Component, Inject } from "@angular/core";
import { NgForm } from "@angular/forms";
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from "@angular/fire/firestore";
import { map, switchMap, tap } from "rxjs/operators";
import { DynamicFormComponent } from "../../shared/components/dynamic-form/dynamic-form.component";
import { BusyIndicatorService } from "../../layout/busy-indicator.service";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { ItemsService } from "../items.service";

@Component({
  selector: "app-add-memberships",
  templateUrl: "./add-items.component.html",
  styleUrls: ["./add-items.component.sass"],
})
export class AddItemsComponent {
  isFormValid = false;
  arrowForm: NgForm;
  formControlsList = this.itemsService.formControlsList;

  constructor(
    private dialogModel: MatDialog,
    public afs: AngularFirestore,
    public itemsService: ItemsService,
    private busyIndicator: BusyIndicatorService,
    @Inject(MAT_DIALOG_DATA) public formToEdit: any
  ) {}

  onValueChange($event: any) {
    if ($event && $event.form) {
      this.isFormValid = $event.form.valid;
    }
    if ($event.control.name === "country") {
      this.itemsService.selectedCountryAction.next($event.control.value);
    }
    if ($event.control.name === "state") {
      this.itemsService.selectedStateAction.next($event.control.value);
    }
    if ($event.control.name === "city") {
      this.itemsService.selectedCityAction.next($event.control.value);
    }
  }

  async saveData(myForm: DynamicFormComponent) {
    const busyIndicatorId = this.busyIndicator.show();
    if (this.formToEdit) {
      await this.itemsService.updateItem(
        myForm.form.value,
        this.formToEdit.id,
        this.formToEdit.createdOn
      );
    } else {
      await this.itemsService.saveItem(myForm.form.value);
    }
    myForm.form.resetForm({});
    this.busyIndicator.hide(busyIndicatorId);
    this.dialogModel.closeAll();
  }

  onFormInit($event: NgForm) {
    this.arrowForm = $event;
    setTimeout(() => {
      if (this.formToEdit) {
        setTimeout(() => {
          this.arrowForm.resetForm(this.formToEdit);
        });
      } else {
        this.arrowForm.resetForm(this.itemsService.defaultValues);
      }
    });
  }
}
