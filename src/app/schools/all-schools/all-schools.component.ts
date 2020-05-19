import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {SchoolsInterface} from './schools.model';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Observable, Subscription} from 'rxjs';
import {FormDialogComponent} from './dialogs/form-dialog/form-dialog.component';
import {DeleteDialogComponent} from './dialogs/delete/delete.component';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-all-professors',
  templateUrl: './all-schools.component.html',
  styleUrls: ['./all-schools.component.sass'],
})
export class AllSchoolsComponent implements AfterViewInit, OnDestroy {
  displayedColumns = [
    'institutionName',
    'contactPerson',
    'contactPhone',
    'contactEmail',
    'memberShip',
    'status',
    'createdOn',
    'actions',
  ];
  schoolsCollection: AngularFirestoreCollection<SchoolsInterface>;
  schoolsList: Observable<SchoolsInterface[]>;
  dataSource: MatTableDataSource<SchoolsInterface>;
  schoolsListSubscription: Subscription;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild('filter', {static: true}) filter: ElementRef;

  constructor(
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private afs: AngularFirestore
  ) {
    this.schoolsCollection = afs.collection<SchoolsInterface>('schoolsList');
    this.schoolsList = this.schoolsCollection.valueChanges();
  }

  ngAfterViewInit() {
    this.schoolsListSubscription = this.schoolsList.subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });

  }

  ngOnDestroy() {
    if (this.schoolsListSubscription) {
      this.schoolsListSubscription.unsubscribe();
    }
  }

  addNew() {
    const dialogRef = this.dialog.open(FormDialogComponent, {data: {school: null, action: 'add',},});
    dialogRef.afterClosed().subscribe((result) => {
      if (result.data) {
        this.showNotification('snackbar-success', 'Add Record Successfully...!!!', 'bottom', 'center');
      }
    });
  }

  editCall(row) {
    const dialogRef = this.dialog.open(FormDialogComponent, {data: {school: row, action: 'edit',},});
    dialogRef.afterClosed().subscribe((result) => {
      if (result.data) {
        debugger;
        this.showNotification(
          'black',
          'Edit Record Successfully...!!!',
          'bottom',
          'center'
        );
      }
    });
  }

  deleteItem(row) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {data: row,});
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 1) {
        this.showNotification(
          'snackbar-danger',
          'Delete Record Successfully...!!!',
          'bottom',
          'center'
        );
      }
    });
  }

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackBar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }

}
