import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AllInstitutionsComponent } from './all-institutions/all-institutions.component';
import { AddInstitutionComponent } from './add-institution/add-institution.component';
const routes: Routes = [
  {
    path: 'all-institutions',
    component: AllInstitutionsComponent
  },
  {
    path: 'add-institution',
    component: AddInstitutionComponent
  }
];
@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule]
})
export class InstitutionsRoutingModule {}
