interface PhoneNumbersVo {
  id?: string;
  name: string;
  personId: string;
  active: boolean;
  createdOn?: { nanoseconds: number; seconds: number };
  createdBy?: string;
  updatedBy?: string;
  lastUpdateOn?: { nanoseconds: number; seconds: number };
}
