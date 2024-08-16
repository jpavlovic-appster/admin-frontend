import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AdminAuthService } from '../modules/admin/services/admin-auth.service';
import { SuperAdminAuthService } from '../modules/super-admin/services/super-admin-auth.service';
import { SubscriberAuthService } from '../modules/subscriber-system/services/subscriber-auth.service';

@Injectable()
export class AuthorizationHeaderInterceptor implements HttpInterceptor {

  adminType: string = '';

  constructor(
    private adminAuthService: AdminAuthService,
    private superAdminAuthService: SuperAdminAuthService,
    private subscriberAuthService: SubscriberAuthService,
  ) {

  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // this.adminType = (this.superAdminAuthService.superAdminTokenValue && this.superAdminAuthService.superAdminTokenValue.length > 0) ? 'super' : 'tenant';

    // const SuperAdminAuthorization = 'Bearer ' + this.superAdminAuthService.superAdminTokenValue || '';
    // const AdminAuthorization = 'Bearer ' + this.adminAuthService.adminTokenValue || '';
    // const AffiliateAuthorization = 'Bearer ' + this.affiliateAuthService.affiliateTokenValue || '';

    let Authorization = '';
    let Role: any = '';

    if (this.superAdminAuthService.superAdminTokenValue && this.superAdminAuthService.superAdminTokenValue.length > 0) {
      Authorization = 'Bearer ' + this.superAdminAuthService.superAdminTokenValue || '';
      Role = this.superAdminAuthService.superAdminRoleValue || '';
    } else if (this.subscriberAuthService.subscriberAdminTokenValue && this.subscriberAuthService.subscriberAdminTokenValue.length > 0) {
      Authorization = 'Bearer ' + this.subscriberAuthService.subscriberAdminTokenValue || '';
      Role = this.subscriberAuthService.subscriberAdminRoleValue || '';
    } else if (this.adminAuthService.adminTokenValue && this.adminAuthService.adminTokenValue.length > 0) {
      Authorization = 'Bearer ' + this.adminAuthService.adminTokenValue || '';
      Role = this.adminAuthService.adminRoleValue || '';
    }

    let api: any = null;
    if (request.url.includes('public/i18n')) {
      api = environment.STATIC_URL;
    } else {
      api = environment.API_URL;
    }

    if (Authorization && api && !request.url.includes('public/i18n')) {
      // if (Authorization && api) {
        request = request.clone({ setHeaders: { Authorization, Role } });
      // }
      // request = request.clone({
      //   headers: request.headers.append(
      //     'Role', Role,
      //   )
      // });
    }

    request = request.clone({
      url: api + request.url
    });

    return next.handle(request);
  }
}

export const AuthorizationTokenHandler = {
  provide: HTTP_INTERCEPTORS,
  useClass: AuthorizationHeaderInterceptor,
  multi: true
};
