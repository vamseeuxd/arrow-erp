import {Component, OnInit} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {
  FormDetails,
  getFormDetails, handleFormChange,
  mapDataProviders,
} from '../../shared/utilities/get-from-config';
import {combineLatest, Observable, of} from 'rxjs';
import {switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-manage-dynamic-forms',
  templateUrl: './manage-dynamic-forms.component.html',
  styleUrls: ['./manage-dynamic-forms.component.sass'],
})
export class ManageDynamicFormsComponent implements OnInit {
  form$: Observable<FormDetails> = getFormDetails('users', this.afs);
  handleFormChange = handleFormChange;

  constructor(public afs: AngularFirestore) {
  }

  ngOnInit(): void {
  }
}
