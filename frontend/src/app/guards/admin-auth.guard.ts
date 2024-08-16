import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AdminAuthService } from '../modules/admin/services/admin-auth.service';
import { AdminRole } from 'src/app/models';

@Injectable({ providedIn: 'root' })

export class AdminAuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private adminAuthService: AdminAuthService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const adminToken = this.adminAuthService.adminTokenValue;

    if (adminToken && adminToken.length > 0) {

      let roles: any = localStorage.getItem('roles') || '';

      if (roles) {
        roles = JSON.parse(roles);
        if (AdminRole.findIndex((element: any) => element.abbr === roles) > -1) {
          return true;
        } else {
          this.router.navigate(['/']);
          return false;
        }
      } else {
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
      }

    } else {
      // not logged in so redirect to login page with the return url
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }
  }
}
