import { AngularFirestore } from "@angular/fire/firestore";
import { AbstractControl } from "@angular/forms";
import { debounceTime, map, take } from "rxjs/operators";

export class InstitutionsValidators {
  static InstitutionId(afs: AngularFirestore, ignoreId: string) {
    return (control: AbstractControl) => {
      const institutionId = control.value ? control.value.toLowerCase() : "";
      return afs
        .collection("institutionsList", (ref) =>
          ref.where("institutionId", "==", institutionId)
        )
        .valueChanges()
        .pipe(
          debounceTime(500),
          take(1),
          map((arr) =>
            arr.filter((d: any) => d.id !== ignoreId).length
              ? { notAvailable: true }
              : null
          )
        );
    };
  }
}
