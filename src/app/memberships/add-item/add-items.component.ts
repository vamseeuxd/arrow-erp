import {Component, Inject} from '@angular/core';
import {NgForm} from '@angular/forms';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {map, switchMap, tap} from 'rxjs/operators';
import {DynamicFormComponent} from '../../shared/components/dynamic-form/dynamic-form.component';
import {BusyIndicatorService} from '../../layout/busy-indicator.service';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import {ItemsService} from '../items.service';

@Component({
  selector: 'app-add-memberships',
  templateUrl: './add-items.component.html',
  styleUrls: ['./add-items.component.sass'],
})
export class AddItemsComponent {
  isFormValid = false;
  arrowForm: NgForm;
  formControlsList$ = this.membershipsService.formControlsList$.pipe(
    tap(x => {
      if (this.initBusyIndicator) {
        this.busyIndicator.hide(this.initBusyIndicator);
        this.initBusyIndicator = null;
      }
    })
  );

  initBusyIndicator;

  constructor(
    private dialogModel: MatDialog,
    public afs: AngularFirestore,
    public membershipsService: ItemsService,
    private busyIndicator: BusyIndicatorService,
    @Inject(MAT_DIALOG_DATA) public formToEdit: any
  ) {
    this.initBusyIndicator = this.busyIndicator.show();
  }

  onValueChange($event: any) {
    if ($event && $event.form) {
      this.isFormValid = $event.form.valid;
    }
  }

  async saveData(myForm: DynamicFormComponent) {
    const busyIndicatorId = this.busyIndicator.show();
    if (this.formToEdit) {
      await this.membershipsService.updateForm(
        myForm.form.value,
        this.formToEdit.id,
        this.formToEdit.createdOn
      );
    }
    else {
      await this.membershipsService.saveItem(myForm.form.value);
    }
    myForm.form.resetForm({});
    this.busyIndicator.hide(busyIndicatorId);
    this.dialogModel.closeAll();
  }

  onFormInit($event: NgForm) {
    this.arrowForm = $event;
    if (this.formToEdit) {
      setTimeout(() => {
        this.arrowForm.resetForm(this.formToEdit);
      });
    }
  }
}
