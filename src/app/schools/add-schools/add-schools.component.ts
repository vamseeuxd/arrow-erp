import {AfterViewInit, Component, EventEmitter, Input, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {SchoolsInterface} from '../all-schools/schools.model';
import {Observable} from 'rxjs';
import * as firebase from 'firebase';

@Component({
  selector: 'app-add-school',
  templateUrl: './add-schools.component.html',
  styleUrls: ['./add-schools.component.sass']
})
export class AddSchoolsComponent implements AfterViewInit {
  schoolForm: FormGroup;
  schoolsCollection: AngularFirestoreCollection<SchoolsInterface>;
  schoolsList: Observable<SchoolsInterface[]>;
  isLoading = false;
  @Input() isPage = true;
  @Input() school: SchoolsInterface;
  @Output() cancel: EventEmitter<any> = new EventEmitter<any>();
  @Output() save: EventEmitter<SchoolsInterface> = new EventEmitter<SchoolsInterface>();
  showForm: boolean = false;

  constructor(
    private fb: FormBuilder,
    private afs: AngularFirestore
  ) {
    this.schoolsCollection = afs.collection<SchoolsInterface>('schoolsList');
    this.schoolsList = this.schoolsCollection.valueChanges();
  }

  ngAfterViewInit() {
    this.schoolForm = this.fb.group({
      institutionName: [(this.school ? this.school.institutionName : ''), [Validators.required]],
      contactPerson: [(this.school ? this.school.contactPerson : ''), [Validators.required]],
      contactEmail: [(this.school ? this.school.contactEmail : ''), [Validators.required]],
      contactPhone: [(this.school ? this.school.contactPhone : ''), [Validators.required, Validators.pattern('^(?:(?:\\+|0{0,2})91(\\s*[\\ -]\\s*)?|[0]?)?[789]\\d{9}|(\\d[ -]?){10}\\d$')]],
      memberShip: [(this.school ? this.school.memberShip : ''), [Validators.required]],
      status: [(this.school ? this.school.status : ''), [Validators.required]],
    });
    setTimeout(() => {
      this.showForm = true;
    });
  }

  async onSubmit() {
    if (this.school) {
      this.isLoading = true;
      const docRef = await this.schoolsCollection.doc(this.school.id);
      const doc = await docRef.get().toPromise();
      await docRef.set(
        {
          ...this.schoolForm.value,
          updatedOn: firebase.firestore.FieldValue.serverTimestamp(),
          id: this.school.id,
          createdOn: this.school.createdOn,
        }
      );
      this.showForm = false;
      this.schoolForm.reset();
      setTimeout(() => {
        this.showForm = true;
      });
      this.save.emit(this.schoolForm.value);
      this.isLoading = false;
    }
    else {
      this.isLoading = true;
      console.log('Form Value', this.schoolForm.value);
      const response = await this.schoolsCollection.add({
        ...this.schoolForm.value,
        createdOn: firebase.firestore.FieldValue.serverTimestamp()
      });
      const docRef = await this.schoolsCollection.doc(response.id);
      const doc = await docRef.get().toPromise();
      await docRef.set({...doc.data(), id: response.id});
      this.showForm = false;
      this.schoolForm.reset();
      setTimeout(() => {
        this.showForm = true;
      });
      this.save.emit(this.schoolForm.value);
      this.isLoading = false;
    }
  }
}
