import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Currency, Subscriber, Credentials, Admin } from 'src/app/models';
import { TenantService } from 'src/app/modules/tenant/tenant.service';
import { PlayerService } from 'src/app/modules/user/user.service';
import { isAllowedPermission } from 'src/app/services/utils.service';
import { PageSizes } from 'src/app/shared/constants';
import { environment } from 'src/environments/environment';
import { SubscriberService } from '../../../../subscriber-system/services/subscriber.service';
import * as $ from "jquery";
import { SubscriberDashboardService } from 'src/app/modules/subscriber-dashboard/subscriber-dashboard.service';

@Component({
  templateUrl: './subscriber-detail.component.html',
  styleUrls: ['./subscriber-detail.component.scss'],
})
export class SubscriberDetailComponent implements OnInit, AfterViewInit {
  tab='subscriber';
  id: number = 0;
  subscriber!: Subscriber;

  users: Admin[] = [];
  packages: any[] = [];
  pageSizes = PageSizes;
  params: any = {
    size: 10,
    page: 1,
    subscriber_id: 0,
    search: '',
  };

  adminType = 'super';
  p: number = 1;
  total: number = 0;

  order = 'asc';
  playerP: number = 1;
  playerTotal: number = 0;

  configurationsCurrencies: Currency[] = [];
  credentials: Credentials[] = [];
  setting: any;
  crashGameSetting: any;
  remainingCredentials: any[] = [];
  sportsSetting: any;

  breadcrumbs: Array<any> = [
    // { title: 'Home', path: '/super-admin' },
    // { title: 'Subscribers', path: '/super-admin/subscribers' },
    // { title: 'Details', path: '/super-admin/subscribers' }
  ];

  // Permission Variables
  requestReadPermissions = btoa(btoa('subscribers|:|R'));
  canEditSubscriber = false;
  canReadSportSettings = false;
  canEditSportSettings = false;
  canReadCredentials = false;
  canEditCredentials = false;
  canReadPackages = false;
  canEditPackages = false;
  configDataResult;
  scriptData;
  hostname;
  players: any;

  constructor(
    private route: ActivatedRoute,
    public tenantService: TenantService,
    private subscriberService: SubscriberService,
    private translate: TranslateService,
    private playerService: PlayerService,
    private subdashboardService: SubscriberDashboardService,
    private http: HttpClient
  ) {
    this.id = this.route.snapshot.params['id'];
    this.params.subscriber_id = this.id;
    this.doTranslation();

    this.translate.onLangChange.subscribe((event) => {
      this.doTranslation();
    });
    this.http
      .get(environment.STATIC_URL + 'public/json/' + environment.DOCUMENTATION_FILE)
      .subscribe((res) => {
        this.configDataResult = res;
        console.log(
          '--- result :: ',
          this.configDataResult.tenant.pointers.description
        );

        this.http
          .get(environment.STATIC_URL + this.configDataResult.subscriber.sdk.script_path, {
            responseType: 'text',
          })
          .subscribe((data) => (this.scriptData = data));

      });
  }

  ngOnInit(): void {
    this.getSubscriber();
    this.getSubscriberAdmins();
    this.setPermissions();    
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.clearDateRage();
    }, 100);
  }

  doTranslation() {
    this.breadcrumbs = [
      {
        title: this.translate.instant('SUBSCRIBERS'),
        path: '/super-admin/subscribers/list/0',
      },
      {
        title: this.translate.instant('DETAILS'),
        path: '/super-admin/subscribers/list/0',
      },
    ];
  }

  setPermissions() {
    this.canEditSubscriber = isAllowedPermission('subscribers', 'U');
    this.canReadSportSettings = isAllowedPermission('subscriber_settings', 'R');
    this.canEditSportSettings = isAllowedPermission('subscriber_settings', 'U');
    this.canReadCredentials = isAllowedPermission(
      'subscriber_credentials',
      'R'
    );
    this.canEditCredentials = isAllowedPermission(
      'subscriber_credentials',
      'U'
    );

    this.canReadPackages = isAllowedPermission('subscriber_packages', 'R');
    this.canEditPackages = isAllowedPermission('subscriber_packages', 'U');

  }

  getSubscriber() {
    
    this.subscriberService
      .getSubscriber(this.id, this.requestReadPermissions)
      .subscribe((res: any) => {
        this.currencies = res.record.configurations;
        this.subscriber = res.record;
        this.sportsSetting = res.record.sports_bet_setting;
        this.crashGameSetting = res.record.crash_game_setting;
        this.credentials = res.record.credentials;
        this.configurationsCurrencies = res.record.configurations;
        
        // this.hostname = new URL(this.subscriber.domain).hostname
        
        
        // if (this.hostname == "") {
        //   this.hostname = "domain.com"
        // }
      });
  }

  pageChanged(page: number) {

    this.params = { ...this.params, page };
    this.getSubscriberAdmins();
  }


  getSubscriberAdmins() {
    this.subscriberService
      .getSubscriberAdmins(this.params, this.requestReadPermissions)
      .subscribe((res: any) => {
        this.users = res.record.data;
        this.total = res.record.total;
      });
  }


  getPrimary(primary) {
    return (
      this.configurationsCurrencies.find((f) => f.code == primary)?.name || ''
    );
  }

  format: string = 'YYYY-MM-DD';
  time_period: string = 'all_time';

  subscribers: any[] = [];
  currencies: Currency[] = [];
  currency: Currency | null = null;

  totalPlayers: any;
  profit: any;


  clearDateRage() {
    $('#time_period').val('');
  }

  updateCurrency(code: string) {
    this.currency =
      this.currencies.find((f: Currency) => f.code == code) || null;
  }

  twoNum(num: number) {
    return num > 9 ? num : `0${num}`;
  }

}
