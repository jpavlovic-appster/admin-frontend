import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DirectivesModule } from '../directives/directives.module';
import { AdminTypeFilterComponent } from './admin-type-filter/admin-type-filter.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({

  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    DirectivesModule,
    TranslateModule
  ],

  declarations: [
    BreadcrumbComponent, AdminTypeFilterComponent
  ],

  exports: [
    BreadcrumbComponent, AdminTypeFilterComponent
  ]

})

export class ComponentsModule { }
