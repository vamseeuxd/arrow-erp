import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormControl, NgForm} from '@angular/forms';
import {OnlineClassMediaDetails} from '../interfaces/online-class-media-details.interface';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {BehaviorSubject, Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {OnlineClassesService} from '../online-classes.service';
import {BusyIndicatorService} from '../../layout/busy-indicator.service';
import {OnlineClassInterface} from '../interfaces/online-class.interface';
import {MatCalendarCellCssClasses} from '@angular/material/datepicker';

@Component({
  selector: 'app-manage-online-classes',
  templateUrl: './manage-online-classes.component.html',
  styleUrls: ['./manage-online-classes.component.scss']
})
export class ManageOnlineClassesComponent {
  onlineClass: OnlineClassInterface;
  minDate: Date;
  maxDate: Date;

  dateClass = (d: Date): MatCalendarCellCssClasses => {
    const date = d.getDate();
    return (date === 1 || date === 20) ? 'bg-warning rounded-circle disabled' : '';
  }

  constructor(
    public onlineClassesService: OnlineClassesService,
    private busyIndicator: BusyIndicatorService,
  ) {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const currentDate = new Date().getDate();
    this.minDate = new Date();
    this.maxDate = new Date(currentYear, currentMonth + 3, currentDate);
  }

  async saveOnlineClass(arrowForm: NgForm) {
    if (this.onlineClass) {
      const busyIndicatorId = this.busyIndicator.show();
      await this.onlineClassesService.updateOnlineClasss(arrowForm.value, this.onlineClass.onlineClassId, this.onlineClass.createdOn);
      arrowForm.resetForm();
      this.busyIndicator.hide(busyIndicatorId);
    }
    else {
      const busyIndicatorId = this.busyIndicator.show();
      await this.onlineClassesService.addOnlineClasss(arrowForm.value);
      arrowForm.resetForm();
      this.busyIndicator.hide(busyIndicatorId);
    }
  }
}
