import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list/list.component';
import { RouterModule, Routes } from '@angular/router';
import { ComponentsModule } from 'src/app/shared/components/components.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { CommonAdminAuthGuard } from 'src/app/guards';
import { EditComponent } from './edit/edit.component';
import { DetailsComponent } from './details/details.component';
import { GaugeModule } from 'angular-gauge';
import { FormsModule } from '@angular/forms';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';

const organizationRoutes: Routes = [
  {
    path: '', component: ListComponent,
    canActivate: [CommonAdminAuthGuard],
  },
  {
    path: ':id', component: EditComponent,
    canActivate: [CommonAdminAuthGuard],
  },
  {
    path: 'details/:id', component: DetailsComponent,
    canActivate: [CommonAdminAuthGuard],
  }
]

@NgModule({
  declarations: [
    ListComponent,
    EditComponent,
    DetailsComponent
  ],
  imports: [
    CommonModule,
    DirectivesModule,
    RouterModule.forChild(organizationRoutes),
    ComponentsModule,
    SharedModule,
    TranslateModule,
    GaugeModule.forRoot(),
    FormsModule
  ]
})
export class OrganizationsModule { }
