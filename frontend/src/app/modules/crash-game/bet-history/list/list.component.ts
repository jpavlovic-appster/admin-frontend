import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AdminType, Currency, Tenant } from 'src/app/models';
import { SubscriberAuthService } from 'src/app/modules/subscriber-system/services/subscriber-auth.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { isAllowedPermission } from 'src/app/services/utils.service';
import { PageSizes } from 'src/app/shared/constants';
import { AdminAuthService } from '../../../admin/services/admin-auth.service';
import { SuperAdminAuthService } from '../../../super-admin/services/super-admin-auth.service';
import { TenantService } from '../../../tenant/tenant.service';
import { CrashGameService } from '../../crash-game.service';

declare const $: any;
@Component({
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})

export class ListComponent implements OnInit {

  canShowUsers = false;

  betHistories: any[] = [];
  tenants: Tenant[] = [];
  format: string = "YYYY-MM-DD";
  adminType = AdminType;

  pageSizes: any[] = PageSizes;
  currencies: Currency[] = [];

  p: number = 0;
  total: number = 0;

  params: any = {
    size: 10,
    page: 1,
    bet_type: '',
    search: '',
    currency_code: '',
    result: '',
    freebet: '',
    autobet: '',
    type: AdminType.Tenant,
    user_id:0,
    order: 'desc',
    sort_by: 'created_at'
  }

  translations = {
    "HOME": "",
    "BET_HISTORY": "",
    "PLAYERS": "",
    "SUBSCRIBER": ""
  };

  breadcrumbs: Array<any> = [];

  requestReadPermissions = btoa(btoa('crash_game|:|R'));
  id: any;
  user: any;
  order= 'asc';
  constructor(private betService: CrashGameService,
    private route: ActivatedRoute,
    private tenantService: TenantService,
    public superAdminAuthService: SuperAdminAuthService,
    private adminAuthService: AdminAuthService,
    private subscriberAuthService: SubscriberAuthService,
    public authService: AuthenticationService,
    private translateService: TranslateService) { 
      this.id = this.route.snapshot.params['id'];
      this.params.user_id = this.id;
    }

  ngOnInit(): void {
    this.setPermissions();
    if (this.authService.adminTypeValue === AdminType.Super) {
      // this.adminType = 'super';
      this.getBetHistoeies();
      this.params = { ...this.params, type: AdminType.Tenant };
      // this.getTenantsAll();
    } if (this.authService.adminTypeValue === AdminType.Subscriber) {

      this.subscriberAuthService.subscriberAdminUser.subscribe((user: any) => {
        if (user.subscriber_id) {
          this.params = { ...this.params, type: AdminType.Subscriber, subscriber_id: user.subscriber_id };
          this.getBetHistoeies();
        }
      });

    } else {

      this.adminAuthService.adminUser.subscribe((user: any) => {
        if (user.tenant_id) {
          // this.currencies = user.wallets.map(m => {
          //   m.code = m.currency_code;
          //   return m;
          // });
          this.params = { ...this.params, type: AdminType.Tenant, tenant_id: user.tenant_id };

          this.getBetHistoeies();
          this.getTenantCurrencies(user.tenant_id);
        }
      });

    }

    this.doTranslation();
    this.translateService.onLangChange.subscribe(event => {
      this.doTranslation();
    });
  }

  setPermissions() {
    // let loggedInUserPermissions: any = localStorage.getItem('permissions');
    // loggedInUserPermissions = JSON.parse(atob(atob(loggedInUserPermissions)));
    // this.canShowUsers = loggedInUserPermissions.users.includes('R');

    this.canShowUsers = isAllowedPermission('users', 'R');
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      $('#time_period').val('');
    }, 100);

  }

  // getTenantsAll() {
  //   this.tenantService.getTenantsAll(this.requestReadPermissions).subscribe((res: any) => {
  //     this.tenants = res.record;
  //     this.params = { ...this.params, tenant_id: this.tenants[0].id };
  //     this.getBetHistoeies();
  //     if (this.tenants.length > 0) {
  //       this.getTenantCurrencies(this.tenants[0].id);
  //     }
  //   });
  // }

  getTenantCurrencies(tenant_id: number) {
    this.tenantService.getTenantCurrencies(tenant_id, 'tenant', this.requestReadPermissions).subscribe((res: any) => {
      this.currencies = res.record;
    });
  }

  changeType(type: string) {
    this.params = { ...this.params, type };
  }

  changeTenant(tenant_id: any) {
    this.p = 1;
    this.params = { ...this.params, page: 1, tenant_id, subscriber_id: '', currency_code: '' };
    this.getBetHistoeies();
    this.getTenantCurrencies(tenant_id);
  }

  changeSubscriber(subscriber_id: any) {
    this.p = 1;
    this.params = { ...this.params, page: 1, subscriber_id, tenant_id: '', currency_code: '', search: '' };
    this.getBetHistoeies();
  }

  selectDateRange(time_period: any) {
    this.params = { ...this.params, ...time_period }
    this.getBetHistoeies();
  }

  filter(evt: any) {  
    this.p = 1;
    this.params = { ...this.params, page: this.p };
    this.getBetHistoeies();
  }

  resetFilter() {
    setTimeout(() => {
      $('#time_period').val('');
    }, 100);

    this.p = 1;

    this.params = {
      ...this.params,
      size: this.pageSizes[0].name,
      page: 1,
      // tenant_id: this.superAdminAuthService.superAdminTokenValue && this.superAdminAuthService.superAdminTokenValue.length > 0 ? this.tenants[0].id : '',
      bet_type: '',
      search: '',
      currency_code: '',
      start_date: '',
      end_date: '',
      result: '',
      freebet: '',
      autobet: '',
      sort_by: 'created_at',
      order: 'desc'
    }

    if (this.authService.adminTypeValue === AdminType.Super && this.params.type === AdminType.Tenant) {
      this.changeTenant(this.params.tenant_id);
      // setTimeout(() => {
      //   $('#tenant_id').val(this.tenants[0].id).change();
      // }, 100);
    } else {
      this.getBetHistoeies();
    }

  }

  pageChanged(page: number) {
    this.params.page = page;
    this.getBetHistoeies();
  }

  getBetHistoeies() {
    console.log(this.params);
    this.betService.getBetHistoryById(this.params).subscribe((res: any) => {
      this.betHistories = res.record.bet.data;
      this.total = res.record.bet.total;
      this.user = res.record.user[0];
      
    });
  }


  setBetType(bet_type: number) {
    this.params.bet_type = bet_type;
    this.params.page = 1;
    this.p = 1;
    this.getBetHistoeies();
  }

  doTranslation() {
    this.translateService.get(Object.keys(this.translations)).subscribe(res => {
      this.translations = res;
      if(this.authService.adminTypeValue === AdminType.Subscriber){
      this.breadcrumbs = [
        { title: this.translations['PLAYERS'], path: '/users' },
        { title: this.translations['BET_HISTORY'], path: '/bets/bet-history' },
      ];
    }
    if(this.authService.adminTypeValue === AdminType.Super){
      this.breadcrumbs.push({ title: this.translations['SUBSCRIBER'], path: `/super-admin/subscribers/list/0` });
      this.breadcrumbs.push({ title: this.translations['BET_HISTORY'], path: '/bets/bet-history'  });
      // this.breadcrumbs = [
      //   { title: this.translations['SUBSCRIBER'], path: `/super-admin/subscribers/details/${this.user.subscriber_id}`},
      //   { title: this.translations['BET_HISTORY'], path: '/bets/bet-history' },
      // ];
    }
    });
  }

  setOrder(column: any) {
    this.p = 1;
    this.order = (this.order == 'asc' ? 'desc' : 'asc')
    
    this.params = { ...this.params, page: this.p, order: this.order, sort_by: column };
    this.getBetHistoeies();
  }

  get currentLang() {
    return localStorage.getItem('lang');
  }

}
