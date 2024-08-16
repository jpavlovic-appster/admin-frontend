import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonAdminAuthGuard } from 'src/app/guards';
import { LayoutComponent } from './layout.component';

const layoutRoutes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('../../modules/admin/admin.module').then(
            (m) => m.AdminModule
          ),
        canActivate: [CommonAdminAuthGuard]
      },
      {
        path: 'super-admin',
        loadChildren: () =>
          import('../../modules/super-admin/super-admin.module').then(
            (m) => m.SuperAdminModule
          ),
        canActivate: [CommonAdminAuthGuard],
      },
      {
        path: 'agents',
        loadChildren: () =>
          import('../../modules/agent/agent.module').then(
            (m) => m.AgentModule
          ),
        canActivate: [CommonAdminAuthGuard]
      },
      {
        path: 'users',
        loadChildren: () =>
          import('../../modules/user/user.module').then(
            (m) => m.UserModule
          ),
        canActivate: [CommonAdminAuthGuard]
      },
      {
        path: 'tenants',
        loadChildren: () =>
          import('../../modules/tenant/tenant.module').then(
            (m) => m.TenantModule
          ),
        canActivate: [CommonAdminAuthGuard]
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('../../modules/setting/setting.module').then(
            (m) => m.SettingModule
          ),
        canActivate: [CommonAdminAuthGuard]
      },
      {
        path: 'reports',
        loadChildren: () => import('../../modules/reports/reports.module').then(m => m.ReportsModule),
        canActivate: [CommonAdminAuthGuard]
      },
      {
        path: 'crash-game',
        loadChildren: () =>
          import('../../modules/crash-game/crash-game.module').then((m) => m.CrashGameModule),
        canActivate: [CommonAdminAuthGuard]
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(layoutRoutes)],
  exports: [RouterModule]
})

export class LayoutRoutingModule { }
