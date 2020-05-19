import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AllSchoolsComponent } from './all-schools/all-schools.component';
import { AddSchoolsComponent } from './add-schools/add-schools.component';
import { EditSchoolComponent } from './edit-schools/edit-professor.component';
import { AboutSchoolsComponent } from './about-schools/about-schools.component';
const routes: Routes = [
  {
    path: 'all-schools',
    component: AllSchoolsComponent
  },
  {
    path: 'add-school',
    component: AddSchoolsComponent
  },
  {
    path: 'edit-school',
    component: EditSchoolComponent
  },
  {
    path: 'about-school',
    component: AboutSchoolsComponent
  }
];
@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule]
})
export class SchoolsRoutingModule {}
