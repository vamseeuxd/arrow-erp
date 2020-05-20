import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OnlineClassesRoutingModule} from './online-classes-routing.module';
import {OnlineClassesComponent} from './online-classes/online-classes.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {OnlineClassChatComponent} from './online-class-chat/online-class-chat.component';
import {PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import {MatButtonModule} from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatIconModule} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatInputModule} from '@angular/material/input';
import {MatTabsModule} from '@angular/material/tabs';
import {ClickOutsideModule} from 'ng-click-outside';

@NgModule({
  declarations: [
    OnlineClassChatComponent,
    OnlineClassesComponent
  ],
  imports: [
    CommonModule,
    PerfectScrollbarModule,
    ReactiveFormsModule,
    FormsModule,
    OnlineClassesRoutingModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatSelectModule,
    MatCheckboxModule,
    MatInputModule,
    FormsModule,
    MatTabsModule,
    ClickOutsideModule,
  ]
})
export class OnlineClassesModule {
}
