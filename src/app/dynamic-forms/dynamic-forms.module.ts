import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ManageDynamicFormsComponent } from "./manage-dynamic-forms/manage-dynamic-forms.component";
import { DynamicFormsRoutingModule } from "./dynamic-forms-routing.module";
import { DynamicFormsListComponent } from "./dynamic-forms-list/dynamic-forms-list.component";
import { MatCardModule } from "@angular/material/card";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatDialogModule } from "@angular/material/dialog";
import { SharedModule } from "../shared/shared.module";
import { MatButtonModule } from "@angular/material/button";
import { ArrowFirebaseModule } from "../shared/arrow-firebase.module";
import { MatTabsModule } from "@angular/material/tabs";
import { DynamicFormControlsListComponent } from "./dynamic-form-controls-list/dynamic-form-controls-list.component";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { MatInputModule } from "@angular/material/input";
import { MatTableModule } from "@angular/material/table";

@NgModule({
  imports: [
    CommonModule,
    DynamicFormsRoutingModule,
    MatCardModule,
    MatExpansionModule,
    MatDialogModule,
    MatButtonModule,
    MatTabsModule,
    SharedModule,
    ArrowFirebaseModule,
    DragDropModule,
    MatInputModule,
    MatTableModule,
  ],
  declarations: [
    ManageDynamicFormsComponent,
    DynamicFormsListComponent,
    DynamicFormControlsListComponent,
  ],
  entryComponents: [
    ManageDynamicFormsComponent,
    DynamicFormsListComponent,
    DynamicFormControlsListComponent,
  ],
})
export class DymamicFormsModule {}
