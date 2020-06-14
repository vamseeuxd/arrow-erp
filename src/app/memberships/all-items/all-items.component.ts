import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {AngularFirestoreCollection} from '@angular/fire/firestore';
import {MatDialog} from '@angular/material/dialog';
import {AddItemsComponent} from '../add-item/add-items.component';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {BusyIndicatorService} from '../../layout/busy-indicator.service';
import {ItemsService} from '../items.service';

@Component({
  selector: 'app-all-memberships',
  templateUrl: './all-items.component.html',
  styleUrls: ['./all-items.component.sass'],
})
export class AllItemsComponent implements AfterViewInit {

  dataColumns = this.membershipsService.dataColumns;
  actionColumns = this.membershipsService.actionColumns;
  displayedColumns = this.membershipsService.displayedColumns;
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatSort) sort: MatSort;
  membershipsCollection: AngularFirestoreCollection<any>;

  constructor(
    private busyIndicator: BusyIndicatorService,
    public dialog: MatDialog,
    public membershipsService:ItemsService,
  ) {
  }

  ngAfterViewInit() {
    this.membershipsCollection = this.membershipsService.membershipsCollections;
    this.membershipsCollection.valueChanges().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  editMembership(data): void {
    const dialogRef = this.dialog.open(AddItemsComponent, {
      data
    });
  }

  addMembership() {
    const dialogRef = this.dialog.open(AddItemsComponent, {disableClose: true});
  }

  trackByUid(index, item) {
    return item.id;
  }

  async deleteMembership(membership) {
    const isConfirmed = confirm('Are you sure!Do you want to Delete?');
    if (isConfirmed) {
      const busyIndicatorId = this.busyIndicator.show();
      try {
        await this.membershipsService.deleteDynamicForm(membership.id);
        this.busyIndicator.hide(busyIndicatorId);
      } catch (e) {
        this.busyIndicator.hide(busyIndicatorId);
      }
    }
  }
}
