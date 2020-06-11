export interface DynamicFormControllerInterface {
  type: string;
  hide: boolean;
  controllerClass: string;
  label: string;
  value: string;
  name: string;
  disabled: boolean;
  required: boolean;
  minlength: number;
  maxlength: number;
  min: number;
  max: number;
  pattern: string;
  placeholder: string;
  requiredError: string;
  emailError: string;
  minError: string;
  maxError: string;
  minlengthError: string;
  maxlengthError: string;
  patternError: string;
  multiple: boolean;
  dataProvider: {
    identifyBy: string;
    displayBy: string;
    data: any[];
  };
}

export function getDynamicFormController(
  name: string,
  type: FORM_CONTROLLER_TYPE,
  data: any[]
) {
  return {
    columnClass: "col-md-4 mb-3",
    disabled: false,
    controllerClass: "w-100",
    required: true,
    placeholder:
      "Enter " +
      name.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()),
    label: name
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase()),
    name,
    type,
  };
}

export enum FORM_CONTROLLER_TYPE {
  EMAIL = "email",
  COLOR = "color",
  DATE = "date",
  DATETIME = "datetime",
  MONTH = "month",
  NUMBER = "number",
  PASSWORD = "password",
  SEARCH = "search",
  TEL = "tel",
  TEXT = "text",
  TIME = "time",
  URL = "url",
  WEEK = "week",
  SELECT = "select",
  RADIO = "radio",
  CHIPS = "chips",
}
