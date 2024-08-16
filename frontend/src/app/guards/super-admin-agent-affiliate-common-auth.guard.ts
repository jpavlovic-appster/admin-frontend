import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AdminAuthService } from '../modules/admin/services/admin-auth.service';
import { SuperAdminAuthService } from '../modules/super-admin/services/super-admin-auth.service';

@Injectable({ providedIn: 'root' })

export class SuperAdminAgentAffiliateCommonAuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private adminAuthService: AdminAuthService,
    private superAdminAuthService: SuperAdminAuthService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const adminToken = this.adminAuthService.adminTokenValue;
    const superAdminToken = this.superAdminAuthService.superAdminTokenValue;


    if (superAdminToken && superAdminToken.length > 0) {
      return true;
    } else if(adminToken && adminToken.length > 0) {
      return true;
    } else {
      // not logged in so redirect to login page with the return url
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }
  }
}
