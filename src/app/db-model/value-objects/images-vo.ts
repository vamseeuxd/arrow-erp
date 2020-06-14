export interface ImagesVo {
  id?: string;
  path: string;
  personId: string;
  active: boolean;
  createdOn?: { nanoseconds: number; seconds: number };
  createdBy?: string;
  updatedBy?: string;
  lastUpdateOn?: { nanoseconds: number; seconds: number };
}
