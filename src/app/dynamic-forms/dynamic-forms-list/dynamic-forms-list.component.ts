import { Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { BusyIndicatorService } from "src/app/layout/busy-indicator.service";
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from "@angular/fire/firestore";
import { Observable, Subject } from "rxjs";
import * as firebase from "firebase/app";
import "firebase/firestore";

@Component({
  selector: "app-dynamic-forms-list",
  templateUrl: "./dynamic-forms-list.component.html",
  styleUrls: ["./dynamic-forms-list.component.scss"],
})
export class DynamicFormsListComponent {
  isFormValid = false;
  formToEdit = null;
  formTittle = "Add New Dynamic Form";

  basicFormConfig = [
    {
      columnClass: "col-12 mb-1",
      disabled: false,
      controllerClass: "w-100",
      required: true,
      placeholder: "Enter Form Name",
      label: "Form Name",
      name: "name",
      type: "text",
    },
    {
      columnClass: "col-12 mb-1",
      disabled: false,
      controllerClass: "w-100",
      required: true,
      value: "",
      placeholder: "Enter Default Column",
      label: "Form ID",
      pattern: "^[a-z0-9_-]{3,16}$",
      patternError:
        "Form ID string that may include _ and – having a length of 3 to 16 characters",
      name: "formID",
      type: "text",
    },
    {
      columnClass: "col-12 mb-1",
      disabled: false,
      controllerClass: "w-100",
      required: true,
      value: "col-md-6 mb-3",
      placeholder: "Default Form-Controller Column Class",
      label: "Default Form-Controller Column Class",
      name: "defaultColumnClass",
      type: "text",
    },
  ];

  private dynamicFormCollection: AngularFirestoreCollection<any>;
  public dynamicFormList: Observable<any[]>;

  constructor(
    private dialogModel: MatDialog,
    private busyIndicator: BusyIndicatorService,
    private afs: AngularFirestore
  ) {
    this.dynamicFormCollection = afs.collection<any>("dynamic-forms");
    this.dynamicFormList = this.dynamicFormCollection.valueChanges();
  }

  openDialog(addNewDynamicFormTemplate): void {
    const dialogRef = this.dialogModel.open(addNewDynamicFormTemplate, {
      width: "640px",
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.formTittle = "Add New Dynamic Form";
    });
  }

  onFormChange($event) {
    if ($event && $event.form) {
      this.isFormValid = $event.form.valid;
    }
  }

  async saveForm(arrowForm: any) {
    const busyIndicatorId = this.busyIndicator.show();
    if (this.formToEdit) {
      await this.updateForm(
        arrowForm.value,
        this.formToEdit.id,
        this.formToEdit.createdOn
      );
    } else {
      await this.addForm(arrowForm.value);
    }
    arrowForm.form.resetForm();
    this.busyIndicator.hide(busyIndicatorId);
    this.dialogModel.closeAll();
  }

  getServerTime(): any {
    return firebase.firestore.FieldValue.serverTimestamp();
  }

  async addForm(formData: any): Promise<any> {
    return new Promise(
      async function (resolve, reject) {
        try {
          const response = await this.dynamicFormCollection.add({
            ...formData,
            createdOn: this.getServerTime(),
          });
          const docRef = await this.dynamicFormCollection.doc(response.id);
          const doc = await docRef.get().toPromise();
          await docRef.set({ ...doc.data(), id: response.id });
          resolve(response.id);
        } catch (e) {
          reject(e);
        }
      }.bind(this)
    );
  }

  async deleteForm(formId) {
    const isConfimred = confirm("Are you sure!Do you want to Delete?");
    if (isConfimred) {
      const busyIndicatorId = this.busyIndicator.show();
      try {
        await this.deleteDynamicForm(formId);
        this.busyIndicator.hide(busyIndicatorId);
      } catch (e) {
        this.busyIndicator.hide(busyIndicatorId);
      }
    }
  }

  updateForm(formData: any, id: string, createdOn: any): Promise<any> {
    return new Promise(
      async function (resolve, reject) {
        try {
          const docRef = await this.dynamicFormCollection.doc(id);
          const doc = await docRef.get().toPromise();
          await docRef.set({
            ...formData,
            updatedOn: this.getServerTime(),
            id,
            createdOn,
          });
          resolve(id);
        } catch (e) {
          reject(e);
        }
      }.bind(this)
    );
  }

  deleteDynamicForm(id: string): Promise<any> {
    return new Promise(
      async function (resolve, reject) {
        try {
          await this.dynamicFormCollection.doc(id).delete();
          resolve(id);
        } catch (e) {
          reject(e);
        }
      }.bind(this)
    );
  }

  startAddForm(addNewDynamicFormTemplate) {
    this.formToEdit = null;
    this.formTittle = "Add New Dynamic Form";
    this.basicFormConfig[0].value = "";
    this.basicFormConfig[1].value = "";
    this.basicFormConfig[1].disabled = false;
    this.basicFormConfig[2].value = "";
    this.openDialog(addNewDynamicFormTemplate);
  }

  startEditForm(formDetail: any, addNewDynamicFormTemplate) {
    const isConfimred = confirm("Are you sure!Do you want to Edit?");
    if (isConfimred) {
      this.formToEdit = formDetail;
      this.formTittle = "Edit Dynamic Form";
      this.basicFormConfig[0].value = formDetail.name;
      this.basicFormConfig[1].value = formDetail.formID;
      this.basicFormConfig[1].disabled = true;
      this.basicFormConfig[2].value = formDetail.defaultColumnClass;
      this.openDialog(addNewDynamicFormTemplate);
    }
  }
}
