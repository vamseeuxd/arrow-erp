import {combineLatest, pipe, of, defer, iif} from 'rxjs';
import {map, mergeMap, switchMap, tap} from 'rxjs/operators';
import {AngularFirestore} from '@angular/fire/firestore';

export const leftJoin = (
  afs: AngularFirestore,
  leftField,
  rightField,
  collection,
  limit = 100
) => {
  return (source) =>
    defer(() => {
      let collectionData;
      let totalJoins = 0;
      const ifCase = of([]);
      const elseCase = source.pipe(
        switchMap((data) => {
          // Clear mapping on each emitted val ;

          // Save the parent data state
          collectionData = data as any[];

          const reads$ = [];
          for (const doc of collectionData) {
            // Push doc read to Array

            if (doc[rightField]) {
              // Perform query on join key, with optional limit
              const q = (ref) =>
                ref.where(leftField, '==', doc[rightField]).limit(limit);
              reads$.push(afs.collection(collection, q).valueChanges());
            }
            else {
              reads$.push(of([]));
            }
          }

          return combineLatest(reads$);
        }),
        map((joins) => {
          return collectionData.map((v, i) => {
            totalJoins += joins[i].length;
            return {...v, [collection]: joins[i] || null};
          });
        }),
        tap((final) => {
          totalJoins = 0;
        })
      );
      return source.pipe(
        mergeMap((value: any[]) => iif(() => value.length === 0, ifCase, elseCase))
      );
    });
};

export const leftJoinDocument = (afs: AngularFirestore, field, collection) => {
  return (source) =>
    defer(() => {
      // Operator state
      let collectionData;
      const cache = new Map();

      return source.pipe(
        switchMap((data) => {
          // Clear mapping on each emitted val ;
          cache.clear();

          // Save the parent data state
          collectionData = data as any[];

          const reads$ = [];
          let i = 0;
          for (const doc of collectionData) {
            // Skip if doc field does not exist or is already in cache
            if (!doc[field] || cache.get(doc[field])) {
              continue;
            }

            // Push doc read to Array
            reads$.push(
              afs.collection(collection).doc(doc[field]).valueChanges()
            );
            cache.set(doc[field], i);
            i++;
          }

          return reads$.length ? combineLatest(reads$) : of([]);
        }),
        map((joins) => {
          return collectionData.map((v, i) => {
            const joinIdx = cache.get(v[field]);
            return {...v, [field]: joins[joinIdx] || null};
          });
        }),
        tap((final) =>
          console.log(
            `Queried ${(final as any).length}, Joined ${cache.size} docs`
          )
        )
      );
    });
};
