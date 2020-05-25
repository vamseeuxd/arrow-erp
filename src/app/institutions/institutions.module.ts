import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSortModule} from '@angular/material/sort';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {InstitutionsRoutingModule} from './institutions-routing.module';
import {AllInstitutionsComponent} from './all-institutions/all-institutions.component';
import {DeleteDialogComponent} from './all-institutions/dialogs/delete/delete.component';
import {FormDialogComponent} from './all-institutions/dialogs/form-dialog/form-dialog.component';
import {AddInstitutionComponent} from './add-institution/add-institution.component';
import {MaterialFileInputModule} from 'ngx-material-file-input';
import {MatTabsModule} from '@angular/material/tabs';
import {MatMenuModule} from '@angular/material/menu';
import {InstitutionsService} from './all-institutions/institutions.service';
import {ArrowFirebaseModule} from '../arrow-firebase.module';
import {MatTooltipModule} from '@angular/material/tooltip';

@NgModule({
  declarations: [
    AllInstitutionsComponent,
    DeleteDialogComponent,
    FormDialogComponent,
    AddInstitutionComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSortModule,
    MatToolbarModule,
    MatSelectModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatTabsModule,
    MaterialFileInputModule,
    MatMenuModule,
    InstitutionsRoutingModule,
    ArrowFirebaseModule,
    MatTooltipModule,
  ],
  providers: [
    InstitutionsService
  ]
})
export class InstitutionsModule {
}
