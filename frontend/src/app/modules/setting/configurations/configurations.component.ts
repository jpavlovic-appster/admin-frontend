import { Component, OnInit } from '@angular/core';
import { AdminType } from 'src/app/models';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CurrenciesService } from '../../super-admin/super-admin-modules/currencies/currencies.service';
import { TranslateService } from '@ngx-translate/core';
import { AdminAuthService } from '../../admin/services/admin-auth.service';
import { SubscriberAuthService } from '../../subscriber-system/services/subscriber-auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TenantService } from '../../tenant/tenant.service';
import { SubscriberService } from '../../subscriber-system/services/subscriber.service';

@Component({
  templateUrl: './configurations.component.html',
  styleUrls: ['./configurations.component.scss'],
})
export class ConfigurationsComponent implements OnInit {
  configurationsCurrencies: any[] = [];

  adminType = AdminType;
  primaryCurrency: any = '';

  translations = {
    HOME: '',
    CONFIGURATIONS: '',
  };

  breadcrumbs: Array<any> = [];

  // Permission Varibales
  requestReadPermissions = btoa(btoa('tenant_configurations|:|R'));
  requestSubscriberReadPermissions = btoa(
    btoa('subscriber_configurations|:|R')
  );
  configDataResult;
  scriptData;
  hostname;
  tenantDetials;

  constructor(
    private currenciesService: CurrenciesService,
    public authService: AuthenticationService,
    private translateService: TranslateService,
    public adminAuthService: AdminAuthService,
    public subscriberAuthService: SubscriberAuthService,
    public tenantService: TenantService,
    public subscriberService: SubscriberService,
    private http: HttpClient
  ) {
    this.http
      .get(environment.STATIC_URL+'public/json/'+environment.DOCUMENTATION_FILE)
      .subscribe((res) => {
        this.configDataResult = res;
          this.http
        .get(environment.STATIC_URL+this.configDataResult.subscriber.sdk.script_path, {
          responseType: 'text',
        })
        .subscribe((data) => (this.scriptData = data));
        
        // console.log(this.scriptData)
      });
      
    
  }
  getTenantHost(id: number) {
    this.tenantService.getAdminTenant(id, this.requestReadPermissions).subscribe((res: any) => {
      this.tenantDetials = res.record;
      this.hostname = new URL(this.tenantDetials.tenants.domain).hostname
      if(this.hostname == ""){
        this.hostname = "domain.com"
      }
    });
  }

  getSubscriberHost(id: number) {
    this.subscriberService.getSubscriber(id, this.requestSubscriberReadPermissions).subscribe((res: any) => {
      this.tenantDetials = res.record;
      this.hostname = new URL(this.tenantDetials.domain).hostname
      if(this.hostname == ""){
        this.hostname = "domain.com"
      }
    });
  }

  ngOnInit(): void {
    this.getTenant();

    if (this.authService.adminTypeValue === AdminType.Tenant) {
      this.adminAuthService.adminUser.subscribe((admin: any) => {
        if (admin?.tenant?.primary_currency) {
          this.primaryCurrency = admin.tenant.primary_currency;
          this.getTenantHost(admin?.tenant_id);
        }
      });
    } else if (this.authService.adminTypeValue === AdminType.Subscriber) {
      this.subscriberAuthService.subscriberAdminUser.subscribe((admin: any) => {
        if (admin?.subscriber?.primary_currency) {
          this.primaryCurrency = admin.subscriber.primary_currency;
          this.getSubscriberHost(admin.subscriber_id);
        }
      });
    }

    this.doTranslation();
    this.translateService.onLangChange.subscribe((event) => {
      this.doTranslation();
    });
  }

  getTenant() {
    this.currenciesService
      .getAdminCurrencies(
        this.authService.adminTypeValue === AdminType.Subscriber
          ? this.requestSubscriberReadPermissions
          : this.requestReadPermissions
      )
      .subscribe((res: any) => {
        this.configurationsCurrencies = res.record;
      });
  }

  doTranslation() {
    this.translateService
      .get(Object.keys(this.translations))
      .subscribe((res) => {
        this.translations = res;

        this.breadcrumbs = [
          { title: this.translations['HOME'], path: '/' },
          { title: this.translations['CONFIGURATIONS'], path: '' },
        ];
      });
  }
}
