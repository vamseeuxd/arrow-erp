import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { OnlineClassesRoutingModule } from "./online-classes-routing.module";
import { StartOnlineClassesComponent } from "./start-online-classes/start-online-classes.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { OnlineClassChatComponent } from "./start-online-classes/online-class-chat/online-class-chat.component";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { MatButtonModule } from "@angular/material/button";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatIconModule } from "@angular/material/icon";
import { MatSelectModule } from "@angular/material/select";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatInputModule } from "@angular/material/input";
import { MatTabsModule } from "@angular/material/tabs";
import { ClickOutsideModule } from "ng-click-outside";
import { OnlineClassVideoCallComponent } from "./start-online-classes/online-class-video-call/online-class-video-call.component";
import { ManageOnlineClassesComponent } from "./manage-online-classes/manage-online-classes.component";
import { DropzoneModule } from "ngx-dropzone-wrapper";
import { NgxMaskModule } from "ngx-mask";
import { OnlineClassesMediaGalleryComponent } from "./manage-online-classes/online-classes-media-gallery/online-classes-media-gallery.component";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { MatCardModule } from "@angular/material/card";
import { OnlineClassesAddMediaComponent } from "./manage-online-classes/online-classes-add-media/online-classes-add-media.component";
import { MatDialogModule } from "@angular/material/dialog";
import { YouTubePlayerModule } from "@angular/youtube-player";
import { MatChipsModule } from "@angular/material/chips";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { OnlineClassesService } from "./online-classes.service";
import { ArrowFirebaseModule } from "../arrow-firebase.module";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatTimepickerModule } from "mat-timepicker";
import { CanvasWhiteboardModule } from "ng2-canvas-whiteboard";
import { OnlineClassWhiteBoardComponent } from "./start-online-classes/online-class-white-board/online-class-white-board.component";
import {
  MatProgressBar,
  MatProgressBarModule,
} from "@angular/material/progress-bar";
import { ResizableModule } from "angular-resizable-element";
import { MatSliderModule } from "@angular/material/slider";
import { MatTooltipModule } from "@angular/material/tooltip";
import { JoinOnlineClassComponent } from "./join-online-class/join-online-class.component";

export const MY_FORMATS = {
  parse: {
    dateInput: "LL",
  },
  display: {
    dateInput: "YYYY-MM-DD",
    monthYearLabel: "YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "YYYY",
  },
};

@NgModule({
  declarations: [
    OnlineClassChatComponent,
    StartOnlineClassesComponent,
    OnlineClassVideoCallComponent,
    ManageOnlineClassesComponent,
    OnlineClassesMediaGalleryComponent,
    OnlineClassesAddMediaComponent,
    OnlineClassWhiteBoardComponent,
    JoinOnlineClassComponent,
  ],
  imports: [
    CommonModule,
    PerfectScrollbarModule,
    ReactiveFormsModule,
    FormsModule,
    OnlineClassesRoutingModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatSelectModule,
    MatCheckboxModule,
    MatInputModule,
    MatTabsModule,
    ClickOutsideModule,
    DropzoneModule,
    NgxMaskModule,
    DragDropModule,
    MatCardModule,
    MatDialogModule,
    YouTubePlayerModule,
    MatChipsModule,
    MatAutocompleteModule,
    ArrowFirebaseModule,
    MatDatepickerModule,
    MatTimepickerModule,
    CanvasWhiteboardModule,
    MatProgressBarModule,
    MatSliderModule,
    MatTooltipModule,
    ResizableModule,
  ],
  entryComponents: [OnlineClassesAddMediaComponent],
  providers: [OnlineClassesService],
})
export class OnlineClassesModule {}
