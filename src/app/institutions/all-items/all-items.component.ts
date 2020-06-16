import { AfterViewInit, Component, ViewChild } from "@angular/core";
import { AngularFirestoreCollection } from "@angular/fire/firestore";
import { MatDialog } from "@angular/material/dialog";
import { AddItemsComponent } from "../add-item/add-items.component";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { BusyIndicatorService } from "../../layout/busy-indicator.service";
import { ItemsService } from "../items.service";
import { FORM_CONTROLLER_TYPE } from "../../shared/components/dynamic-form/dynamic-form-controller.interface";

@Component({
  selector: "app-all-memberships",
  templateUrl: "./all-items.component.html",
  styleUrls: ["./all-items.component.sass"],
})
export class AllItemsComponent implements AfterViewInit {
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatSort) sort: MatSort;
  itemsCollection: AngularFirestoreCollection<any>;
  readonly formControlType = FORM_CONTROLLER_TYPE;

  constructor(
    private busyIndicator: BusyIndicatorService,
    public dialog: MatDialog,
    public itemsService: ItemsService
  ) {
    this.dataSource = new MatTableDataSource();
  }

  ngAfterViewInit() {
    this.itemsCollection = this.itemsService.itemsCollection;
    this.itemsCollection.valueChanges().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  editItem(data): void {
    const dialogRef = this.dialog.open(AddItemsComponent, {
      data,
      width: "640px",
    });
  }

  getDisplayLabel(option: any, key: string) {
    const filteredData = option.data.dataProvider.find(
      (d) => d[option.data.identifyBy] === key
    );
    return filteredData ? filteredData[option.data.displayBy] : "";
  }

  addItem() {
    const dialogRef = this.dialog.open(AddItemsComponent, {
      disableClose: true,
      width: "640px",
    });
  }

  trackByUid(index, item) {
    return item.id;
  }

  async deleteItem(membership) {
    const isConfirmed = confirm("Are you sure!Do you want to Delete?");
    if (isConfirmed) {
      const busyIndicatorId = this.busyIndicator.show();
      try {
        await this.itemsService.deleteItem(membership.id);
        this.busyIndicator.hide(busyIndicatorId);
      } catch (e) {
        this.busyIndicator.hide(busyIndicatorId);
      }
    }
  }
}
