import {OnlineClassMediaDetails} from './online-class-media-details.interface';

export interface OnlineClassInterface {
  id?: string;
  classTitle: string;
  teacher: string;
  students: string[];
  classDate: any;
  classTime: any;
  createdOn: any;
  updatedOn: any;
  mediaGallery: OnlineClassMediaDetails[];
}
