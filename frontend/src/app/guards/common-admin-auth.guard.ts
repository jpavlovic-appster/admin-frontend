import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AdminAuthService } from '../modules/admin/services/admin-auth.service';
import { SuperAdminAuthService } from '../modules/super-admin/services/super-admin-auth.service';
import { SubscriberAuthService } from '../modules/subscriber-system/services/subscriber-auth.service';

@Injectable({ providedIn: 'root' })

export class CommonAdminAuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private adminAuthService: AdminAuthService,
    private superAdminAuthService: SuperAdminAuthService,
    private subscriberAuthService: SubscriberAuthService,
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const adminToken = this.adminAuthService.adminTokenValue;
    const superAdminToken = this.superAdminAuthService.superAdminTokenValue;
    const subscriberToken = this.subscriberAuthService.subscriberAdminTokenValue;

    let loggedInUserPermissions: any = null;
    if (superAdminToken && superAdminToken.length > 0) {
      loggedInUserPermissions = this.superAdminAuthService.superAdminPermissionsValue;
      loggedInUserPermissions = JSON.parse(atob(atob(loggedInUserPermissions)));
    } else if (adminToken && adminToken.length > 0) {
      loggedInUserPermissions = this.adminAuthService.adminPermissionsValue;
      loggedInUserPermissions = JSON.parse(atob(atob(loggedInUserPermissions)));
    } else if (subscriberToken && subscriberToken.length > 0) {
      loggedInUserPermissions = this.subscriberAuthService.subscriberAdminPermissionsValue;
      loggedInUserPermissions = JSON.parse(atob(atob(loggedInUserPermissions)));
    }

    if (route.data.permissions) {
      if (loggedInUserPermissions) {
        for (let p in route.data.permissions) {
          if (route.data.permissions[p].some(permission => loggedInUserPermissions[p].includes(permission))) {
            return true;
          }
        }
      } else {
        this.router.navigate(['/login']);
        return false;
      }
    } else {
      if ((superAdminToken && superAdminToken.length > 0) || (adminToken && adminToken.length > 0) || (subscriberToken && subscriberToken.length > 0)) {
        return true;
      }
      this.router.navigate(['/login']);
      return false;
    }

    this.router.navigate(['/login']);
    return false;

  }
}
