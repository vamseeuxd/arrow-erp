import {
  Component,
  OnInit,
  HostBinding,
  Input,
  Output,
  EventEmitter,
  ViewChild,
} from "@angular/core";
import { NgForm } from "@angular/forms";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { startWith } from "rxjs/operators";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { MatChipInputEvent } from "@angular/material/chips";

@Component({
  selector: "app-dynamic-form",
  templateUrl: "./dynamic-form.component.html",
  styleUrls: ["./dynamic-form.component.scss"],
})
export class DynamicFormComponent {
  @ViewChild("myForm") myForm: NgForm;
  @Input() formClass = "m-4";
  @Input() formControls = [];
  @Output() submit: EventEmitter<any> = new EventEmitter();
  @Output() change: EventEmitter<any> = new EventEmitter();

  defaultColumnClass = "col-md-4 mb-2";
  defaultControllerClass = "w-100";

  get form(): NgForm {
    return this.myForm;
  }

  get valid(): boolean {
    return this.myForm ? this.myForm.valid : false;
  }

  get value(): boolean {
    return this.myForm ? this.myForm.value : {};
  }

  /*  --------------------------------------------------------------  */
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruits: string[] = ["Lemon"];

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || "").trim()) {
      this.fruits.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = "";
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
