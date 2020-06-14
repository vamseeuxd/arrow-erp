import { Component, OnInit, ViewChild, TemplateRef } from "@angular/core";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { MatDialog } from "@angular/material/dialog";
import { BusyIndicatorService } from "src/app/layout/busy-indicator.service";
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from "@angular/fire/firestore";
import { Observable, Subject } from "rxjs";
import * as firebase from "firebase/app";
import "firebase/firestore";
import {
  FormControlsConfigList,
  EDIT_CONFIG,
  CONTROL_TYPE,
} from "./dynamic-form-controls-configs";
import { NgForm } from "@angular/forms";
import { switchMap, tap, map } from "rxjs/operators";
import { async } from "@angular/core/testing";

@Component({
  selector: "app-dynamic-form-controls-list",
  templateUrl: "./dynamic-form-controls-list.component.html",
  styleUrls: ["./dynamic-form-controls-list.component.scss"],
})
export class DynamicFormControlsListComponent implements OnInit {
  @ViewChild("addNewControlTemplate")
  addNewControlTemplate: TemplateRef<any>;
  formTittle = "Add New Form Control";
  isFormValid = false;
  dulicateName = false;
  isLastActionIsDelete = false;
  formDetails;
  defaultColumnWidth = "";
  formToEdit = null;
  formToEditIndex = -1;

  editDynamicFormConfig: any[] = FormControlsConfigList;

  selectedFormControls = [];

  formDetails$ = new Subject<string>();
  formDetailsBusyIndicator;
  formControlCollection: AngularFirestoreCollection<any>;
  formControlList$: Observable<any[]>;

  constructor(
    private dialogModel: MatDialog,
    private busyIndicator: BusyIndicatorService,
    private afs: AngularFirestore
  ) {
    this.formControlCollection = afs.collection<any>("dynamic-form-controls");
    // this.formControlList$ = this.formControlCollection.valueChanges();
    const compareFn = (a, b) => {
      if (a.position < b.position) return -1;
      if (a.position > b.position) return 1;
      return 0;
    };

    this.formControlList$ = this.formDetails$.pipe(
      switchMap((formDetails: any) =>
        afs
          .collection("dynamic-form-controls", (ref) =>
            ref.where("formId", "==", formDetails.id)
          )
          .valueChanges()
          .pipe(map((things) => things.sort(compareFn)))
      ),
      tap((value) => {
        this.selectedFormControls = value;
        this.busyIndicator.hide(this.formDetailsBusyIndicator);
        if (this.isLastActionIsDelete) {
          this.isLastActionIsDelete = false;
          this.updateControlIndexes();
        }
      })
    );
  }

  openDialog(addNewControlTemplate): void {
    const dialogRef = this.dialogModel.open(addNewControlTemplate, {
      width: "640px",
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.formTittle = "Add New Dynamic Form";
    });
  }

  ngOnInit(): void {}

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.selectedFormControls,
      event.previousIndex,
      event.currentIndex
    );
    this.updateControlIndexes();
  }

  updateControlIndexes() {
    if (this.selectedFormControls && this.selectedFormControls.length > 0) {
      const lastItemIndex = this.selectedFormControls.length - 1;
      const busyIndicatorId = this.busyIndicator.show();
      this.selectedFormControls.forEach(async (d: any, ind: number) => {
        console.log(d.label);
        const docRef = await this.formControlCollection.doc(d.id);
        const doc = await docRef.get().toPromise();
        await docRef.set({
          ...d,
          position: ind,
          updatedOn: this.getServerTime(),
        });
        if (lastItemIndex === ind) {
          this.busyIndicator.hide(busyIndicatorId);
        }
      });
    }
  }

  getFormControlDetails(formDetails: any) {
    this.formDetailsBusyIndicator = this.busyIndicator.show();
    this.formDetails = formDetails;
    this.formDetails$.next(this.formDetails);
  }

  addNewControl(formDetails: any) {
    this.formDetails = formDetails;
    this.formDetails$.next(this.formDetails);
    this.defaultColumnWidth = formDetails.defaultColumnClass;
    this.editDynamicFormConfig[EDIT_CONFIG.COLUM_CLASS].value =
      formDetails.defaultColumnClass;
    this.editDynamicFormConfig[EDIT_CONFIG.CONTROLLER_CLASS].value = "w-100";
    this.formToEdit = null;
    this.formToEditIndex = -1;
    this.openDialog(this.addNewControlTemplate);
    this.editDynamicFormConfig[EDIT_CONFIG.TYPE].value = "text";
    this.editDynamicFormConfig[EDIT_CONFIG.LABEL].value =
      "Test " + this.selectedFormControls.length;
    this.editDynamicFormConfig[EDIT_CONFIG.NAME].value =
      "test" + this.selectedFormControls.length;
    this.onEditDynamicFormChange("email");
  }

  cloneFormController(formControl, index$) {
    this.selectedFormControls.splice(
      index$ + 1,
      0,
      JSON.parse(JSON.stringify(formControl))
    );
    this.selectedFormControls[index$ + 1].name =
      this.selectedFormControls[index$ + 1].name + new Date().getTime();
  }

  editFormController(formControl, index$) {
    this.formToEdit = formControl;
    this.formToEditIndex = index$;
    this.editDynamicFormConfig.forEach((config) => {
      Object.keys(formControl).forEach((data) => {
        if (config.name === data) {
          config.value = formControl[data];
        }
      });
    });
    this.openDialog(this.addNewControlTemplate);
    this.onEditDynamicFormChange(formControl.type);
  }

  onFormChange($event) {
    if ($event && $event.form) {
      this.isFormValid = $event.form.valid;
    }
  }

  async saveForm(arrowForm: NgForm) {
    const busyIndicatorId = this.busyIndicator.show();
    if (this.formToEdit) {
      await this.updateForm(
        arrowForm.value,
        this.formToEdit.id,
        this.formToEdit.createdOn
      );
    } else {
      await this.addFormControl(arrowForm.value);
    }
    arrowForm.resetForm({
      type: "email",
      columnClass: this.defaultColumnWidth,
      controllerClass: "w-100",
      required: true,
      hide: false,
      disabled: false,
      showInGrid: true,
    });
    this.busyIndicator.hide(busyIndicatorId);
    this.dialogModel.closeAll();
  }

  async deleteForm(formId) {
    const isConfimred = confirm("Are you sure!Do you want to Delete?");
    if (isConfimred) {
      const busyIndicatorId = this.busyIndicator.show();
      try {
        await this.deleteDynamicForm(formId);
        this.isLastActionIsDelete = true;
        this.busyIndicator.hide(busyIndicatorId);
      } catch (e) {
        this.busyIndicator.hide(busyIndicatorId);
      }
    }
  }

  deleteDynamicForm(id: string): Promise<any> {
    return new Promise(
      async function (resolve, reject) {
        try {
          await this.formControlCollection.doc(id).delete();
          resolve(id);
        } catch (e) {
          reject(e);
        }
      }.bind(this)
    );
  }

  async addFormControl(formData: any): Promise<any> {
    Object.keys(formData).forEach(
      (key) => formData[key] === undefined && delete formData[key]
    );
    return new Promise(
      async function (resolve, reject) {
        try {
          const response = await this.formControlCollection.add({
            ...formData,
            position: this.selectedFormControls.length,
            formId: this.formDetails.id,
            createdOn: this.getServerTime(),
          });
          const docRef = await this.formControlCollection.doc(response.id);
          const doc = await docRef.get().toPromise();
          await docRef.set({ ...doc.data(), id: response.id });
          resolve(response.id);
        } catch (e) {
          reject(e);
        }
      }.bind(this)
    );
  }

  updateForm(formData: any, id: string, createdOn: any): Promise<any> {
    Object.keys(formData).forEach(
      (key) => formData[key] === undefined && delete formData[key]
    );
    return new Promise(
      async function (resolve, reject) {
        try {
          const docRef = await this.formControlCollection.doc(id);
          const doc = await docRef.get().toPromise();
          await docRef.set({
            ...formData,
            formId: this.formDetails.id,
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

  getServerTime(): any {
    return firebase.firestore.FieldValue.serverTimestamp();
  }

  onEditDynamicFormChange(type: string) {
    this.resetEditDynamicForm();
    this.editDynamicFormConfig[EDIT_CONFIG.VALUE].type = type;
    switch (type) {
      case CONTROL_TYPE.EMAIL:
        this.editDynamicFormConfig[EDIT_CONFIG.DATA_PROVIDER].hide = true;
        this.editDynamicFormConfig[EDIT_CONFIG.IDENTIFY_BY].hide = true;
        this.editDynamicFormConfig[EDIT_CONFIG.MULTIPLE].hide = true;
        this.editDynamicFormConfig[EDIT_CONFIG.MIN].hide = true;
        this.editDynamicFormConfig[EDIT_CONFIG.MAX].hide = true;
        this.editDynamicFormConfig[EDIT_CONFIG.PATTERN].hide = true;
        this.editDynamicFormConfig[EDIT_CONFIG.MIN_ERROR].hide = true;
        this.editDynamicFormConfig[EDIT_CONFIG.MAX_ERROR].hide = true;
        this.editDynamicFormConfig[EDIT_CONFIG.MIN_LENGTH_ERROR].hide = true;
        this.editDynamicFormConfig[EDIT_CONFIG.MAX_LENGTH_ERROR].hide = true;
        this.editDynamicFormConfig[EDIT_CONFIG.PATTERN_ERROR].hide = true;
        this.editDynamicFormConfig[EDIT_CONFIG.DISPLAY_BY].hide = true;
        break;
      case CONTROL_TYPE.COLOR:
        this.editDynamicFormConfig[EDIT_CONFIG.DATA_PROVIDER].hide = true;
        this.editDynamicFormConfig[EDIT_CONFIG.IDENTIFY_BY].hide = true;
        this.editDynamicFormConfig[EDIT_CONFIG.DISPLAY_BY].hide = true;
        this.editDynamicFormConfig[EDIT_CONFIG.MULTIPLE].hide = true;
        this.editDynamicFormConfig[EDIT_CONFIG.MIN_LENGTH].hide = true;
        this.editDynamicFormConfig[EDIT_CONFIG.MAX_LENGTH].hide = true;
        this.editDynamicFormConfig[EDIT_CONFIG.MIN_LENGTH_ERROR].hide = true;
        this.editDynamicFormConfig[EDIT_CONFIG.MAX_LENGTH_ERROR].hide = true;
        this.editDynamicFormConfig[EDIT_CONFIG.EMAIL_ERROR].hide = true;
        this.editDynamicFormConfig[EDIT_CONFIG.PATTERN].hide = true;
        this.editDynamicFormConfig[EDIT_CONFIG.PATTERN_ERROR].hide = true;
        this.editDynamicFormConfig[EDIT_CONFIG.MIN_ERROR].hide = true;
        this.editDynamicFormConfig[EDIT_CONFIG.MAX_ERROR].hide = true;
        this.editDynamicFormConfig[EDIT_CONFIG.MIN].hide = true;
        this.editDynamicFormConfig[EDIT_CONFIG.MAX].hide = true;
        break;
      case CONTROL_TYPE.PASSWORD:
      case CONTROL_TYPE.TEXT:
      case CONTROL_TYPE.SEARCH:
      case CONTROL_TYPE.URL:
      case CONTROL_TYPE.TEL:
        this.editDynamicFormConfig[EDIT_CONFIG.DATA_PROVIDER].hide = true;
        this.editDynamicFormConfig[EDIT_CONFIG.IDENTIFY_BY].hide = true;
        this.editDynamicFormConfig[EDIT_CONFIG.MULTIPLE].hide = true;
        this.editDynamicFormConfig[EDIT_CONFIG.MIN].hide = true;
        this.editDynamicFormConfig[EDIT_CONFIG.MAX].hide = true;
        this.editDynamicFormConfig[EDIT_CONFIG.MIN_ERROR].hide = true;
        this.editDynamicFormConfig[EDIT_CONFIG.MAX_ERROR].hide = true;
        this.editDynamicFormConfig[EDIT_CONFIG.EMAIL_ERROR].hide = true;
        this.editDynamicFormConfig[EDIT_CONFIG.DISPLAY_BY].hide = true;
        this.editDynamicFormConfig[EDIT_CONFIG.MIN].type = type;
        this.editDynamicFormConfig[EDIT_CONFIG.MAX].type = type;
        break;
      case CONTROL_TYPE.DATE:
      case CONTROL_TYPE.DATETIME_local:
      case CONTROL_TYPE.MONTH:
      case CONTROL_TYPE.NUMBER:
      case CONTROL_TYPE.TIME:
      case CONTROL_TYPE.WEEK:
        this.editDynamicFormConfig[EDIT_CONFIG.DATA_PROVIDER].hide = true;
        this.editDynamicFormConfig[EDIT_CONFIG.IDENTIFY_BY].hide = true;
        this.editDynamicFormConfig[EDIT_CONFIG.MULTIPLE].hide = true;
        this.editDynamicFormConfig[EDIT_CONFIG.MIN_LENGTH].hide = true;
        this.editDynamicFormConfig[EDIT_CONFIG.MAX_LENGTH].hide = true;
        this.editDynamicFormConfig[EDIT_CONFIG.MIN_LENGTH_ERROR].hide = true;
        this.editDynamicFormConfig[EDIT_CONFIG.MAX_LENGTH_ERROR].hide = true;
        this.editDynamicFormConfig[EDIT_CONFIG.EMAIL_ERROR].hide = true;
        this.editDynamicFormConfig[EDIT_CONFIG.DISPLAY_BY].hide = true;
        this.editDynamicFormConfig[EDIT_CONFIG.PATTERN].hide = true;
        this.editDynamicFormConfig[EDIT_CONFIG.PATTERN_ERROR].hide = true;
        this.editDynamicFormConfig[EDIT_CONFIG.MIN].type = type;
        this.editDynamicFormConfig[EDIT_CONFIG.MAX].type = type;
        break;
      case CONTROL_TYPE.RADIO:
      case CONTROL_TYPE.CHIPS:
        this.editDynamicFormConfig[EDIT_CONFIG.MULTIPLE].hide = true;
        this.editDynamicFormConfig[EDIT_CONFIG.MIN_LENGTH].hide = true;
        this.editDynamicFormConfig[EDIT_CONFIG.MAX_LENGTH].hide = true;
        this.editDynamicFormConfig[EDIT_CONFIG.MIN_LENGTH_ERROR].hide = true;
        this.editDynamicFormConfig[EDIT_CONFIG.MAX_LENGTH_ERROR].hide = true;
        this.editDynamicFormConfig[EDIT_CONFIG.EMAIL_ERROR].hide = true;
        this.editDynamicFormConfig[EDIT_CONFIG.PATTERN].hide = true;
        this.editDynamicFormConfig[EDIT_CONFIG.PATTERN_ERROR].hide = true;
        this.editDynamicFormConfig[EDIT_CONFIG.MIN_ERROR].hide = true;
        this.editDynamicFormConfig[EDIT_CONFIG.MAX_ERROR].hide = true;
        this.editDynamicFormConfig[EDIT_CONFIG.MIN].hide = true;
        this.editDynamicFormConfig[EDIT_CONFIG.MAX].hide = true;
        break;
      case CONTROL_TYPE.SELECT:
        this.editDynamicFormConfig[EDIT_CONFIG.MIN_LENGTH].hide = true;
        this.editDynamicFormConfig[EDIT_CONFIG.MAX_LENGTH].hide = true;
        this.editDynamicFormConfig[EDIT_CONFIG.MIN_LENGTH_ERROR].hide = true;
        this.editDynamicFormConfig[EDIT_CONFIG.MAX_LENGTH_ERROR].hide = true;
        this.editDynamicFormConfig[EDIT_CONFIG.EMAIL_ERROR].hide = true;
        this.editDynamicFormConfig[EDIT_CONFIG.PATTERN].hide = true;
        this.editDynamicFormConfig[EDIT_CONFIG.PATTERN_ERROR].hide = true;
        this.editDynamicFormConfig[EDIT_CONFIG.MIN_ERROR].hide = true;
        this.editDynamicFormConfig[EDIT_CONFIG.MAX_ERROR].hide = true;
        this.editDynamicFormConfig[EDIT_CONFIG.MIN].hide = true;
        this.editDynamicFormConfig[EDIT_CONFIG.MAX].hide = true;
        break;
    }
  }

  resetEditDynamicForm() {
    const optionalProps = ["hide"];
    this.editDynamicFormConfig.forEach((config) => {
      optionalProps.forEach((prop) => {
        if (config && config.hasOwnProperty(prop)) {
          config[prop] = false;
        }
      });
    });
  }

  onEditDynamicFormChangeBefore($event: any) {
    if ($event && $event.form) {
      this.isFormValid = $event.form.valid;
    }
    if ($event && $event.control && $event.control.name === "type") {
      this.onEditDynamicFormChange($event.control.value);
    }
    if (
      $event &&
      $event.control &&
      ($event.control.name === "identifyBy" ||
        $event.control.name === "displayBy")
    ) {
      const dataProvider: any = this.editDynamicFormConfig[
        EDIT_CONFIG.DATA_PROVIDER
      ].value;
      const data = dataProvider.map((value: any) => {
        const returnData: any = {};
        if ($event.control.name === "displayBy") {
          const disBy = this.editDynamicFormConfig[EDIT_CONFIG.DISPLAY_BY]
            .oldValue;
          const idBy = this.editDynamicFormConfig[
            EDIT_CONFIG.IDENTIFY_BY
          ].value.toString();
          returnData[$event.control.value] = value[disBy];
          returnData[idBy] = value[idBy];
        } else if ($event.control.name === "identifyBy") {
          const disBy = this.editDynamicFormConfig[
            EDIT_CONFIG.DISPLAY_BY
          ].value.toString();
          const idBy = this.editDynamicFormConfig[
            EDIT_CONFIG.IDENTIFY_BY
          ].oldValue.toString();
          returnData[$event.control.value] = value[idBy];
          returnData[disBy] = value[disBy];
        }
        return returnData;
      });
      this.editDynamicFormConfig[EDIT_CONFIG.DATA_PROVIDER].dataProvider = {
        identifyBy:
          $event.control.name === "identifyBy"
            ? $event.control.value
            : this.editDynamicFormConfig[EDIT_CONFIG.IDENTIFY_BY].oldValue,
        displayBy:
          $event.control.name === "displayBy"
            ? $event.control.value
            : this.editDynamicFormConfig[EDIT_CONFIG.DISPLAY_BY].oldValue,
        data,
      };
      if ($event.control.name === "displayBy") {
        this.editDynamicFormConfig[EDIT_CONFIG.DISPLAY_BY].oldValue =
          $event.control.value;
      }
      if ($event.control.name === "identifyBy") {
        this.editDynamicFormConfig[EDIT_CONFIG.IDENTIFY_BY].oldValue =
          $event.control.value;
      }
      this.editDynamicFormConfig[EDIT_CONFIG.DATA_PROVIDER].value = data;
    }
    if ($event.control && $event.control.name === "name") {
      this.dulicateName =
        this.selectedFormControls.filter((d) => d.name === $event.control.value)
          .length > 0;
    }
  }
}
