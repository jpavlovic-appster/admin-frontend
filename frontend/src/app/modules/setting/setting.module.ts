import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CredentialsComponent } from './credentials/credentials.component';
import { CommonAdminAuthGuard } from 'src/app/guards';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/shared/components/components.module';
import { PipeModule } from 'src/app/pipes/pipes.module';
import { ConfigurationsComponent } from './configurations/configurations.component';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { TranslateModule } from '@ngx-translate/core';
import { EditCrashGameSettingComponent } from './edit-crash-game-setting/edit-crash-game-setting.component';

const settingRoutes: Routes = [
  { path: '', redirectTo: 'credentials', pathMatch: 'full' },
  {
    path: 'tenants/credentials', component: CredentialsComponent,
    canActivate: [CommonAdminAuthGuard],
    data: {
      permissions: {
        tenant_credentials: ['R'],
      }
    }
  },
  {
    path: 'tenants/configurations', component: ConfigurationsComponent,
    canActivate: [CommonAdminAuthGuard],
    data: {
      permissions: {
        tenant_configurations: ['R'],
      }
    }
  },
  {
    path: 'subscribers/configurations', component: ConfigurationsComponent,
    canActivate: [CommonAdminAuthGuard],
    data: {
      permissions: {
        subscriber_configurations: ['R'],
      }
    }
  },
  {
    path: 'subscribers/credentials', component: CredentialsComponent,
    canActivate: [CommonAdminAuthGuard],
    data: {
      permissions: {
        subscriber_credentials: ['R'],
      }
    }
  },
  {
    path: 'subscribers/game-settings/:stId/:id', component: EditCrashGameSettingComponent,
    canActivate: [CommonAdminAuthGuard],
    data: {
      permissions: {
        subscriber_settings: ['R', 'U'],
      }
    }
  },
  {
    path: 'crash-game/super-admin/:id', component: EditCrashGameSettingComponent,
    canActivate: [CommonAdminAuthGuard],
    data: {
      permissions: {
        subscriber_settings: ['R', 'U'],
      }
    }
  }
];

@NgModule({
  declarations: [ CredentialsComponent, ConfigurationsComponent, EditCrashGameSettingComponent],
  imports: [
    CommonModule,
    DirectivesModule,
    SharedModule,
    ComponentsModule,
    PipeModule,
    RouterModule.forChild(settingRoutes),
    TranslateModule
  ]
})

export class SettingModule { }
