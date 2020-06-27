import {
  Component,
  OnInit,
  HostBinding,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  AfterViewInit, OnDestroy,
} from '@angular/core';
import {NgForm} from '@angular/forms';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {startWith} from 'rxjs/operators';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';
import {combineLatest, Observable, Subscription} from "rxjs";

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss'],
})
export class DynamicFormComponent implements AfterViewInit, OnDestroy {

  get form(): NgForm {
    return this.myForm;
  }

  get valid(): boolean {
    return this.myForm ? this.myForm.valid : false;
  }

  get value(): boolean {
    return this.myForm ? this.myForm.value : {};
  }

  @ViewChild('myForm') myForm: NgForm;
  @Input() formClass = 'm-4';
  @Input() formControls = [];
  @Input() duplicateErrors: string[] = [];
  @Output() duplicateErrorsChange: EventEmitter<string[]> = new EventEmitter();
  @Output() change: EventEmitter<any> = new EventEmitter();
  @Output() submit: EventEmitter<any> = new EventEmitter();
  @Output() init: EventEmitter<NgForm> = new EventEmitter();
  duplicateSubscription: Subscription;

  defaultColumnClass = 'col-md-4 mb-2';
  defaultControllerClass = 'w-100';

  /*  --------------------------------------------------------------  */
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruits: string[] = ['Lemon'];

  ngAfterViewInit() {
    this.init.emit(this.form);
    const allDuplicateMessageObservables = this.formControls.filter(d => d.hasOwnProperty('duplicateMessage$')).map(d => d.duplicateMessage$);
    console.clear();
    debugger;
    if (this.duplicateSubscription) {
      this.duplicateSubscription.unsubscribe();
    }
    this.duplicateSubscription = combineLatest(allDuplicateMessageObservables).subscribe((messages: string[]) => {
      this.duplicateErrors = messages.filter(d => (d && d.trim().length > 0));
      this.duplicateErrorsChange.emit(this.duplicateErrors);
    })
  }

  ngOnDestroy() {
    if (this.duplicateSubscription) {
      this.duplicateSubscription.unsubscribe();
      this.duplicateSubscription = null;
    }
  }

  getFormControls() {
    if (this.formControls && this.formControls.length > 0) {
      return this.formControls.filter((d) => !d.hide);
    } else {
      return [];
    }
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.fruits.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(fruit: string): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.fruits.push(event.option.viewValue);
  }

  /*  --------------------------------------------------------------  */
}
