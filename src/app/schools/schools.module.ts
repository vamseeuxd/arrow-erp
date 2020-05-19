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
import {SchoolsRoutingModule} from './schools-routing.module';
import {AllSchoolsComponent} from './all-schools/all-schools.component';
import {DeleteDialogComponent} from './all-schools/dialogs/delete/delete.component';
import {FormDialogComponent} from './all-schools/dialogs/form-dialog/form-dialog.component';
import {AddSchoolsComponent} from './add-schools/add-schools.component';
import {EditSchoolComponent} from './edit-schools/edit-professor.component';
import {AboutSchoolsComponent} from './about-schools/about-schools.component';
import {MaterialFileInputModule} from 'ngx-material-file-input';
import {MatTabsModule} from '@angular/material/tabs';
import {MatMenuModule} from '@angular/material/menu';
import {SchoolsService} from './all-schools/schools.service';
import {ArrowFirebaseModule} from '../arrow-firebase.module';

@NgModule({
  declarations: [
    AllSchoolsComponent,
    DeleteDialogComponent,
    FormDialogComponent,
    AddSchoolsComponent,
    EditSchoolComponent,
    AboutSchoolsComponent
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
    SchoolsRoutingModule,
    ArrowFirebaseModule,
  ],
  providers: [
    SchoolsService
  ]
})
export class SchoolsModule {
}
