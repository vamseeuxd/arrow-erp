import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatDialogModule } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { MatTabsModule } from "@angular/material/tabs";
import { SharedModule } from "../shared/shared.module";
import { MatSelectModule } from "@angular/material/select";
import { MatChipsModule } from "@angular/material/chips";
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
  declarations: [],
  entryComponents: [],
})
export class LayoutModule {}
