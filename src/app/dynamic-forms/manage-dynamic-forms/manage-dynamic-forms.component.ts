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
  readonly formControlType = FORM_CONTROLLER_TYPE;
  showTable = false;

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
  // filterValueControl
  formDependedForms$ = this.selectedForm$.pipe(
    switchMap(
      (value: string) => {
        if (value && value.length > 0) {
          /*  ------------------------------------  */
          return this.afs.collection(
            'dynamic-form-controls',
            ref => ref.where('dataProviderCollectionName', '==', value)
          ).valueChanges()
            .pipe(
              leftJoin(this.afs, 'id', 'formId', 'dynamic-forms'),
              map((response: any[]) => {
                return response.map(d => {
                  return {
                    ['dataProviderCollectionName']: d.dataProviderCollectionName,
                    ['identifyBy']: d.identifyBy,
                    ['displayBy']: d.displayBy,
                    ['name']: d.name,
                    ['filterBy']: d.filterBy,
                    ['dynamic-forms']: d['dynamic-forms'],
                  };
                });
              })
            );
          /*  ------------------------------------  */
        }
        else {
          return of([]);
        }
      }
    )
  );
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
  handleFormChange = handleFormChange;
  demoNgForm: NgForm;
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
      this.showTable = true;
      this.busyIndicator.hide(this.busyIndicatorId);
    });
  }

  async saveFormData(formData: any, formId: string) {
    const busyIndicatorId = this.busyIndicator.show();
    try {
      await handleFormSave(this.afs, formData, formId);
      this.busyIndicator.hide(busyIndicatorId);
      this.demoNgForm.resetForm({});
      this.toaster.success(`${pluralize.singular(formId)} Added Successfully`);
    } catch (e) {
      this.busyIndicator.hide(busyIndicatorId);
      alert(JSON.stringify(e));
    }
  }

  onDemoFormInit($event: NgForm) {
    setTimeout(() => {
      this.demoNgForm = $event;
    });
  }

  trackByUid(index, item) {
    return item.id;
  }

  editItem(item: any) {
  }

  deleteItem(item: any) {
    // this.afs.collection('test').ref.get()
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  changeFormTable($event: any) {
    this.showTable = false;
    this.selectedForm$.next($event);
    this.selectedForm = $event;
  }
}
