import {
  Component,
  OnInit,
  HostBinding,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss'],
})
export class DynamicFormComponent {
  @Input() formClass = 'm-4';
  @Input() formControls = [
    {
      columnClass: 'col-xl-6 col-lg-6 col-md-12 col-sm-12 mb-2',
      controllerClass: 'w-100',
      disabled:false,
      label: 'Email',
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      columnClass: 'col-xl-6 col-lg-6 col-md-12 col-sm-12 mb-2',
      controllerClass: 'w-100',
      required: true,
      label: 'color',
      name: 'color',
      type: 'color',
    },
    {
      columnClass: 'col-xl-6 col-lg-6 col-md-12 col-sm-12 mb-2',
      min: '2020-06-01',
      max: '2020-06-30',
      controllerClass: 'w-100',
      required: true,
      label: 'date',
      name: 'date',
      type: 'date',
    },
    {
      columnClass: 'col-xl-6 col-lg-6 col-md-12 col-sm-12 mb-2',
      controllerClass: 'w-100',
      required: true,
      label: 'datetime-local',
      name: 'datetime-local',
      type: 'datetime-local',
    },
    {
      columnClass: 'col-xl-6 col-lg-6 col-md-12 col-sm-12 mb-2',
      controllerClass: 'w-100',
      required: true,
      label: 'month',
      name: 'month',
      type: 'month',
    },
    {
      columnClass: 'col-xl-6 col-lg-6 col-md-12 col-sm-12 mb-2',
      min: 10,
      max: 100,
      controllerClass: 'w-100',
      required: true,
      label: 'number',
      name: 'number',
      type: 'number',
    },
    {
      columnClass: 'col-xl-6 col-lg-6 col-md-12 col-sm-12 mb-2',
      controllerClass: 'w-100',
      required: true,
      label: 'password',
      name: 'password',
      type: 'password',
    },
    {
      columnClass: 'col-xl-6 col-lg-6 col-md-12 col-sm-12 mb-2',
      controllerClass: 'w-100',
      required: true,
      label: 'search',
      name: 'search',
      type: 'search',
    },
    {
      columnClass: 'col-xl-6 col-lg-6 col-md-12 col-sm-12 mb-2',
      minlength: 10,
      maxlength: 10,
      pattern: '^(0|[1-9][0-9]*)$',
      controllerClass: 'w-100',
      required: true,
      label: 'Mobile Phone Number',
      name: 'tel',
      type: 'tel',
    },
    {
      columnClass: 'col-xl-6 col-lg-6 col-md-12 col-sm-12 mb-2',
      controllerClass: 'w-100',
      required: true,
      label: 'text',
      name: 'text',
      type: 'text',
    },
    {
      columnClass: 'col-xl-6 col-lg-6 col-md-12 col-sm-12 mb-2',
      controllerClass: 'w-100',
      required: true,
      label: 'time',
      name: 'time',
      type: 'time',
    },
    {
      columnClass: 'col-xl-6 col-lg-6 col-md-12 col-sm-12 mb-2',
      controllerClass: 'w-100',
      required: true,
      label: 'url',
      name: 'url',
      type: 'url',
    },
    {
      columnClass: 'col-xl-6 col-lg-6 col-md-12 col-sm-12 mb-2',
      controllerClass: 'w-100',
      required: true,
      label: 'week',
      name: 'week',
      type: 'week',
    },
    {
      columnClass: 'col-xl-6 col-lg-6 col-md-12 col-sm-12 mb-2',
      controllerClass: 'w-100',
      required: true,
      label: 'select',
      name: 'select',
      type: 'select',
      multiple: true,
      dataProvider: {
        idField: 'id',
        labelField: 'name',
        data: [
          {id: '1', name: 'Option 1'},
          {id: '2', name: 'Option 2'},
          {id: '3', name: 'Option 3'},
          {id: '4', name: 'Option 4'},
          {id: '5', name: 'Option 5'},
        ]
      }
    },
    {
      columnClass: 'col-xl-6 col-lg-6 col-md-12 col-sm-12 mb-2',
      controllerClass: 'w-100',
      required: true,
      label: 'radio',
      name: 'radio',
      type: 'radio',
      multiple: true,
      dataProvider: {
        idField: 'id',
        labelField: 'name',
        data: [
          {id: '1', name: 'Option 1'},
          {id: '2', name: 'Option 2'},
          {id: '3', name: 'Option 3'},
          {id: '4', name: 'Option 4'},
          {id: '5', name: 'Option 5'},
        ]
      }
    },
  ];
  @Output() submit: EventEmitter<any> = new EventEmitter();
}
