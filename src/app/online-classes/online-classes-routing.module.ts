import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { StartOnlineClassesComponent } from "./start-online-classes/start-online-classes.component";
import { ManageOnlineClassesComponent } from "./manage-online-classes/manage-online-classes.component";
import { JoinOnlineClassComponent } from "./join-online-class/join-online-class.component";

const routes: Routes = [
  {
    path: "",
    redirectTo: "manage-online-classes",
    pathMatch: "full",
  },
  {
    path: "start-online-classes",
    component: StartOnlineClassesComponent,
  },
  {
    path: "join-online-classes",
    component: JoinOnlineClassComponent,
  },
  {
    path: "manage-online-classes",
    component: ManageOnlineClassesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OnlineClassesRoutingModule {}
