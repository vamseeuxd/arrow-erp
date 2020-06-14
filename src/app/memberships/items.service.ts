import { Inject, Injectable } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from "@angular/fire/firestore";
import * as firebase from "firebase/app";
import { map, shareReplay, switchMap, tap } from "rxjs/operators";
import { BehaviorSubject } from "rxjs";

@Injectable()
export class ItemsService {
  readonly collectionName = "memberships";
  itemsCollection: AngularFirestoreCollection<any>;
  gridPageTitle = "";
  addFormPageTitle = "";
  editFormPageTitle = "";
  formDetails$ = this.afs
    .collection("dynamic-forms", (ref) =>
      ref.where("formID", "==", this.collectionName)
    )
    .valueChanges();

  formControlsList$ = this.formDetails$
    .pipe(
      switchMap((value: any[]) =>
        this.afs
          .collection("dynamic-form-controls", (ref) =>
            ref.where("formId", "==", value[0].id)
          )
          .valueChanges()
      ),
      shareReplay(1)
    )
    .pipe(map((things) => things.sort(this.sortFunction)));
  formControlsList = [];
  defaultValues = {};
  gridColumnConfig$: BehaviorSubject<
    { headerName: string; fieldId: string; type: string }[]
  > = new BehaviorSubject<
    { headerName: string; fieldId: string; type: string }[]
  >([]);
  actionColumns = ["Actions"];
  displayedColumns$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>(
    []
  );

  constructor(public afs: AngularFirestore) {
    this.itemsCollection = afs.collection<any>(this.collectionName);
    this.formDetails$.subscribe((value: any[]) => {
      this.gridPageTitle = value[0].gridPageTitle;
      this.addFormPageTitle = value[0].addFormPageTitle;
      this.editFormPageTitle = value[0].editFormPageTitle;
    });
    this.formControlsList$.subscribe((value) => {
      this.formControlsList = value;
      const gridColumnConfig: {
        headerName: string;
        fieldId: string;
        type: string;
      }[] = [];
      const dataColumns = [];
      value.forEach((value1: any) => {
        this.defaultValues[value1.name] = value1.value ? value1.value : null;
        gridColumnConfig.push({
          headerName: value1.label,
          fieldId: value1.name,
          type: value1.type,
        });
        dataColumns.push(value1.name);
      });
      this.gridColumnConfig$.next(gridColumnConfig);
      this.displayedColumns$.next([...dataColumns, ...this.actionColumns]);
    });
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
      async function (resolve, reject) {
        try {
          const response = await this.itemsCollection.add({
            ...formData,
            createdOn: this.getServerTime(),
          });
          const docRef = await this.itemsCollection.doc(response.id);
          const doc = await docRef.get().toPromise();
          await docRef.set({ ...doc.data(), id: response.id });
          resolve(response.id);
        } catch (e) {
          reject(e);
        }
      }.bind(this)
    );
  }

  updateItem(formData: any, id: string, createdOn: any): Promise<any> {
    Object.keys(formData).forEach(
      (key) => formData[key] === undefined && delete formData[key]
    );
    return new Promise(
      async function (resolve, reject) {
        try {
          const docRef = await this.itemsCollection.doc(id);
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

  deleteItem(id: string): Promise<any> {
    return new Promise(
      async function (resolve, reject) {
        try {
          await this.itemsCollection.doc(id).delete();
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
