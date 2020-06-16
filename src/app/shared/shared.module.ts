import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DynamicFormComponent } from "./components/dynamic-form/dynamic-form.component";
import { MinDirective } from "./directive/min.directive";
import { MaxDirective } from "./directive/max.directive";
import { FormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatRadioModule } from "@angular/material/radio";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatCardModule } from "@angular/material/card";
import { TagInputModule } from "ngx-chips";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatIconModule } from "@angular/material/icon";

@NgModule({
  declarations: [DynamicFormComponent, MinDirective, MaxDirective],
  exports: [
    DynamicFormComponent,
    MinDirective,
    MaxDirective,
    CommonModule,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatCheckboxModule,
    MatCardModule,
    TagInputModule,
    MatSidenavModule,
    MatIconModule,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatCheckboxModule,
    MatCardModule,
    TagInputModule,
    MatSidenavModule,
    MatIconModule,
  ],
  entryComponents: [DynamicFormComponent],
})
export class SharedModule {}