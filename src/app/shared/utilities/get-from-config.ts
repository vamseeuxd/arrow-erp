import {
  BehaviorSubject,
  combineLatest,
  defer,
  Observable,
  of,
  Subject,
} from "rxjs";
import { AngularFirestore } from "@angular/fire/firestore";
import { map, switchMap, tap } from "rxjs/operators";
import { hasOwnProperty } from "tslint/lib/utils";

export const sortFunction = (a: any, b: any) => {
  if (a.position < b.position) {
    return -1;
  }
  if (a.position > b.position) {
    return 1;
  }
  return 0;
};
export const getFormDetails = (
  formId,
  afs: AngularFirestore
): Observable<FormDetails> => {
  return afs
    .collection("dynamic-forms", (ref) => ref.where("formID", "==", formId))
    .valueChanges()
    .pipe(
      switchMap((value: any[]) => {
        return combineLatest([
          of(value[0]),
          afs
            .collection("dynamic-form-controls", (ref) =>
              ref.where("formId", "==", value[0].id)
            )
            .valueChanges(),
        ]);
      }),
      switchMap(([formDetails, formControls]) => {
        delete formDetails.updatedOn;
        delete formDetails.createdOn;
        formControls.forEach((d: any) => {
          delete d.updatedOn;
          delete d.createdOn;
        });
        return of({
          ...formDetails,
          formControls,
        });
      })
    );
};
export const mapDataProviders = (afs: AngularFirestore) => {
  return (source) =>
    defer(() => {
      let collectionData;
      let totalJoins = 0;
      return source.pipe(
        switchMap((data: any) => {
          collectionData = data as any[];
          const reads$ = [];
          if (data && data.length > 0) {
            for (const doc of collectionData) {
              if (
                doc.hasOwnProperty("dataProviderCollectionName") &&
                doc.dataProviderCollectionName.length > 0
              ) {
                if (doc.hasOwnProperty("filterBy") && doc.filterBy.length > 0) {
                  const action$ = new Subject<string>();
                  const data$ = action$.pipe(
                    switchMap((value) =>
                      afs
                        .collection(doc.dataProviderCollectionName, (ref) =>
                          ref.where(doc.filterBy, "==", value)
                        )
                        .valueChanges()
                    )
                  );
                  reads$.push(of({ action: action$, data: data$ }));
                  // reads$.push(afs.collection(doc.dataProviderCollectionName).valueChanges());
                } else {
                  reads$.push(
                    afs
                      .collection(doc.dataProviderCollectionName)
                      .valueChanges()
                  );
                }
              } else {
                reads$.push(of("ignore"));
              }
            }
            return combineLatest(reads$);
          } else {
            return of([]);
          }
        }),
        map((joins) => {
          return collectionData.map((v, i) => {
            totalJoins += joins[i].length;
            if (joins[i] !== "ignore") {
              if (joins[i].hasOwnProperty("action")) {
                v.action$ = joins[i].action;
                v.data$ = joins[i].data;
                v.dataProvider = [];
              } else {
                v.dataProvider = joins[i];
              }
            }
            return v;
          });
        }),
        tap((final) => {
          console.log(
            `Queried ${(final as any).length}, Joined ${totalJoins} docs`
          );
          totalJoins = 0;
        })
      );
    });
};
export const handleFormChange = (formControls: any[], changeControl: any) => {
  console.clear();
  console.log(changeControl);
  console.log("---------------------");
  console.log(formControls);
  formControls.forEach((value) => {
    if (changeControl.name === value.filterValueControl && value.action$) {
      const y$ = value.data$.subscribe((x) => {
        value.dataProvider = x;
        y$.unsubscribe();
      });
      value.action$.next(changeControl.value);
    }
  });
};

export interface FormDetails {
  addFormPageTitle: string;
  formID: string;
  id: string;
  defaultColumnClass: string;
  editFormPageTitle: string;
  gridPageTitle: string;
  formControls: any[];
}
