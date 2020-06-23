import {Component, OnInit, ViewChild} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {BehaviorSubject, combineLatest, Observable, of} from 'rxjs';
import {tap} from 'rxjs/operators';
import {MatSort} from '@angular/material/sort';

@Component({
  selector: 'app-manage-dynamic-forms',
  templateUrl: './manage-dynamic-forms.component.html',
  styleUrls: ['./manage-dynamic-forms.component.sass'],
})
export class ManageDynamicFormsComponent {
  @ViewChild(MatSort) sort: MatSort;
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

  constructor(
    public afs: AngularFirestore,
  ) {}

  changeFormTable($event: any) {
    this.selectedForm$.next($event);
    this.selectedForm = $event;
  }
}
