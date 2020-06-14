import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ManageDynamicFormsComponent } from "./manage-dynamic-forms/manage-dynamic-forms.component";

const routes: Routes = [
  {
    path: "",
    component: ManageDynamicFormsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DynamicFormsRoutingModule {}
