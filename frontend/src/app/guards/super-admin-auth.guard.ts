import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { SuperAdminAuthService } from '../modules/super-admin/services/super-admin-auth.service';

@Injectable({ providedIn: 'root' })

export class SuperAdminAuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private superAdminAuthService: SuperAdminAuthService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const superAdminToken = this.superAdminAuthService.superAdminTokenValue;
    
    if (superAdminToken && superAdminToken.length > 0) {
      return true;
    } else {
      // not logged in so redirect to login page with the return url
      this.router.navigate(['/super-admin/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }
  }
}
