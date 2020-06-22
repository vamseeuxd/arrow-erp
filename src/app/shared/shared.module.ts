import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DynamicFormComponent} from './components/dynamic-form/dynamic-form.component';
import {MinDirective} from './directive/min.directive';
import {MaxDirective} from './directive/max.directive';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatRadioModule} from '@angular/material/radio';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatCardModule} from '@angular/material/card';
import {TagInputModule} from 'ngx-chips';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {ToastrModule} from 'ngx-toastr';
import {DynamicDataGridComponent} from './components/dynamic-data-grid/dynamic-data-grid.component';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import {WithLoadingPipe} from './pipes/with-loading.pipe';
import {PageLoaderComponent} from '../layout/page-loader/page-loader.component';
import {NgInitDirective} from './directive/ngInit.directive';

@NgModule({
  declarations: [
    DynamicDataGridComponent,
    DynamicFormComponent,
    MinDirective,
    MaxDirective,
    WithLoadingPipe,
    NgInitDirective,
  ],
  exports: [
    DynamicFormComponent,
    DynamicDataGridComponent,
    MinDirective,
    MaxDirective,
    CommonModule,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatCheckboxModule,
    MatCardModule,
    TagInputModule,
    MatSidenavModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    WithLoadingPipe,
    NgInitDirective,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatCheckboxModule,
    MatCardModule,
    TagInputModule,
    MatSidenavModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    ToastrModule.forRoot(),
  ],
  entryComponents: [DynamicFormComponent],
})
export class SharedModule {
}
