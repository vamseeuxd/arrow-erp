import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from "@angular/fire/firestore";
import { Observable, Subject } from "rxjs";
import * as firebase from "firebase/app";
import "firebase/firestore";
import { OnlineClassInterface } from "./interfaces/online-class.interface";
import { ChatMemberInterface } from "./interfaces/chat-member.interface";
import { switchMap } from "rxjs/operators";

@Injectable()
export class OnlineClassesService {
  private onlineClassesCollection: AngularFirestoreCollection<
    OnlineClassInterface
  >;
  public onlineClassesList: Observable<OnlineClassInterface[]>;
  private chatMembersCollection: AngularFirestoreCollection<
    ChatMemberInterface
  >;
  public chatMembersList: Observable<ChatMemberInterface[]>;

  constructor(private afs: AngularFirestore) {
    this.onlineClassesCollection = afs.collection<OnlineClassInterface>(
      "onlineClassesList"
    );
    this.onlineClassesList = this.onlineClassesCollection.valueChanges();

    this.chatMembersCollection = afs.collection<ChatMemberInterface>(
      "chatMembers"
    );
    this.chatMembersList = this.chatMembersCollection.valueChanges();
  }

  async joinIntoChat(member: ChatMemberInterface): Promise<any> {
    member.joinTime = this.getServerTime();
    return new Promise(
      async function (resolve, reject) {
        try {
          const response = await this.chatMembersCollection.add({
            ...member,
            createdOn: this.getServerTime(),
          });
          const docRef = await this.chatMembersCollection.doc(response.id);
          const doc = await docRef.get().toPromise();
          await docRef.set({ ...doc.data(), id: response.id });
          console.log("response.id", response.id);
          resolve(response.id);
        } catch (e) {
          reject(e);
        }
      }.bind(this)
    );
  }

  exitFromChat(
    member: ChatMemberInterface,
    id: string,
    createdOn: any
  ): Promise<any> {
    member.exitTime = this.getServerTime();
    return new Promise(
      async function (resolve, reject) {
        try {
          const docRef = await this.chatMembersCollection.doc(id);
          const doc = await docRef.get().toPromise();
          await docRef.set({
            ...member,
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

  getServerTime(): any {
    return firebase.firestore.FieldValue.serverTimestamp();
  }

  async addOnlineClasses(onlineClass: OnlineClassInterface): Promise<any> {
    const classDate = new Date(onlineClass.classDate).toDateString();
    const classTime = new Date(onlineClass.classTime).getTime();

    return new Promise(
      async function (resolve, reject) {
        try {
          const response = await this.onlineClassesCollection.add({
            ...onlineClass,
            classDate,
            classTime,
            createdOn: this.getServerTime(),
          });
          const docRef = await this.onlineClassesCollection.doc(response.id);
          const doc = await docRef.get().toPromise();
          await docRef.set({ ...doc.data(), id: response.id });
          resolve(response.id);
        } catch (e) {
          reject(e);
        }
      }.bind(this)
    );
  }

  updateOnlineClasses(
    onlineClass: OnlineClassInterface,
    id: string,
    createdOn: any
  ): Promise<any> {
    const classDate = new Date(onlineClass.classDate).toDateString();
    const classTime = new Date(onlineClass.classTime).getTime();
    return new Promise(
      async function (resolve, reject) {
        try {
          const docRef = await this.onlineClassesCollection.doc(id);
          const doc = await docRef.get().toPromise();
          await docRef.set({
            ...onlineClass,
            classDate,
            classTime,
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

  deleteOnlineClasses(id: string): Promise<any> {
    return new Promise(
      async function (resolve, reject) {
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
