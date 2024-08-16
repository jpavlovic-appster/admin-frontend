import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/shared/components/components.module';
// import { TenantConfigurationsComponent } from './tenant-configurations/tenant-configurations.component';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { CommonAdminAuthGuard } from 'src/app/guards';

// import { EditCredentialsComponent } from './edit-credentials/edit-credentials.component';
// import { TenantCredentialsComponent } from './tenant-credentials/tenant-credentials.component';
// import { EditSportSettingComponent } fro../setting/edit-sport-setting/edit-sport-setting.componentent';

const agentRoutes: Routes = [
  { path: '', redirectTo: 'theme-settings', pathMatch: 'full' },
  // {
  //   path: 'credentials', component: TenantCredentialsComponent,
  //   canActivate: [CommonAdminAuthGuard],
  //   data: {
  //     permissions: {
  //       tenant_credentials: ['R'],
  //     }
  //   }
  // },
  // {
  //   path: 'theme-settings', component: ThemeSettingComponent,
  //   canActivate: [CommonAdminAuthGuard],
  //   data: {
  //     permissions: {
  //       tenants: ['R', 'U'],
  //     }
  //   }
  // },
  // {
  //   path: 'configurations', component: TenantConfigurationsComponent,
  //   canActivate: [CommonAdminAuthGuard],
  //   data: {
  //     permissions: {
  //       tenant_configurations: ['R'],
  //     }
  //   }
  // },
  
  // {
  //   path: 'credentials/:credentialId', component: EditCredentialsComponent,
  //   canActivate: [CommonAdminAuthGuard],
  //   data: {
  //     permissions: {
  //       tenant_credentials: ['U'],
  //     }
  //   }
  // },
  // {
  //   path: 'sport-settings/:tenantId/:id', component: EditSportSettingComponent,
  //   canActivate: [CommonAdminAuthGuard],
  //   data: {
  //     permissions: {
  //       tenant_settings: ['R', 'U'],
  //     }
  //   }
  // },
];

@NgModule({
  declarations: [
    // EditSportSettingComponent, TenantCredentialsComponent, EditCredentialsComponent, TenantConfigurationsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(agentRoutes),
    SharedModule,
    ComponentsModule,
    DirectivesModule
  ]
})

export class TenantModule { }
