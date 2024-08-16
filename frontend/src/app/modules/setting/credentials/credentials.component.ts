import { Component, OnInit } from '@angular/core';
import { AdminType } from 'src/app/models';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { isAllowedPermission } from 'src/app/services/utils.service';
import { AdminAuthService } from '../../admin/services/admin-auth.service';
import { SubscriberAuthService } from '../../subscriber-system/services/subscriber-auth.service';
import { SubscriberService } from '../../subscriber-system/services/subscriber.service';
import { TenantService } from '../../tenant/tenant.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  templateUrl: './credentials.component.html'
})

export class CredentialsComponent implements OnInit {

  remainingCredentials: any[] = [];
  tenantDetials: any;
  // tenant: any;

  translations = {
    "HOME": "",
    "CREDENTIALS": ""
  }
  breadcrumbs: Array<any> = [];

  adminType: any = AdminType;

  // Permission Varibales
  requestReadPermissions = btoa(btoa('tenant_credentials|:|R'));
  requestSubscriberReadPermissions = btoa(btoa('subscriber_credentials|:|R'));
  canEdit = false;

  constructor(
    public tenantService: TenantService,
    public subscriberService: SubscriberService,
    public adminAuthServie: AdminAuthService,
    public subscriberAuthService: SubscriberAuthService,
    public authService: AuthenticationService,
    private translateService: TranslateService
  ) { }

  ngOnInit(): void {
    this.setPermissions();
    // this.getRemTenCred();

    if (this.authService.adminTypeValue === AdminType.Tenant) {
      this.adminAuthServie.adminUser.subscribe((res: any) => {
        if (res?.tenant_id) {
          this.getTenant(res?.tenant_id);
        }
      });
    } else if (this.authService.adminTypeValue === AdminType.Subscriber) {
      this.subscriberAuthService.subscriberAdminUser.subscribe((res: any) => {
        if (res?.subscriber_id) {
          this.getSubscriber(res.subscriber_id);
        }
      });
    }

    this.doTranslation();
    this.translateService.onLangChange.subscribe(event => {
      this.doTranslation();
    });
  }

  setPermissions() {
    if (this.authService.adminTypeValue === AdminType.Subscriber) {
      this.canEdit = isAllowedPermission('subscriber_credentials', 'U');
    } else if (this.authService.adminTypeValue === AdminType.Tenant) {
      this.canEdit = isAllowedPermission('tenant_credentials', 'U');
    }
  }

  getTenant(id: number) {
    this.tenantService.getAdminTenant(id, this.requestReadPermissions).subscribe((res: any) => {
      this.tenantDetials = res.record;
    });
  }

  getSubscriber(id: number) {
    this.subscriberService.getSubscriber(id, this.requestSubscriberReadPermissions).subscribe((res: any) => {
      this.tenantDetials = res.record;
    });
  }

  getRemTenCred() {
    this.tenantService.getAdminTenantRemCred(this.authService.adminTypeValue === AdminType.Subscriber ? this.requestSubscriberReadPermissions : this.requestReadPermissions)
      .subscribe((res: any) => {
        this.remainingCredentials = res.record;
      });
  }

  doTranslation() {
    this.translateService.get(Object.keys(this.translations)).subscribe(res => {
      this.translations = res;
      this.breadcrumbs = [
        { title: this.translations['HOME'], path: '/' },
        { title: this.translations['CREDENTIALS'], path: '/' },
      ];
    });
  }

}
