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
}
