import { Component, OnInit } from "@angular/core";
import {
  CdkDragDrop,
  copyArrayItem,
  moveItemInArray,
  transferArrayItem,
} from "@angular/cdk/drag-drop";

export enum EDIT_CONFIG {
  LABEL = 0,
  NAME = 1,
  VALUE = 2,
  REQUIRED = 3,
  COLUMN_CLASS = 4,
  CONTROLLER_CLASS = 5,
  DISABLED = 6,
  TYPE = 7,
  DATA_PROVIDER = 8,
  IDENTIFY_BY = 9,
  DISPLAY_BY = 10,
}

@Component({
  selector: "app-add-dynamic-form",
  templateUrl: "./add-dynamic-form.component.html",
  styleUrls: ["./add-dynamic-form.component.scss"],
})
export class AddDynamicFormComponent {
  isBasicFormValid = false;
  defaultColumnWidth = "col-xl-6 col-lg-6 col-md-12 col-sm-12 mb-2";
  selectedIndex = 0;
  basicFormConfig = [
    {
      columnClass: "col-md-6 mb-3 offset-md-3",
      disabled: false,
      controllerClass: "w-100",
      required: true,
      placeholder: "Enter Form Name",
      label: "Form Name",
      name: "formName",
      type: "text",
    },
    {
      columnClass: "col-md-6 mb-3 offset-md-3",
      disabled: false,
      controllerClass: "w-100",
      required: true,
      value: "col-md-6 col-sm-12 col-xs-12 mb-3",
      placeholder: "Enter Default Column",
      label: "Default Column Class",
      name: "defaultColumnClass",
      type: "text",
    },
  ];
  dropEntered = false;
  dropIndex = 1;
  todo = [
    {
      columnClass: this.defaultColumnWidth,
      controllerClass: "w-100",
      disabled: false,
      value: "vamsi.flex@gmail.com",
      label: "Email Form Control",
      name: "email",
      type: "email",
      required: true,
    },
    {
      columnClass: this.defaultColumnWidth,
      controllerClass: "w-100",
      value: "#ff0000",
      disabled: false,
      required: true,
      label: "Color Form Control",
      name: "color",
      type: "color",
    },
    {
      columnClass: this.defaultColumnWidth,
      min: "2020-06-01",
      max: "2020-06-30",
      value: "2020-06-15",
      controllerClass: "w-100",
      disabled: false,
      required: true,
      label: "Date Form Control",
      name: "date",
      type: "date",
    },
    {
      columnClass: this.defaultColumnWidth,
      controllerClass: "w-100",
      disabled: false,
      value: "2020-06-25T14:00",
      required: true,
      label: "Datetime-local Form Control",
      name: "datetime-local",
      type: "datetime-local",
    },
    {
      columnClass: this.defaultColumnWidth,
      controllerClass: "w-100",
      disabled: false,
      value: "2020-06",
      required: true,
      label: "Month Form Control",
      name: "month",
      type: "month",
    },
    {
      columnClass: this.defaultColumnWidth,
      min: 10,
      max: 100,
      value: 50,
      controllerClass: "w-100",
      disabled: false,
      required: true,
      label: "Number Form Control",
      name: "number",
      type: "number",
    },
    {
      columnClass: this.defaultColumnWidth,
      controllerClass: "w-100",
      value: "2020-06-25T14:00",
      disabled: false,
      required: true,
      label: "Password Form Control",
      name: "password",
      type: "password",
    },
    {
      columnClass: this.defaultColumnWidth,
      controllerClass: "w-100",
      disabled: false,
      value: "Arrow",
      required: true,
      label: "Search Form Control",
      name: "search",
      type: "search",
    },
    {
      columnClass: this.defaultColumnWidth,
      disabled: false,
      minlength: 10,
      maxlength: 10,
      value: "9962266742",
      pattern: "^(0|[1-9][0-9]*)$",
      controllerClass: "w-100",
      required: true,
      label: "Mobile Phone Number Form Control",
      name: "tel",
      type: "tel",
    },
    {
      columnClass: this.defaultColumnWidth,
      disabled: false,
      value: "Arrow Animations",
      controllerClass: "w-100",
      required: true,
      label: "Text Form Control",
      name: "text",
      type: "text",
    },
    {
      columnClass: this.defaultColumnWidth,
      disabled: false,
      value: "14:00",
      controllerClass: "w-100",
      required: true,
      label: "Time Form Control",
      name: "time",
      type: "time",
    },
    {
      columnClass: this.defaultColumnWidth,
      controllerClass: "w-100",
      value: "https://angularfire-dynamic-forms.stackblitz.io/",
      disabled: false,
      required: true,
      label: "Url Form Control",
      name: "url",
      type: "url",
    },
    {
      columnClass: this.defaultColumnWidth,
      controllerClass: "w-100",
      value: "2020-W24",
      disabled: false,
      required: true,
      label: "Week Form Control",
      name: "week",
      type: "week",
    },
    {
      columnClass: this.defaultColumnWidth,
      controllerClass: "w-100",
      disabled: false,
      value: ["2", "4", "5"],
      required: true,
      label: "Select Form Control",
      name: "select",
      type: "select",
      multiple: true,
      dataProvider: {
        identifyBy: "id",
        displayBy: "name",
        data: [
          { id: "1", name: "Option 1" },
          { id: "2", name: "Option 2" },
          { id: "3", name: "Option 3" },
          { id: "4", name: "Option 4" },
          { id: "5", name: "Option 5" },
        ],
      },
    },
    {
      columnClass: this.defaultColumnWidth,
      controllerClass: "w-100",
      disabled: false,
      required: true,
      label: "Radio Form Control",
      name: "radio",
      value: "3",
      type: "radio",
      multiple: true,
      dataProvider: {
        identifyBy: "id",
        displayBy: "name",
        data: [
          { id: "1", name: "Option 1" },
          { id: "2", name: "Option 2" },
          { id: "3", name: "Option 3" },
          { id: "4", name: "Option 4" },
          { id: "5", name: "Option 5" },
        ],
      },
    },
    {
      columnClass: this.defaultColumnWidth,
      controllerClass: "w-100",
      disabled: false,
      required: true,
      label: "Chips Form Control",
      name: "chips",
      type: "chips",
      multiple: true,
      dataProvider: {
        identifyBy: "id",
        displayBy: "name",
      },
    },
  ];
  editDynamicFormConfig = [
    {
      columnClass: "col-4 mb-1",
      disabled: false,
      controllerClass: "w-100",
      required: true,
      placeholder: "Enter Label form Controller",
      label: "Label for Controller",
      name: "label",
      type: "text",
    },
    {
      columnClass: "col-4 mb-1",
      disabled: false,
      controllerClass: "w-100",
      required: true,
      placeholder: "Enter Name for Controller",
      label: "Name for Controller",
      name: "name",
      type: "text",
    },
    {
      columnClass: "col-4 mb-1",
      disabled: false,
      controllerClass: "w-100",
      required: false,
      placeholder: "Enter Default Value for Controller",
      label: "Default Value",
      name: "value",
      type: "text",
    },
    {
      columnClass: "col-4 mb-1",
      controllerClass: "w-100",
      disabled: false,
      required: true,
      label: "Is Control Required",
      name: "required",
      value: true,
      type: "radio",
      multiple: true,
      dataProvider: {
        identifyBy: "id",
        displayBy: "name",
        data: [
          {
            id: true,
            name: "Yes",
          },
          {
            id: false,
            name: "No",
          },
        ],
      },
    },
    {
      columnClass: "col-4 mb-1",
      disabled: false,
      controllerClass: "w-100",
      required: true,
      label: "Column Class",
      name: "columnClass",
      type: "text",
    },
    {
      columnClass: "col-4 mb-1",
      disabled: false,
      controllerClass: "w-100",
      required: true,
      label: "Controller Class",
      name: "controllerClass",
      type: "text",
    },
    {
      columnClass: "col-4 mb-1",
      controllerClass: "w-100",
      disabled: false,
      required: true,
      label: "Is Control Disabled",
      name: "disabled",
      value: true,
      type: "radio",
      multiple: false,
      dataProvider: {
        identifyBy: "id",
        displayBy: "name",
        data: [
          {
            id: true,
            name: "Yes",
          },
          {
            id: false,
            name: "No",
          },
        ],
      },
    },
    {
      columnClass: "col-4 mb-1",
      controllerClass: "w-100",
      disabled: false,
      required: true,
      label: "Select Control Type",
      name: "type",
      value: "",
      type: "select",
      multiple: false,
      dataProvider: {
        identifyBy: "id",
        displayBy: "name",
        data: this.todo.map((d) => ({ id: d.type, name: d.label })),
      },
    },
    {
      columnClass: "col-4 mb-1",
      controllerClass: "w-100",
      disabled: false,
      required: true,
      hide: true,
      label: "Data Provider",
      name: "dataProvider",
      dataProvider: {
        identifyBy: "id",
        displayBy: "name",
        data: [],
      },
      type: "chips",
    },
    {
      columnClass: "col-4 mb-1",
      disabled: false,
      controllerClass: "w-100",
      required: true,
      value: "id",
      oldValue: "id",
      hide: true,
      placeholder: "Data Item Identify By",
      label: "Data Item Identify By",
      name: "identifyBy",
      type: "text",
    },
    {
      columnClass: "col-4 mb-1",
      disabled: false,
      controllerClass: "w-100",
      required: true,
      value: "name",
      oldValue: "name",
      hide: true,
      placeholder: "Data Item Display By",
      label: "Data Item Display By",
      name: "displayBy",
      type: "text",
    },
  ];
  done = [];
  private editControlIndex: number;

  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      copyArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      this.done[event.currentIndex] = JSON.parse(
        JSON.stringify(this.done[event.currentIndex])
      );
      this.done[event.currentIndex].name = new Date().getTime();
      this.done[event.currentIndex].columnClass = this.defaultColumnWidth;
      this.done[event.currentIndex].label =
        this.done[event.currentIndex].label + " (" + this.dropIndex + ")";
      this.dropIndex = this.dropIndex + 1;
      this.onEditDynamicFormChange(this.done[event.currentIndex].type);
    }
  }

  noReturnPredicate() {
    return false;
  }

  cloneControl(item: any, index: number) {
    const clonedData = JSON.parse(JSON.stringify(item));
    clonedData.name = clonedData.type + new Date().getTime();
    clonedData.name = new Date().getTime();
    // clonedData.label = clonedData.label + " (" + this.dropIndex + ")";
    clonedData.label = clonedData.label;
    this.dropIndex = this.dropIndex + 1;
    this.done.splice(index + 1, 0, clonedData);
  }

  deleteControl(ind: number) {
    const isConfirmed = confirm("Are you sure!Do you want to delete?");
    if (isConfirmed) {
      this.done.splice(ind, 1);
    }
  }

  editControl(ind: number) {
    if (ind < 0) {
      const isConfirmed = confirm("Are you sure! Do you want to Cancel?");
      if (isConfirmed) {
        this.onEditDynamicFormChange(this.done[this.editControlIndex].type);
        this.editControlIndex = ind;
      }
    } else {
      this.editControlIndex = ind;
      const dataToEdit = JSON.parse(
        JSON.stringify(this.done[this.editControlIndex])
      );
      this.editDynamicFormConfig[EDIT_CONFIG.LABEL].value = dataToEdit.label;
      this.editDynamicFormConfig[EDIT_CONFIG.NAME].value = dataToEdit.name;
      this.editDynamicFormConfig[EDIT_CONFIG.VALUE].value = dataToEdit.value;
      this.editDynamicFormConfig[EDIT_CONFIG.REQUIRED].value =
        dataToEdit.required;
      this.editDynamicFormConfig[EDIT_CONFIG.COLUMN_CLASS].value =
        dataToEdit.columnClass;
      this.editDynamicFormConfig[EDIT_CONFIG.CONTROLLER_CLASS].value =
        dataToEdit.controllerClass;
      this.editDynamicFormConfig[EDIT_CONFIG.TYPE].value = dataToEdit.type;
      this.editDynamicFormConfig[EDIT_CONFIG.DISABLED].value =
        dataToEdit.disabled;
      switch (this.editDynamicFormConfig[EDIT_CONFIG.TYPE].value) {
        case "select":
        case "radio":
        case "chips":
          this.editDynamicFormConfig[EDIT_CONFIG.DATA_PROVIDER].value =
            dataToEdit.dataProvider.data;
          this.editDynamicFormConfig[EDIT_CONFIG.DATA_PROVIDER].hide = false;
          break;
        default:
          this.editDynamicFormConfig[EDIT_CONFIG.DATA_PROVIDER].hide = true;
          break;
      }
    }
  }

  saveController() {
    const isConfirmed = confirm("Are you sure! Do you want to Save?");
    if (isConfirmed) {
      const dataToEdit = JSON.parse(
        JSON.stringify(this.done[this.editControlIndex])
      );
      if (
        this.done.filter(
          (d, i) =>
            d.name === this.editDynamicFormConfig[EDIT_CONFIG.NAME].value &&
            i !== this.editControlIndex
        ).length === 0
      ) {
        dataToEdit.label = this.editDynamicFormConfig[EDIT_CONFIG.LABEL].value;
        dataToEdit.name = this.editDynamicFormConfig[EDIT_CONFIG.NAME].value;
        dataToEdit.value = this.editDynamicFormConfig[EDIT_CONFIG.VALUE].value;
        dataToEdit.required = this.editDynamicFormConfig[
          EDIT_CONFIG.REQUIRED
        ].value;
        dataToEdit.columnClass = this.editDynamicFormConfig[
          EDIT_CONFIG.COLUMN_CLASS
        ].value;
        dataToEdit.controllerClass = this.editDynamicFormConfig[
          EDIT_CONFIG.CONTROLLER_CLASS
        ].value;
        dataToEdit.type = this.editDynamicFormConfig[EDIT_CONFIG.TYPE].value;
        dataToEdit.disabled = this.editDynamicFormConfig[
          EDIT_CONFIG.DISABLED
        ].value;

        switch (this.editDynamicFormConfig[EDIT_CONFIG.TYPE].value) {
          case "select":
          case "radio":
          case "chips":
            dataToEdit.dataProvider = {
              identifyBy: this.editDynamicFormConfig[EDIT_CONFIG.IDENTIFY_BY]
                .value,
              displayBy: this.editDynamicFormConfig[EDIT_CONFIG.DISPLAY_BY]
                .value,
              data: this.editDynamicFormConfig[EDIT_CONFIG.DATA_PROVIDER].value,
            };
            break;
          default:
            delete dataToEdit.dataProvider;
            break;
        }
        this.done[this.editControlIndex] = dataToEdit;
        this.editControlIndex = -1;
      } else {
        alert(
          `Already Form Control exists with Provide name "${dataToEdit.name}".please use unique name`
        );
      }
    }
  }

  onEditDynamicFormChange(type: string) {
    switch (type) {
      case "select":
      case "radio":
      case "chips":
        this.editDynamicFormConfig[EDIT_CONFIG.DATA_PROVIDER].hide =
          type === "chips";
        this.editDynamicFormConfig[EDIT_CONFIG.IDENTIFY_BY].hide = false;
        this.editDynamicFormConfig[EDIT_CONFIG.DISPLAY_BY].hide = false;
        break;
      default:
        this.editDynamicFormConfig[EDIT_CONFIG.DATA_PROVIDER].hide = true;
        this.editDynamicFormConfig[EDIT_CONFIG.IDENTIFY_BY].hide = true;
        this.editDynamicFormConfig[EDIT_CONFIG.DISPLAY_BY].hide = true;
        break;
    }
  }

  onEditDynamicFormChangeBefore($event: any) {
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
      console.clear();
      console.log(
        this.editDynamicFormConfig[EDIT_CONFIG.DATA_PROVIDER].dataProvider
      );
    }
  }

  onDynamicFormChange($event: any) {
    console.log($event);
  }
}
