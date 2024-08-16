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

declare const $: any;
@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit , AfterViewInit {
  id: number = 0;
  subscriber!: Subscriber;

  startDate:any = this.getMonthStartDate().toISOString().split('T')[0];
  endDate:any = this.getMonthEndDate().toISOString().split('T')[0];

  users: Admin[] = [];
  packages: any[] = [];
  pageSizes = PageSizes;

  accountParams = {
    start_date: this.startDate,
    end_date: this.endDate,
    status: '',
    player_status: '',
    subscriber_id: 0,
    currency: ''
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
  betStats:any;

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
    this.accountParams.subscriber_id = this.id;

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
    this.setPermissions();    
  }

  ngAfterViewInit(): void {
    const that = this;

    setTimeout(() => {

      if (this.accountParams.start_date && this.accountParams.end_date) {
        $('#time_period').daterangepicker({
          startDate: new Date(this.accountParams.start_date),
          endDate: new Date(this.accountParams.end_date),
          locale: {
            format: this.format
          }
        }, function (start: any, end: any) {
          const start_date = start.format(that.format);
          const end_date = end.format(that.format);
          that.selectDateRange({ start_date, end_date });
        });
      } else {
        $('#time_period').val('');
      }
    }, 50);
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
        this.accountParams.currency = this.currencies[0].code;
        this.subscriber = res.record;
        this.sportsSetting = res.record.sports_bet_setting;
        this.crashGameSetting = res.record.crash_game_setting;
        this.credentials = res.record.credentials;
        this.configurationsCurrencies = res.record.configurations;
        
        // this.hostname = new URL(this.subscriber.domain).hostname
        
        
        // if (this.hostname == "") {
        //   this.hostname = "domain.com"
        // }
        this.getData();
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

 


  setTimePeriod(time_period: string) {
    this.time_period = time_period;

    this.accountParams = { ...this.accountParams };

    switch (time_period) {
      case 'all_time':
        // this.params = {
        //   ...this.params,
        //   start_date: '',
        //   end_date: '',
        // };

        break;

      case 'today':
        // this.params = {
        //   ...this.params,
        //   start_date: new Date().toISOString().split('T')[0],
        //   end_date: new Date().toISOString().split('T')[0],
        // };

        break;

      case 'yesterday':
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        // this.params = {
        //   ...this.params,
        //   start_date: yesterday.toISOString().split('T')[0],
        //   end_date: yesterday.toISOString().split('T')[0],
        // };

        break;

      case 'weekly':
        // this.params = {
        //   ...this.params,
        //   start_date: this.getMonday().toISOString().split('T')[0],
        //   end_date: new Date().toISOString().split('T')[0],
        // };

        break;

      case 'last_week':
        const today = new Date();
        const sundayOfWeek = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() - today.getDay() + 1
        );
        const mondayOfWeek = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() - today.getDay() - 5
        );

        // this.params = {
        //   ...this.params,
        //   start_date: mondayOfWeek.toISOString().split('T')[0],
        //   end_date: sundayOfWeek.toISOString().split('T')[0],
        // };

        break;

      case 'monthly':
        // this.params = {
        //   ...this.params,
        //   start_date: this.getMonthStartDate().toISOString().split('T')[0],
        //   end_date: new Date().toISOString().split('T')[0],
        // };

        break;

      case 'last_month':
        const date = new Date();

        // this.params = {
        //   ...this.params,
        //   start_date: new Date(date.getFullYear(), date.getMonth() - 1, 2)
        //     .toISOString()
        //     .split('T')[0],
        //   end_date: new Date(date.getFullYear(), date.getMonth(), 1)
        //     .toISOString()
        //     .split('T')[0],
        // };

        break;

      default:
        // this.params = {
        //   ...this.params,
        //   start_date: '',
        //   end_date: '',
        // };

        break;
    }

    this.clearDateRage();
    this.getData();
  }

  currencyFilter(evt: any) {
    this.updateCurrency(evt.target.value);
    this.getData();
  }

  filter(evt: any) {
    this.getData();
  }

  selectDateRange(time_period: any) {
    if(time_period.end_date <= '2000'){
      this.accountParams = { ...this.accountParams ,start_date: '2001-11-31',  end_date: '2001-12-31'};
      this.profit = 0;
    }
     else{
      (this.time_period = ''), (this.accountParams = { ...this.accountParams, ...time_period });
      this.getData();
     }

  }

  twoNum(num: number) {
    return num > 9 ? num : `0${num}`;
  }

  getMonthStartDate() {
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth(), 2);
  }

  getMonthEndDate() {
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  }

  getData() {
    console.log(this.accountParams);
    this.subdashboardService.getAccountDetails(this.accountParams).subscribe((res: any) => {
      this.totalPlayers = res[0].record;
      this.betStats = res[1].record;
    });
  }

  resetFilter() {
    const that = this;
    setTimeout(() => {
      if (this.accountParams.start_date && this.accountParams.end_date) {
        $('#time_period').daterangepicker({
          startDate: new Date(this.accountParams.start_date),
          endDate: new Date(this.accountParams.end_date),
          locale: {
            format: this.format
          }
        }, function (start: any, end: any) {
          const start_date = start.format(that.format);
          const end_date = end.format(that.format);
          that.selectDateRange({ start_date, end_date });
        });
      } else {
        $('#time_period').val('');
      }
      $('#currencies').val('TRY');
      $('#currencies').val(this.currencies[0].code);
    }, 100);
    this.accountParams = {
      start_date: this.startDate,
      end_date: this.endDate,
      status: '',
      player_status: '',
      subscriber_id: this.id,
      currency: this.currencies[0].code,
    }
    this.getData();
  }
}
