import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AddDynamicFormComponent } from "./add-dynamic-form/add-dynamic-form.component";
import { MatDialogModule } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { MatTabsModule } from "@angular/material/tabs";
import { SharedModule } from "../shared/shared.module";
import { MatSelectModule } from "@angular/material/select";
import { MatChipsModule } from "@angular/material/chips";
import { EditFormControllerComponent } from "./edit-form-controller/edit-form-controller.component";
import { AvailableFormControlsComponent } from "./available-form-controls/available-form-controls.component";
import { MatBottomSheetModule } from "@angular/material/bottom-sheet";

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    DragDropModule,
    MatTabsModule,
    SharedModule,
    MatSelectModule,
    MatChipsModule,
    MatBottomSheetModule,
  ],
  declarations: [
    AddDynamicFormComponent,
    EditFormControllerComponent,
    AvailableFormControlsComponent,
  ],
  entryComponents: [
    AddDynamicFormComponent,
    EditFormControllerComponent,
    AvailableFormControlsComponent,
  ],
})
export class LayoutModule {}
