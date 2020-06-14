import {Inject, Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import {map, switchMap, tap} from 'rxjs/operators';

@Injectable()
export class ItemsService {
  readonly collectionName = 'memberships';
  readonly dataColumns = ['name', 'price', 'startDate', 'endDate', 'active'];
  readonly actionColumns = ['edit', 'delete'];
  readonly displayedColumns = [...this.dataColumns, ...this.actionColumns];
  membershipsCollections: AngularFirestoreCollection<any>;
  formControlsList$ = this.afs.collection(
    'dynamic-forms',
    ref => ref.where('formID', '==', this.collectionName)
  ).valueChanges().pipe(
    switchMap(
      (value: any[]) => this.afs.collection(
        'dynamic-form-controls',
        ref => ref.where('formId', '==', value[0].id)
      ).valueChanges()
    )
  ).pipe(map((things) => things.sort(this.sortFunction)));

  constructor(
    public afs: AngularFirestore,
  ) {
    this.membershipsCollections = afs.collection<any>(this.collectionName);
  }

  private sortFunction(a: any, b: any) {
    if (a.position < b.position) {
      return -1;
    }
    if (a.position > b.position) {
      return 1;
    }
    return 0;
  }

  async saveItem(formData: any): Promise<any> {
    Object.keys(formData).forEach(
      (key) => formData[key] === undefined && delete formData[key]
    );
    return new Promise(
      async function(resolve, reject) {
        try {
          const response = await this.membershipsCollections.add({
            ...formData,
            createdOn: this.getServerTime(),
          });
          const docRef = await this.membershipsCollections.doc(response.id);
          const doc = await docRef.get().toPromise();
          await docRef.set({...doc.data(), id: response.id});
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
      async function(resolve, reject) {
        try {
          const docRef = await this.membershipsCollections.doc(id);
          const doc = await docRef.get().toPromise();
          await docRef.set({
            ...formData,
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

  deleteDynamicForm(id: string): Promise<any> {
    return new Promise(
      async function(resolve, reject) {
        try {
          await this.membershipsCollections.doc(id).delete();
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
}
