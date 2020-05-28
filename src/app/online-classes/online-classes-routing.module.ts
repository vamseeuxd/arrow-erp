import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { StartOnlineClassesComponent } from "./start-online-classes/start-online-classes.component";
import { ManageOnlineClassesComponent } from "./manage-online-classes/manage-online-classes.component";

const routes: Routes = [
  {
    path: "",
    redirectTo: "manage-online-classes",
    pathMatch: "full",
  },
  {
    path: "start-online-classes",
    component: StartOnlineClassesComponent,
    data: {
      title: "",
      breadcrumbs: [
        { label: "online-classes", url: "" },
        { label: "start-online-class", url: "" },
      ],
    },
  },
  {
    path: "manage-online-classes",
    component: ManageOnlineClassesComponent,
    data: {
      title: "",
      breadcrumbs: [
        { label: "online-classes", url: "" },
        { label: "manage-online-classes", url: "" },
      ],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OnlineClassesRoutingModule {}
