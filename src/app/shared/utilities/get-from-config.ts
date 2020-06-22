import {combineLatest, defer, Observable, of, pipe, Subject,} from 'rxjs';
import {AngularFirestore} from '@angular/fire/firestore';
import {map, switchMap, tap} from 'rxjs/operators';
import * as firebase from 'firebase/app';
import * as _ from 'lodash';
import {leftJoin} from './collectionJoin';

export const getServerTime = (): any => {
  return firebase.firestore.Timestamp.now().toDate();
};
export const sortFunction = (a: any, b: any) => {
  if (a.position < b.position) {
    return -1;
  }
  if (a.position > b.position) {
    return 1;
  }
  return 0;
};
export const getFormDetails = (formId, afs: AngularFirestore): Observable<FormDetails> => {
  const query = (ref) => ref.where('formID', '==', formId);
  const ifCase = of([]);
  return afs
    .collection('dynamic-forms', query)
    .valueChanges()
    .pipe(
      switchMap((value: any[]) => {
        if (value && value.length > 0) {
          return combineLatest([
            of(value[0]),
            afs
              .collection('dynamic-form-controls', (ref) =>
                ref.where('formId', '==', value[0] ? value[0].id : '').orderBy('position')
              )
              .valueChanges()
              .pipe(mapDataProviders(afs)),
          ]);
        }
        else {
          return of([]);
          // return throwError('No Records found with formID');
        }
      }),
      switchMap(([formDetails, formControls]) => {
        if (formDetails) {
          delete formDetails.updatedOn;
          delete formDetails.createdOn;
          (formControls as any[]).forEach((d: any) => {
            delete d.updatedOn;
            delete d.createdOn;
          });
        }
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
                doc.hasOwnProperty('dataProviderCollectionName') &&
                doc.dataProviderCollectionName.length > 0
              ) {
                if (doc.filterBy && doc.filterBy.length > 0) {
                  const action$ = new Subject<string>();
                  const data$ = action$.pipe(
                    switchMap((value) => {
                        return afs
                          .collection(doc.dataProviderCollectionName,
                            (ref) => ref.where(doc.filterBy, '==', value).orderBy(doc.displayBy)
                          )
                          .valueChanges().pipe(
                            tap(xyz => {
                              // console.log(`collection(${doc.dataProviderCollectionName}, where(${doc.filterBy}, '==', ${value})`);
                              // console.log(xyz);
                            })
                          );
                      }
                    )
                  );
                  reads$.push(of({action: action$, data: data$}));
                  // reads$.push(afs.collection(doc.dataProviderCollectionName).valueChanges());
                }
                else {
                  reads$.push(
                    afs
                      .collection(doc.dataProviderCollectionName)
                      .valueChanges()
                  );
                }
              }
              else {
                reads$.push(of('ignore'));
              }
            }
            return combineLatest(reads$);
          }
          else {
            return of([]);
          }
        }),
        map((joins) => {
          return collectionData.map((v, i) => {
            totalJoins += joins[i].length;
            if (joins[i] !== 'ignore') {
              if (joins[i].hasOwnProperty('action')) {
                v.action$ = joins[i].action;
                v.data$ = joins[i].data;
                v.dataProvider = [];
              }
              else {
                v.dataProvider = joins[i];
              }
            }
            return v;
          });
        }),
        tap((final) => {
          totalJoins = 0;
        })
      );
    });
};
export const handleFormChange = (formControls: any[], changeControl: any) => {
  formControls.forEach((value) => {
    if (
      changeControl &&
      changeControl.name === value.filterValueControl &&
      value.action$
    ) {
      const y$ = value.data$.subscribe((x) => {
        value.dataProvider = x;
        // y$.unsubscribe();
      });
      value.action$.next(changeControl.value);
    }
  });
};
export const handleFormSave = (afs: AngularFirestore, formData: any, formId: string, docId = ''): Promise<any> => {
  const formControlCollection = afs.collection<any>(formId);
  Object.keys(formData).forEach(
    (key) => formData[key] === undefined && delete formData[key]
  );
  return new Promise(async (resolve, reject) => {
    try {
      if (docId.trim().length > 0) {
        const docRef = formControlCollection.ref.doc(docId);
        await docRef.set({
          id: docRef.id,
          ...formData,
          deleted: false,
          updatedOn: getServerTime(),
        });
        resolve(docRef.id);
      }
      else {
        const docRef = formControlCollection.ref.doc();
        await docRef.set({
          id: docRef.id,
          ...formData,
          deleted: false,
          createdOn: getServerTime(),
        });
        resolve(docRef.id);
      }
    } catch (e) {
      reject(e);
    }
  });
};
export const handleFormDelete = (afs: AngularFirestore, rowId, formId): Promise<any> => {
  const formControlCollection = afs.collection<any>(formId);
  return new Promise(async (resolve, reject) => {
    try {
      const docRef = await formControlCollection.doc(rowId);
      const doc = await docRef.get().toPromise();
      await docRef.set({...doc.data(), deleted: true});
      resolve('Deleted Successfully');
    } catch (e) {
      reject(e);
    }
  });
};
export const getGridDetails = (formId, afs: AngularFirestore, formControls: any[]): Observable<any> => {
  const relationShips = [];
  if (formControls) {
    formControls.forEach((ctrl) => {
      if (ctrl.hasOwnProperty('dataProviderCollectionName')) {
        relationShips.push(
          leftJoin(
            afs,
            ctrl.identifyBy,
            ctrl.name,
            ctrl.dataProviderCollectionName
          )
        );
      }
    });
    return afs
      .collection(
        formId,
        (ref) => ref.where('deleted', '==', false)
      )
      .valueChanges()
      .pipe(
        pipe.apply(this, relationShips),
        map((controls: any[]) => {
          const optionsToReturn = [];
          controls.forEach((masterCtrl) => {
            const optionToAdd: any = {};
            optionToAdd.id = masterCtrl.id;
            optionToAdd.deleted = masterCtrl.deleted ? true : false;
            formControls.forEach((ctrl) => {
              if (ctrl.hasOwnProperty('dataProviderCollectionName')) {
                if (masterCtrl[ctrl.dataProviderCollectionName].length > 0) {
                  optionToAdd[ctrl.name] = _.clone(
                    masterCtrl[ctrl.dataProviderCollectionName][0][ctrl.displayBy]
                  );
                }
                else {
                  optionToAdd[ctrl.name] = '';
                }
              }
              else {
                optionToAdd[ctrl.name] = masterCtrl[ctrl.name];
              }
            });
            optionsToReturn.push(optionToAdd);
          });
          return optionsToReturn;
        })
      );
  }
  else {
    return of([]);
  }

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
