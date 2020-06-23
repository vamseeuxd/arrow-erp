import {Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {BehaviorSubject, Observable} from 'rxjs';
import {defaultIfEmpty, map, shareReplay, switchMap, tap} from 'rxjs/operators';
import {
  FormDetails,
  getFormDetails,
  getGridDetails,
  handleFormChange,
  handleFormDelete,
  handleFormSave
} from '../../utilities/get-from-config';
import {AngularFirestore} from '@angular/fire/firestore';
import {BusyIndicatorService} from '../../../layout/busy-indicator.service';
import {ToastrService} from 'ngx-toastr';
import {MatSort} from '@angular/material/sort';
import {FORM_CONTROLLER_TYPE} from '../dynamic-form/dynamic-form-controller.interface';
import * as _ from 'lodash';
import * as pluralize from 'pluralize';
import {NgForm} from '@angular/forms';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import * as XLSX from 'xlsx';
import {Papa} from 'ngx-papaparse';
import {DynamicFormComponent} from '../dynamic-form/dynamic-form.component';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.csv';

@Component({
  selector: 'app-dynamic-data-grid',
  templateUrl: './dynamic-data-grid.component.html',
  styleUrls: ['./dynamic-data-grid.component.scss']
})
export class DynamicDataGridComponent implements OnInit {

  private _formId = '';
  private csvImportedData: any [] = [];

  get formId(): string {
    return this._formId;
  }

  @Input()
  set formId(value: string) {
    if (this._formId !== value) {
      this.showTable = false;
      this.selectedForm$.next(value);
    }
    this._formId = value;
  }

  dynamicForm: NgForm;
  arrowDynamicForm: DynamicFormComponent;
  addOrEditFormDialogRef: MatDialogRef<any, any>;
  addNewData = true;
  updatingData = null;
  handleFormChange = handleFormChange;

  dataSource: MatTableDataSource<any>;
  noRecordsFound = false;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = [];
  readonly formControlType = FORM_CONTROLLER_TYPE;
  showTable = false;
  busyIndicatorId;
  dataRefreshMessage = null;

  selectedForm$: BehaviorSubject<string> = new BehaviorSubject<string>(this._formId);

  form$: Observable<FormDetails> = this.selectedForm$.pipe(
    switchMap((formId) => {
      return getFormDetails(formId, this.afs);
    }),
    tap((data) => {
      if (data && data.formControls) {
        this.displayedColumns = data.formControls.map((ctrl) => ctrl.name);
        this.displayedColumns.push('Actions');
        this.dataSource = new MatTableDataSource([]);
        this.showTable = true;
      }
    })
  );

  grid$: Observable<any> = this.form$.pipe(
    switchMap((value: FormDetails) => {
      return getGridDetails(value.formID, this.afs, value.formControls);
    }),
  );

  constructor(
    public afs: AngularFirestore,
    private busyIndicator: BusyIndicatorService,
    public dialog: MatDialog,
    private papa: Papa,
    private toaster: ToastrService
  ) {
  }

  onDemoFormInit($event: NgForm, arrowDynamicFormRef) {
    setTimeout(() => {
      this.dynamicForm = $event;
      this.arrowDynamicForm = arrowDynamicFormRef;
    });
  }

  async saveFormData(formData: any, formId: string) {
    this.busyIndicatorId = this.busyIndicator.show();
    if (this.updatingData) {
      this.dataRefreshMessage = 'Updated Successfully';
    }
    else {
      this.dataRefreshMessage = 'Added Successfully';
    }
    try {
      await handleFormSave(this.afs, formData, formId, this.updatingData ? this.updatingData.id : '');
      this.dynamicForm.resetForm({});
      this.updatingData = null;
      this.addOrEditFormDialogRef.close();
    } catch (e) {
      setTimeout(() => {
        this.toaster.error('Unable to save data, please try again', 'Technical Error');
        this.busyIndicator.hide(this.busyIndicatorId);
      });
    }
  }

  ngOnInit(): void {
    this.busyIndicatorId = this.busyIndicator.show();
    this.grid$.subscribe((data) => {
      if (data && data.length > 0) {
        if (!this.dataSource || !_.isEqual(this.dataSource.data, data)) {
          this.dataSource = new MatTableDataSource(data);
          this.dataSource.sort = this.sort;
          if (this.dataRefreshMessage) {
            this.toaster.clear();
            this.toaster.success(this.dataRefreshMessage);
            this.dataRefreshMessage = null;
          }
          else {
            this.toaster.clear();
            // this.formId.toUpperCase() +
            this.toaster.info('Updated with new Changes');
          }
        }
        setTimeout(() => {
          this.noRecordsFound = false;
        });
      }
      else {
        this.dataSource = new MatTableDataSource([]);
        setTimeout(() => {
          this.noRecordsFound = true;
        });
      }
      this.busyIndicator.hide(this.busyIndicatorId);
    });
  }

  applyFilter($event: any) {
    let filterValue = $event.target.value;
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  trackByUid(index, item) {
    return item.id;
  }

  editItem(dynamicFormTemplate: TemplateRef<any>, data: any) {
    this.addNewData = false;
    this.updatingData = _.clone(data);
    this.addOrEditFormDialogRef = this.dialog.open(
      dynamicFormTemplate,
      {
        disableClose: true,
        maxWidth: '95vw',
        width: '640px',
      }
    );
    this.addOrEditFormDialogRef.afterOpened().subscribe(result => {
      this.dynamicForm.resetForm(_.clone(data.formData));
      setTimeout(() => {
        console.log(this.arrowDynamicForm);
        this.arrowDynamicForm.formControls.forEach(formControl => {
          handleFormChange(this.arrowDynamicForm.formControls, formControl, false)
        });
      });
    });
  }

  async deleteItem(id: string, formId: string) {
    const isConfirmed = confirm('Are you sure! Do you want to delete?');
    if (isConfirmed) {
      this.busyIndicatorId = this.busyIndicator.show();
      try {
        this.dataRefreshMessage = 'Deleted Successfully';
        await handleFormDelete(this.afs, id, formId);
      } catch (e) {
        this.toaster.error(e.toString());
        this.busyIndicator.hide(this.busyIndicatorId);
      }
    }
  }

  addNewDataClick(dynamicFormTemplate: TemplateRef<any>) {
    this.addNewData = true;
    this.addOrEditFormDialogRef = this.dialog.open(
      dynamicFormTemplate,
      {
        disableClose: true,
        maxWidth: '95vw',
        width: '640px',
      }
    );
  }

  cancelAddOrEditForm() {
    const isConfirmed = confirm('Are you sure! Do you want to Cancel?');
    if (isConfirmed) {
      this.addOrEditFormDialogRef.close();
      this.dynamicForm.resetForm({});
      this.addNewData = true;
    }
  }

  downloadExcelTemplate() {
    const excelColumns = this.displayedColumns.filter(d => (d !== 'id' && d !== 'Actions'));
    const readyToExport = this.dataSource.data.map(value => {
      const rd = {};
      excelColumns.forEach(value1 => {
        rd[value1] = value[value1];
      });
      return rd;
    });
    const workBook = XLSX.utils.book_new();
    const workSheet = XLSX.utils.json_to_sheet(readyToExport);
    XLSX.utils.book_append_sheet(workBook, workSheet, this.formId);
    const workbook = XLSX.writeFile(workBook, `${this.formId}.csv`);
  }

  uploadDataSource(evt) {
    const files = evt.target.files; // FileList object
    const file = files[0];
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = (event: any) => {
      const csv = event.target.result; // Content of CSV file
      this.papa.parse(csv, {
        skipEmptyLines: true,
        header: true,
        complete: (results) => {
          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < results.data.length; i++) {
            const orderDetails = {
              order_id: results.data[i].Address,
              age: results.data[i].Age
            };
            this.csvImportedData.push(orderDetails);
          }
          // console.log(this.test);
          console.log('Parsed: k', results.data);
        }
      });

    };
  }
}
