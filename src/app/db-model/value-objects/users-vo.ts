export interface UsersVo {
  id?: string;
  addressId: string;
  bloodGroupId: string;
  dateOfBirth: { nanoseconds: number; seconds: number };
  emailId: string;
  firstName: string;
  genderId: string;
  imageId: string;
  lastName: string;
  phoneNumberId: string;
  createdOn?: { nanoseconds: number; seconds: number };
  createdBy?: string;
  updatedBy?: string;
  lastUpdateOn?: { nanoseconds: number; seconds: number };
}
