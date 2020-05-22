import {Component, forwardRef, Input} from '@angular/core';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {MatDialog} from '@angular/material/dialog';
import {OnlineClassesAddMediaComponent} from '../online-classes-add-media/online-classes-add-media.component';
import {ONLINE_CLASS_ACTION} from '../interfaces/online-class-action.enum';
import {OnlineClassMediaDetails} from '../interfaces/online-class-media-details.interface';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'app-online-classes-media-gallery',
  templateUrl: './online-classes-media-gallery.component.html',
  styleUrls: ['./online-classes-media-gallery.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => OnlineClassesMediaGalleryComponent),
    multi: true,
  }]
})
export class OnlineClassesMediaGalleryComponent implements ControlValueAccessor {

  readonly OnlineClassAction = ONLINE_CLASS_ACTION;

  @Input() onlineClassMediaDetailsList: OnlineClassMediaDetails[] = [];

  onChange: (value) => {};

  onTouched: () => {};

  constructor(public dialog: MatDialog) {
  }

  openDialog(action: ONLINE_CLASS_ACTION) {
    const dialogRef = this.dialog.open(OnlineClassesAddMediaComponent, {data: {action}});

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.onlineClassMediaDetailsList.push({...result, id: new Date().getTime().toString()});
        this.updatePosition();
      }
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.onlineClassMediaDetailsList, event.previousIndex, event.currentIndex);
    this.updatePosition();
  }

  deleteMediaDetails(mediaDetails: OnlineClassMediaDetails) {
    const isConfirmed = confirm('Are you sure! Do you want to delete?');
    if (isConfirmed) {
      this.onlineClassMediaDetailsList = this.onlineClassMediaDetailsList.filter(value => (value.id !== mediaDetails.id));
      this.updatePosition();
    }
  }

  updatePosition() {
    this.onlineClassMediaDetailsList.forEach(
      (value, position) => {
        value.position = position;
      });
    this.onChange(this.onlineClassMediaDetailsList);
  }

  editMediaDetails(mediaDetails: OnlineClassMediaDetails, action: ONLINE_CLASS_ACTION) {
    const dialogRef = this.dialog.open(OnlineClassesAddMediaComponent, {data: {action, mediaDetails}});
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.onlineClassMediaDetailsList = this.onlineClassMediaDetailsList.map(value => {
          if (value.id === mediaDetails.id) {
            return result;
          }
          return value;
        });
        this.onChange(this.onlineClassMediaDetailsList);
      }
    });
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  writeValue(obj: OnlineClassMediaDetails[]): void {
    if (Array.isArray(obj)) {
      this.onlineClassMediaDetailsList = obj;
    }
    else {
      obj = [];
      this.onlineClassMediaDetailsList = obj;
    }
  }
}
