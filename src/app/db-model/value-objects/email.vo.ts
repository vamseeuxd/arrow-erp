export interface EmailVo {
  id?: string;
  name: string;
  personId: string;
  active: boolean;
  createdOn?: { nanoseconds: number; seconds: number };
  createdBy?: string;
  updatedBy?: string;
  lastUpdateOn?: { nanoseconds: number; seconds: number };
}
