import {Component, OnInit, ViewChild} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {
  FormDetails,
  getFormDetails,
  getGridDetails,
  handleFormChange,
  handleFormSave,
} from '../../shared/utilities/get-from-config';
import {BehaviorSubject, combineLatest, Observable, of} from 'rxjs';
import {map, switchMap, tap} from 'rxjs/operators';
import {NgForm} from '@angular/forms';
import {BusyIndicatorService} from '../../layout/busy-indicator.service';
import {ToastrService} from 'ngx-toastr';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {FORM_CONTROLLER_TYPE} from '../../shared/components/dynamic-form/dynamic-form-controller.interface';
import {leftJoin} from '../../shared/utilities/collectionJoin';
import * as pluralize from 'pluralize';

@Component({
  selector: 'app-manage-dynamic-forms',
  templateUrl: './manage-dynamic-forms.component.html',
  styleUrls: ['./manage-dynamic-forms.component.sass'],
})
export class ManageDynamicFormsComponent implements OnInit {
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = [];
  allForms$ = this.afs.collection('dynamic-forms').valueChanges().pipe(
    tap(
      (data: any[]) => {
        if (data && data.length > 0) {
          const isDeletedFormExist = data.find(d => d.formID === this.selectedForm);
          if (!isDeletedFormExist) {
            this.selectedForm = this.SELECTED_FORM_LABEL;
            this.selectedForm$.next(this.SELECTED_FORM_LABEL);
          }
        }
        else {
          this.selectedForm = this.SELECTED_FORM_LABEL;
          this.selectedForm$.next(this.SELECTED_FORM_LABEL);
        }
      }
    )
  );
  readonly SELECTED_FORM_LABEL = 'Select Form';
  selectedForm = this.SELECTED_FORM_LABEL;
  selectedForm$: BehaviorSubject<string> = new BehaviorSubject<string>(this.selectedForm);
  form$: Observable<FormDetails> = this.selectedForm$.pipe(
    switchMap((formId) => getFormDetails(formId, this.afs)),
    tap((data) => {
      if (data && data.formControls && data.formControls.length > 0) {
        this.displayedColumns = data.formControls.map((ctrl) => ctrl.name);
        this.displayedColumns.push('Actions');
      }
    })
  );
  grid$: Observable<any> = this.form$.pipe(
    switchMap((value: FormDetails) => {
      return getGridDetails(value.formID, this.afs, value.formControls);
    })
  );
  busyIndicatorId;

  constructor(
    public afs: AngularFirestore,
    private busyIndicator: BusyIndicatorService,
    private toaster: ToastrService
  ) {
    this.busyIndicatorId = this.busyIndicator.show();
  }

  ngOnInit(): void {
    this.grid$.subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.busyIndicator.hide(this.busyIndicatorId);
    });
  }

  changeFormTable($event: any) {
    this.selectedForm$.next($event);
    this.selectedForm = $event;
  }
}
