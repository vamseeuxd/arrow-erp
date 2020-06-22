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
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.csv';

@Component({
  selector: 'app-dynamic-data-grid',
  templateUrl: './dynamic-data-grid.component.html',
  styleUrls: ['./dynamic-data-grid.component.sass']
})
export class DynamicDataGridComponent implements OnInit {

  private _formId = '';
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
  addOrEditFormDialogRef: MatDialogRef<any, any>;
  addNewData = true;
  handleFormChange = handleFormChange;

  dataSource: MatTableDataSource<any>;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = [];
  readonly formControlType = FORM_CONTROLLER_TYPE;
  showTable = false;
  busyIndicatorId;
  dataRefreshMessage = null;
  dependedFormsBusyIndicatorId = null;

  selectedForm$: BehaviorSubject<string> = new BehaviorSubject<string>(this._formId);

  form$: Observable<FormDetails> = this.selectedForm$.pipe(
    switchMap((formId) => {
      return getFormDetails(formId, this.afs);
    }),
    shareReplay(1),
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
    shareReplay(1),
  );

  constructor(
    public afs: AngularFirestore,
    private busyIndicator: BusyIndicatorService,
    public dialog: MatDialog,
    private toaster: ToastrService
  ) {
  }

  onDemoFormInit($event: NgForm) {
    setTimeout(() => {
      this.dynamicForm = $event;
    });
  }

  async saveFormData(formData: any, formId: string) {
    const busyIndicatorId = this.busyIndicator.show();
    try {
      await handleFormSave(this.afs, formData, formId);
      this.busyIndicator.hide(busyIndicatorId);
      this.dynamicForm.resetForm({});
      this.toaster.success(`${pluralize.singular(formId)} Added Successfully`);
    } catch (e) {
      this.busyIndicator.hide(busyIndicatorId);
      alert(JSON.stringify(e));
    }
  }

  ngOnInit(): void {
    this.busyIndicatorId = this.busyIndicator.show();
    this.grid$.subscribe((data) => {
      // debugger;
      if (data && data.length > 0) {
        if (!this.dataSource || !_.isEqual(this.dataSource.data, data)) {
          /*  --------------------------  */
          this.dataSource = new MatTableDataSource(data);
          this.dataSource.sort = this.sort;
          if (this.dataRefreshMessage) {
            this.toaster.clear();
            this.toaster.success(this.dataRefreshMessage);
            this.dataRefreshMessage = null;
          }
          else {
            this.toaster.clear();
            this.toaster.info(this.formId.toUpperCase() + ' Tables is Updated with new Changes', '', {positionClass: 'toast-bottom-right'});
          }
          /*  --------------------------  */
        }
      }
      else {
        this.dataSource = new MatTableDataSource([]);
      }
      this.busyIndicator.hide(this.busyIndicatorId);
    });
  }

  changeFormTable($event: any) {
    this.selectedForm$.next($event);
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  trackByUid(index, item) {
    return item.id;
  }

  editItem(item: any) {
  }

  async deleteItem(id: string, formId: string) {
    const isConfirmed = confirm('Are you sure! Do you want to delete?');
    if (isConfirmed) {
      this.busyIndicator.hide(this.busyIndicatorId);
      this.busyIndicatorId = this.busyIndicator.show();
      try {
        this.dataRefreshMessage = await handleFormDelete(this.afs, id, formId);
      } catch (e) {
        this.toaster.error(e.toString());
        this.busyIndicator.hide(this.busyIndicatorId);
      }
    }
  }

  dependedFormsLoaded(hideBusyIndicator, log = '') {
    console.log('-------------------------------->>>', log, hideBusyIndicator);
    if (hideBusyIndicator) {
      this.busyIndicator.hide(this.dependedFormsBusyIndicatorId);
      this.dependedFormsBusyIndicatorId = null;
    }
    else {
      this.busyIndicator.hide(this.dependedFormsBusyIndicatorId);
      this.dependedFormsBusyIndicatorId = this.busyIndicator.show();
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
    const workbook = XLSX.writeFile(workBook, `${this.formId}.xlsx`);
  }
}
