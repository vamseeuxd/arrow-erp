import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from "@angular/fire/firestore";
import { BehaviorSubject, combineLatest, Observable, of, Subject } from "rxjs";
import { switchMap } from "rxjs/operators";
import { leftJoin } from "../shared/utilities/collectionJoin";

export interface DropDownList {
  id: string;
  name: string;
}

@Injectable({
  providedIn: "root",
})
export class StudentService {
  private genderListCollection = this.afs.collection<DropDownList>(
    "gender",
    (ref) => ref.orderBy("name")
  );
  genderList$: Observable<
    DropDownList[]
  > = this.genderListCollection.valueChanges();

  private bloodGroupListCollection = this.afs.collection<DropDownList>(
    "blood-group-list",
    (ref) => ref.orderBy("name")
  );
  bloodGroupList$: Observable<
    DropDownList[]
  > = this.bloodGroupListCollection.valueChanges();

  private selectedCountry$: BehaviorSubject<string> = new BehaviorSubject<
    string
  >("gnh2QKH4CGRGAYkcE2xQ");
  private countriesListCollection = this.afs.collection<DropDownList>(
    "countries",
    (ref) => ref.orderBy("name")
  );
  countriesList$: Observable<
    DropDownList[]
  > = this.countriesListCollection.valueChanges();

  private statesListCollection = this.afs.collection<DropDownList>("states");
  statesList$: Observable<any[]> = this.selectedCountry$.pipe(
    switchMap((selectedCountry) =>
      this.afs
        .collection("states", (ref) =>
          ref.where("countryId", "==", selectedCountry).orderBy("name")
        )
        .valueChanges()
    )
  );

  constructor(private afs: AngularFirestore) {}
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
