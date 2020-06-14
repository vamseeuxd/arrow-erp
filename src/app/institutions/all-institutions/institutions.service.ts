import { Injectable } from "@angular/core";
import { InstitutionsInterface } from "./institutions.model";
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from "@angular/fire/firestore";
import { Observable } from "rxjs";
import * as firebase from "firebase";

@Injectable()
export class InstitutionsService {
  private institutionsCollection: AngularFirestoreCollection<
    InstitutionsInterface
  >;
  public institutionsList: Observable<InstitutionsInterface[]>;

  constructor(private afs: AngularFirestore) {
    this.institutionsCollection = afs.collection<InstitutionsInterface>(
      "institutionsList"
    );
    this.institutionsList = this.institutionsCollection.valueChanges();
  }

  async addInstitutions(institution: InstitutionsInterface): Promise<any> {
    return new Promise(
      async function (resolve, reject) {
        try {
          const response = await this.institutionsCollection.add({
            ...institution,
            institutionId: institution.institutionId.toLowerCase(),
            createdOn: firebase.firestore.FieldValue.serverTimestamp(),
          });
          const docRef = await this.institutionsCollection.doc(response.id);
          const doc = await docRef.get().toPromise();
          await docRef.set({ ...doc.data(), id: response.id });
          resolve(response.id);
        } catch (e) {
          reject(e);
        }
      }.bind(this)
    );
  }

  updateInstitutions(
    institution: InstitutionsInterface,
    id: string,
    createdOn: any
  ): Promise<any> {
    return new Promise(
      async function (resolve, reject) {
        try {
          const docRef = await this.institutionsCollection.doc(id);
          const doc = await docRef.get().toPromise();
          await docRef.set({
            ...institution,
            institutionId: institution.institutionId.toLowerCase(),
            updatedOn: firebase.firestore.FieldValue.serverTimestamp(),
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

  deleteInstitutions(id: string): Promise<any> {
    return new Promise(
      async function (resolve, reject) {
        try {
          await this.institutionsCollection.doc(id).delete();
          resolve(id);
        } catch (e) {
          reject(e);
        }
      }.bind(this)
    );
  }
}
