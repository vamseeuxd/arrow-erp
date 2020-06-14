import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from "@angular/fire/firestore";
import { OnlineClassInterface } from "./interfaces/online-class.interface";
import { BehaviorSubject, combineLatest, Observable, of, Subject } from "rxjs";
import { switchMap } from "rxjs/operators";
import { leftJoin } from "../shared/utilities/collectionJoin";

@Injectable({
  providedIn: "root",
})
export class OnlineClassesService2 {
  private userId$ = new BehaviorSubject<string>("teacher1");
  private userRole$ = new BehaviorSubject<string>("teacher");

  private classesCollection = this.afs.collection<OnlineClassInterface>(
    "onlineClassesList"
  );
  public classesList$ = combineLatest(this.userId$, this.userRole$).pipe(
    switchMap(([userId, userRole]) => {
      let fieldName = "teacher";
      switch (userRole) {
        case "teacher":
          fieldName = "teacher";
          break;
        case "student":
          fieldName = "students";
          break;
      }
      return this.afs
        .collection<OnlineClassInterface>("onlineClassesList", (ref) =>
          ref.where(fieldName, "==", userId)
        )
        .valueChanges()
        .pipe(leftJoin(this.afs, "onlineClassId", "id", "chatMembers"));
    })
  );

  constructor(private afs: AngularFirestore) {}

  setUserId(userId: string, userRole: string) {
    this.userRole$.next(userRole);
    this.userId$.next(userId);
  }
}
