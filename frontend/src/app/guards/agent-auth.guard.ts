import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AdminRole } from '../models';
import { AdminAuthService } from '../modules/admin/services/admin-auth.service';

@Injectable({ providedIn: 'root' })

export class AgentAuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private adminAuthService: AdminAuthService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const adminToken = this.adminAuthService.adminTokenValue;

    if (adminToken && adminToken.length > 0 && AdminRole.findIndex((element: any) => element.abbr === this.adminAuthService.adminRoleValue) > -1) {
      return true;
    } else {
      this.router.navigate(['/']);
      return false;
    }
  }
}
