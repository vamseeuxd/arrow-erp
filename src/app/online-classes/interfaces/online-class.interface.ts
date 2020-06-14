import { OnlineClassMediaDetails } from "./online-class-media-details.interface";
import { ChatMemberInterface } from "./chat-member.interface";

export interface OnlineClassInterface {
  id?: string;
  classTitle: string;
  teacher: string;
  isStarted: boolean;
  startTime: any;
  joinTime: any;
  endTime: any;
  chatMembers?: ChatMemberInterface[];
  students: string[];
  classDate: any;
  classTime: any;
  createdOn: any;
  updatedOn: any;
  mediaGallery: OnlineClassMediaDetails[];
}
