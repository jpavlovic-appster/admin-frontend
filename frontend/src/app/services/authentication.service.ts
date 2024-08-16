import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AdminType } from '../models';
import { AdminAuthService } from '../modules/admin/services/admin-auth.service';
import { SubscriberAuthService } from '../modules/subscriber-system/services/subscriber-auth.service';
import { SuperAdminAuthService } from '../modules/super-admin/services/super-admin-auth.service';

@Injectable({ providedIn: 'root' })

export class AuthenticationService {

    private adminTypeSubject: BehaviorSubject<String>;

    constructor(
        private superAdminAuthService: SuperAdminAuthService,
        private adminAuthService: AdminAuthService,
        private subscriberAuthService: SubscriberAuthService
    ) {

      this.adminTypeSubject = new BehaviorSubject<String>('');

      this.setAdminType();

    }

    public get adminTypeValue(): String {
        return this.adminTypeSubject.value;
    }

    setAdminType() {
      if (this.superAdminAuthService.superAdminTokenValue && this.superAdminAuthService.superAdminTokenValue.length > 0) {
        this.adminTypeSubject.next(AdminType.Super);
      } else if (this.adminAuthService.adminTokenValue && this.adminAuthService.adminTokenValue.length > 0) {
        this.adminTypeSubject.next(AdminType.Tenant);
      } else if (this.subscriberAuthService.subscriberAdminTokenValue && this.subscriberAuthService.subscriberAdminTokenValue.length > 0) {
        this.adminTypeSubject.next(AdminType.Subscriber);
      }
    }

}
