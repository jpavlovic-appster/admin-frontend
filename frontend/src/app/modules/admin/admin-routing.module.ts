import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonAdminAuthGuard } from 'src/app/guards';
import { AdminAuthService } from './services/admin-auth.service';
let idAdmin =false;
const adminRoutes: Routes = [
  // {
  //   path: '',
  //   pathMatch: 'full',
  //   redirectTo: 'dashboard',
  //   canActivate: [CommonAdminAuthGuard],
  // },
  // {
  //   path: 'dashboard',
  //   loadChildren: () =>
  //     import('../dashboard/dashboard.module').then((m) => m.DashboardModule),
  //   pathMatch: 'full',
  //   canActivate: [CommonAdminAuthGuard],
  // },
  {
    path: 'sub-dashboard',
    loadChildren: () =>
      import('./admin-modules/dashboard/dashboard.module').then(
        (m) => m.DashboardModule
      ),
    // pathMatch: 'full',
    // canActivate: [CommonAdminAuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(adminRoutes)],
  exports: [RouterModule],
})

export class AdminRoutingModule {
  constructor(public adminAuthService: AdminAuthService) {

  }
  public checkAdmin(){
    if(this.adminAuthService.adminTokenValue && this.adminAuthService.adminTokenValue.length > 0){
      return true;
    }
    return false;
  }
}
