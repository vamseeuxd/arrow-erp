import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OnlineClassesComponent } from './online-classes/online-classes.component';
const routes: Routes = [
  {
    path: '',
    redirectTo: 'online-classes',
    pathMatch: 'full'
  },
  {
    path: 'online-classes',
    component: OnlineClassesComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OnlineClassesRoutingModule {}
