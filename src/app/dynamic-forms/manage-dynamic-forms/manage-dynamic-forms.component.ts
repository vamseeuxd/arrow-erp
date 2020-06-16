import { Component, OnInit } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import {
  FormDetails,
  getFormDetails,
  mapDataProviders,
} from "../../shared/utilities/get-from-config";
import { combineLatest, Observable, of } from "rxjs";
import { switchMap } from "rxjs/operators";

@Component({
  selector: "app-manage-dynamic-forms",
  templateUrl: "./manage-dynamic-forms.component.html",
  styleUrls: ["./manage-dynamic-forms.component.sass"],
})
export class ManageDynamicFormsComponent implements OnInit {
  data = [
    {
      dataProvider: "gender",
      displayBy: "name",
      name: "gender",
      identifyBy: "id",
      value: null,
      type: "select",
      label: "Gender",
      id: "5S5ITq0cF6U4yiKSGvEa",
    },
    {
      name: "gender",
      value: null,
      type: "select",
      label: "Gender",
      id: "5S5ITq0cF6U4yiKSGvEa",
    },
    {
      dataProvider: "gender",
      displayBy: "name",
      name: "gender",
      identifyBy: "id",
      value: null,
      type: "select",
      label: "Gender",
      id: "5S5ITq0cF6U4yiKSGvEa",
    },
  ];

  form$: Observable<FormDetails> = getFormDetails("users", this.afs);

  result$ = of(this.data).pipe(mapDataProviders(this.afs));

  constructor(public afs: AngularFirestore) {}

  ngOnInit(): void {}
}
