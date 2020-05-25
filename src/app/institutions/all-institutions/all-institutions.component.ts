import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { InstitutionsInterface } from "./institutions.model";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Observable, Subscription } from "rxjs";
import { FormDialogComponent } from "./dialogs/form-dialog/form-dialog.component";
import { DeleteDialogComponent } from "./dialogs/delete/delete.component";
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from "@angular/fire/firestore";
import { MatTableDataSource } from "@angular/material/table";
import { BusyIndicatorService } from "../../layout/busy-indicator.service";

@Component({
  selector: "app-all-professors",
  templateUrl: "./all-institutions.component.html",
  styleUrls: ["./all-institutions.component.sass"],
})
export class AllInstitutionsComponent implements AfterViewInit, OnDestroy {
  displayedColumns = [
    "institutionName",
    "contactPerson",
    "contactPhone",
    "contactEmail",
    "memberShip",
    "status",
    "createdOn",
    "actions",
  ];
  institutionsCollection: AngularFirestoreCollection<InstitutionsInterface>;
  institutionsList: Observable<InstitutionsInterface[]>;
  dataSource: MatTableDataSource<InstitutionsInterface>;
  institutionsListSubscription: Subscription;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild("filter", { static: true }) filter: ElementRef;

  constructor(
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private afs: AngularFirestore,
    private busyIndicator: BusyIndicatorService
  ) {
    this.institutionsCollection = afs.collection<InstitutionsInterface>(
      "institutionsList"
    );
    this.institutionsList = this.institutionsCollection.valueChanges();
  }

  ngAfterViewInit() {
    this.institutionsListSubscription = this.institutionsList.subscribe(
      (data) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      }
    );
  }

  ngOnDestroy() {
    if (this.institutionsListSubscription) {
      this.institutionsListSubscription.unsubscribe();
    }
  }

  addNew() {
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: { institution: null, action: "add" },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.data) {
        this.showNotification(
          "snackbar-success",
          "Add Record Successfully...!!!",
          "bottom",
          "center"
        );
      }
    });
  }

  editCall(row) {
    const dialogRef = this.dialog.open(FormDialogComponent, {
      data: { institution: row, action: "edit" },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.data) {
        this.showNotification(
          "black",
          "Edit Record Successfully...!!!",
          "bottom",
          "center"
        );
      }
    });
  }

  deleteItem(row) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, { data: row });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        this.showNotification(
          "snackbar-danger",
          "Delete Record Successfully...!!!",
          "bottom",
          "center"
        );
      }
    });
  }

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, "", {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }
}
