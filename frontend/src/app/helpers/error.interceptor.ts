import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Router } from '@angular/router';
import { AdminAuthService } from '../modules/admin/services/admin-auth.service';
import { SuperAdminAuthService } from '../modules/super-admin/services/super-admin-auth.service';
import { SubscriberAuthService } from '../modules/subscriber-system/services/subscriber-auth.service';
import { AuthenticationService } from '../services/authentication.service';
import { AdminType } from '../models';
import { TranslateService } from '@ngx-translate/core';

declare const $: any;
declare const toastr: any;

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private adminAuthService: AdminAuthService,
    private superAdminAuthService: SuperAdminAuthService,
    private subscriberAuthService: SubscriberAuthService,
    private translate: TranslateService
  ) { }

  private logoutInitiated = false;

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(map((res) => {
      return res;
    }), catchError(err => {

      $('#preloader').css('height', 0);
      $('#preloader img').hide();

      let errorMessaege = '';

      if (err.status === 401) {

        if (this.authService.adminTypeValue === AdminType.Super) {
          this.superAdminAuthService.navigateToLogin('SENTENCES.SESSION_EXPIRED');
        } else if (this.authService.adminTypeValue === AdminType.Subscriber) {
          this.subscriberAuthService.navigateToLogin('SENTENCES.SESSION_EXPIRED');
        } else {
          this.adminAuthService.navigateToLogin('SENTENCES.SESSION_EXPIRED');
        }

      } else if (err.status === 404) {
        console.log("error")
        this.router.navigate(['/404']);
      } else if(err.status === 429) {
        location.reload();
      }

      console.log('Error Log', err);

      if(err?.error?.message) {
        errorMessaege += this.translate.instant(err.error.message);
      }

      if(err?.error?.record) {

        for(let e in err.error.record) {
          for(let em of err.error.record[e]) {
            // errmsg.concat(' '+em);

            // errorMessaege +=' - '+em+ '<BR>';
            errorMessaege +=' - '+ this.translate.instant(em) + '<BR>';
          }
        }

      }

      errorMessaege = errorMessaege.trim() || err?.statusText;

      toastr.error(errorMessaege);

      // toastr.error(errorMessaege);

      return throwError(err);
    }));
  }
}

export const ErrorHandler = {
  provide: HTTP_INTERCEPTORS,
  useClass: ErrorInterceptor,
  multi: true
};
