import {OnlineClassMediaDetails} from './online-class-media-details.interface';

export interface OnlineClassInterface {
  onlineClassId?: string;
  classTitle: string;
  teacher: string;
  students: string[];
  dateAndTime: string;
  createdOn: any;
  updatedOn: any;
  mediaGallery: OnlineClassMediaDetails[];
}
