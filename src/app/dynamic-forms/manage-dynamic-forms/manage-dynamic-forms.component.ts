import { Component, OnInit, ViewChild } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import {
  FormDetails,
  getFormDetails,
  getGridDetails,
  handleFormChange,
  handleFormSave,
  mapDataProviders,
} from "../../shared/utilities/get-from-config";
import { BehaviorSubject, combineLatest, Observable, of } from "rxjs";
import { switchMap, tap } from "rxjs/operators";
import { NgForm } from "@angular/forms";
import { BusyIndicatorService } from "../../layout/busy-indicator.service";
import { ToastrService } from "ngx-toastr";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { FORM_CONTROLLER_TYPE } from "../../shared/components/dynamic-form/dynamic-form-controller.interface";

@Component({
  selector: "app-manage-dynamic-forms",
  templateUrl: "./manage-dynamic-forms.component.html",
  styleUrls: ["./manage-dynamic-forms.component.sass"],
})
export class ManageDynamicFormsComponent implements OnInit {
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = [];
  readonly formControlType = FORM_CONTROLLER_TYPE;
  showTable = false;

  allForms$ = this.afs.collection("dynamic-forms").valueChanges();
  selectedForm$: BehaviorSubject<string> = new BehaviorSubject<string>("users");
  form$: Observable<FormDetails> = this.selectedForm$.pipe(
    switchMap((formId) => getFormDetails(formId, this.afs)),
    tap((data) => {
      this.displayedColumns = data.formControls.map((ctrl) => ctrl.name);
      this.displayedColumns.push("Actions");
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
      this.toaster.success("User Added Successfully");
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

  editItem(item: any) {}

  deleteItem(item: any) {}

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  changeFormTable($event: any) {
    this.showTable = false;
    this.selectedForm$.next($event);
  }
}
