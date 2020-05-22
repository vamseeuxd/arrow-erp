import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import * as firebase from 'firebase';
import {OnlineClassInterface} from './interfaces/online-class.interface';

@Injectable()
export class OnlineClassesService {

  private onlineClassesCollection: AngularFirestoreCollection<OnlineClassInterface>;
  public onlineClassesList: Observable<OnlineClassInterface[]>;

  constructor(
    private afs: AngularFirestore
  ) {
    this.onlineClassesCollection = afs.collection<OnlineClassInterface>('onlineClassesList');
    this.onlineClassesList = this.onlineClassesCollection.valueChanges();
  }

  async addOnlineClasss(onlineClass: OnlineClassInterface): Promise<any> {
    return new Promise(
      async function(resolve, reject) {
        try {
          const response = await this.onlineClassesCollection.add({
            ...onlineClass,
            onlineClassId: onlineClass.onlineClassId.toLowerCase(),
            createdOn: firebase.firestore.FieldValue.serverTimestamp()
          });
          const docRef = await this.onlineClassesCollection.doc(response.id);
          const doc = await docRef.get().toPromise();
          await docRef.set({...doc.data(), id: response.id});
          resolve(response.id);
        } catch (e) {
          reject(e);
        }
      }.bind(this)
    );
  }

  updateOnlineClasss(onlineClass: OnlineClassInterface, id: string, createdOn: any): Promise<any> {
    return new Promise(
      async function(resolve, reject) {
        try {
          const docRef = await this.onlineClassesCollection.doc(id);
          const doc = await docRef.get().toPromise();
          await docRef.set(
            {
              ...onlineClass,
              onlineClassId: onlineClass.onlineClassId.toLowerCase(),
              updatedOn: firebase.firestore.FieldValue.serverTimestamp(),
              id,
              createdOn,
            }
          );
          resolve(id);
        } catch (e) {
          reject(e);
        }
      }.bind(this)
    );
  }

  deleteOnlineClasss(id: string): Promise<any> {
    return new Promise(
      async function(resolve, reject) {
        try {
          await this.onlineClassesCollection.doc(id).delete();
          resolve(id);
        } catch (e) {
          reject(e);
        }
      }.bind(this)
    );
  }
}
