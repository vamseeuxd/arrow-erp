export interface AddressVo {
  id?: string;
  cityId: string;
  countryId: string;
  line1: string;
  line2: string;
  line3: string;
  stateId: string;
  zipCodeId: string;
  createdOn?: { nanoseconds: number; seconds: number };
  createdBy?: string;
  updatedBy?: string;
  lastUpdateOn?: { nanoseconds: number; seconds: number };
}
