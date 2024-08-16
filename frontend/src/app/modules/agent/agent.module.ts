import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/shared/components/components.module';
import { EditAdminComponent } from './edit-admin/edit-admin.component';
import { AdminDetailsComponent } from './admin-details/admin-details.component';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { CommonAdminAuthGuard } from 'src/app/guards';
import { EditSubscriberAdminComponent } from './edit-subscriber-admin/edit-subscriber-admin.component';
import { TranslateModule } from '@ngx-translate/core';
import { ChangeSubscriberPasswordComponent } from './change-subscriber-password/change-subscriber-password.component';

const agentRoutes: Routes = [
 
  {
    path: ':tenantId/:adminId', component: EditAdminComponent,
    canActivate: [CommonAdminAuthGuard],
    data: {
      permissions: {
        admins: ['C', 'U'],
      }
    }
  },
  {
    path: 'details/:tenantId/:adminId', component: AdminDetailsComponent,
    canActivate: [CommonAdminAuthGuard],
    data: {
      permissions: {
        admins: ['R'],
      }
    }
  },
  {
    path: 'subscriber/:subscriberId/:adminId', component: EditSubscriberAdminComponent,
    canActivate: [CommonAdminAuthGuard],
    data: {
      permissions: {
        admins: ['R', 'C', 'U'],
      }
    }
  },
  {
    path: 'subscriber/change-password/:subscriberId/:adminId', component: ChangeSubscriberPasswordComponent,
    canActivate: [CommonAdminAuthGuard],
    data: {
      permissions: {
        admins: ['R', 'C', 'U'],
      }
    }
  }
];

@NgModule({
  declarations: [ EditAdminComponent, AdminDetailsComponent, EditSubscriberAdminComponent, ChangeSubscriberPasswordComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(agentRoutes),
    SharedModule,
    ComponentsModule,
    DirectivesModule,
    TranslateModule
  ]
})

export class AgentModule { }
