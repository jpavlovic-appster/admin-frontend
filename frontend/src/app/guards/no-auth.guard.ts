import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AdminAuthService } from '../modules/admin/services/admin-auth.service';
import { SubscriberAuthService } from '../modules/subscriber-system/services/subscriber-auth.service';
import { SuperAdminAuthService } from '../modules/super-admin/services/super-admin-auth.service';

@Injectable({ providedIn: 'root' })

export class NoAuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private adminAuthService: AdminAuthService,
    private superAdminAuthService: SuperAdminAuthService,
    private subscriberAuthService: SubscriberAuthService,
) { }

canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    const superAdminToken = this.superAdminAuthService.superAdminTokenValue;
    const adminToken = this.adminAuthService.adminTokenValue;
    const subscriberAdminToken = this.subscriberAuthService.subscriberAdminTokenValue;

    if (superAdminToken && superAdminToken.length > 0) {
      // logged in so redirect to previus url with the localStorage
      const url = this.router.url.startsWith('super-admin') ? this.router.url : '/super-admin';
      this.router.navigate([url]);
      return false;
    } else if((adminToken && adminToken.length > 0) || (subscriberAdminToken && subscriberAdminToken.length > 0)) {
      // logged in so redirect to previus url with the localStorage
      this.router.navigate([this.router.url || '/']);
      return false;
    }

    return true;
  }
}
