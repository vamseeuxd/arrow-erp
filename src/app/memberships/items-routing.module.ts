import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AllItemsComponent } from "./all-items/all-items.component";

const routes: Routes = [
  {
    path: "all",
    component: AllItemsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ItemsRoutingModule {}
