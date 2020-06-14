import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from "@angular/fire/firestore";
import { BehaviorSubject, combineLatest, Observable, of, Subject } from "rxjs";
import { switchMap } from "rxjs/operators";
import { leftJoin } from "../shared/utilities/collectionJoin";

export interface ListInterface {
  id?: string;
  name: string;
}

@Injectable({
  providedIn: "root",
})
export class DbListCreatorService {
  private listName = "blood-group-list";
  private listCollection = this.afs.collection<ListInterface>(this.listName);

  constructor(private afs: AngularFirestore) {}

  async addNewList() {
    console.log("Please wait....");
    const sampleList: Array<any> = [
      { name: "A+" },
      { name: "A-" },
      { name: "B+" },
      { name: "B-" },
      { name: "AB+" },
      { name: "AB-" },
      { name: "O+" },
      { name: "O-" },
    ];
    for (const item of sampleList) {
      const response = await this.listCollection.add(item);
      const docRef = await this.listCollection.doc(response.id);
      const doc = await docRef.get().toPromise();
      await docRef.set({ ...doc.data(), id: response.id });
    }
    console.log(
      "-----------------------------  blood-group-list done -----------------------------"
    );
  }

  addNewList2() {
    const sampleList: Array<ListInterface> = [
      { name: "A+" },
      { name: "A-" },
      { name: "B+" },
      { name: "B-" },
      { name: "AB+" },
      { name: "AB-" },
      { name: "O+" },
      { name: "O-" },
    ];

    Promise.all(
      sampleList.map((value) => this.listCollection.doc(value.id).set(value))
    )
      .then((value) => {
        debugger;
      })
      .catch((reason) => {
        debugger;
      });
  }
}

/*
{name: 'Andra Pradesh'},
{name: 'Arunachal Pradesh'},
{name: 'Assam'},
{name: 'Bihar'},
{name: 'Chhattisgarh'},
{name: 'Goa'},
{name: 'Gujarat'},
{name: 'Haryana'},
{name: 'Himachal Pradesh'},
{name: 'Jammu and Kashmir'},
{name: 'Jharkhand'},
{name: 'Karnataka'},
{name: 'Kerala'},
{name: 'Madya Pradesh'},
{name: 'Maharashtra'},
{name: 'Manipur'},
{name: 'Meghalaya'},
{name: 'Mizoram'},
{name: 'Nagaland'},
{name: 'Orissa'},
{name: 'Punjab'},
{name: 'Rajasthan'},
{name: 'Sikkim'},
{name: 'Tamil Nadu'},
{name: 'Telagana'},
{name: 'Tripura'},
{name: 'Uttaranchal'},
{name: 'Uttar Pradesh'},
{name: 'West Bengal'},
{name: 'Andaman and Nicobar Islands'},
{name: 'Chandigarh'},
{name: 'Dadar and Nagar Haveli'},
{name: 'Daman and Diu'},
{name: 'Delhi'},
{name: 'Lakshadeep'},
{name: 'Pondicherry'},
* */
