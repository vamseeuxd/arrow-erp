import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OnlineClassesComponent } from './online-classes/online-classes.component';
import {ManageOnlineClassesComponent} from './manage-online-classes/manage-online-classes.component';
const routes: Routes = [
  {
    path: '',
    redirectTo: 'manage-online-classes',
    pathMatch: 'full'
  },
  {
    path: 'start-online-classes',
    component: OnlineClassesComponent
  },
  {
    path: 'manage-online-classes',
    component: ManageOnlineClassesComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OnlineClassesRoutingModule {}
