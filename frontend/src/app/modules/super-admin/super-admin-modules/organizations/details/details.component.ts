import { AfterViewInit, Component, OnInit } from '@angular/core';
import { SuperAdminAuthService } from '../../../services/super-admin-auth.service';
import * as $ from "jquery";
import { DatePipe } from '@angular/common';
import { Currency } from 'src/app/models';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminAuthService } from '../../../../admin/services/admin-auth.service';
import { SubscriberAuthService } from '../../../../subscriber-system/services/subscriber-auth.service';
import { TranslateService } from '@ngx-translate/core';
import { SubscriberDashboardService } from '../../../../subscriber-dashboard/subscriber-dashboard.service';
import { SubscriberService } from '../../../../subscriber-system/services/subscriber.service';
import { TenantService } from 'src/app/modules/tenant/tenant.service';
import { CurrenciesService } from '../../currencies/currencies.service';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { of } from 'rxjs';

declare const $: any;
@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  providers: [DatePipe],
})

export class DetailsComponent implements OnInit, AfterViewInit {
  format: string = 'YYYY-MM-DD';
  time_period: string = 'all_time';
  id: number = 0;
  requestReadPermissions = btoa(btoa('subscribers|:|R'));
  startDate:any = this.getMonthStartDate().toISOString().split('T')[0];
  endDate:any = this.getMonthEndDate().toISOString().split('T')[0];
  params = {
    start_date: this.startDate,
    end_date: this.endDate,
    status: '',
    player_status: '',
    currency: 'TRY',
    organization: 0,

  };

  subscribers: any[] = [];
  currencies: Currency[] = [];
  currency: Currency | null = null;
  totalPlayers: any;
  totalSubscribers: any;
  profit = 0;
  bets: any;
  betStats: any;
  requestSubscriberReadPermissions = btoa(btoa('subscriber_credentials|:|R'));
  breadcrumbs: any[] = [];

  yourPackages: any[] = [];
  activePackages: any[] = [];
  isDfsActive: boolean = false;
  isSbActive: boolean = false;
  isSlotActive: boolean = false;

  constructor(
    private route: ActivatedRoute,
    public superAdminAuthService: SuperAdminAuthService,
    private subdashboardService: SubscriberDashboardService,
    private adminAuthService: AdminAuthService,
    private subscriberAuthService: SubscriberAuthService,
    private subscriberService: SubscriberService,
    private tenantService: TenantService,
    public datepipe: DatePipe,
    private translate: TranslateService,
    private currenciesService: CurrenciesService,
  ) {
    this.id = this.route.snapshot.params['id'];
    this.params.organization = this.id;
    this.doTranslation();

    this.translate.onLangChange.subscribe((event) => {
      this.doTranslation();
    });
  }
  getAllActivePackages(subscriber_id) {
    const params: any = {
      subscriber_id: '',
      tenant_id: '',
    };

    // if (this.isSubscriber) {
    //   params.subscriber_id = this.id;
    // } else {
    params.subscriber_id = subscriber_id;
    // }

  }

  ngOnInit(): void {
    if (
      this.superAdminAuthService.superAdminTokenValue &&
      this.superAdminAuthService.superAdminTokenValue.length > 0
    ) {
      // this.getSubscriberAll();
      this.getCurrencies();
      this.getData();
    } else if (
      this.subscriberAuthService.subscriberAdminTokenValue &&
      this.subscriberAuthService.subscriberAdminTokenValue.length > 0
    ) {
      // console.log("test")
      this.subscriberAuthService.subscriberAdminUser.subscribe((user: any) => {
        if (user.subscriber_id) {
          // this.currencies = user.wallets.map((m) => {
          //   m.code = m.currency_code;
          //   return m;
          // });
          this.getSubscriberCurrencies(user.subscriber_id);

          // this.params = {
          //   ...this.params,
          //   currency_code: this.currencies[0].code,
          //   subscriber_id: user.subscriber_id,
          // };

          // this.updateCurrency(this.params.currency_code);

          // this.setTimePeriod('all_time');
          // this.getAllActivePackages(user.subscriber_id);
        }
      });
    } else {

    }
  }

  ngAfterViewInit(): void {
    const that = this;

    setTimeout(() => {

      if (this.params.start_date && this.params.end_date) {
        $('#time_period').daterangepicker({
          startDate: new Date(this.params.start_date),
          endDate: new Date(this.params.end_date),
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
      // { title: this.translate.instant('HOME'), path: '/' },
      { title: this.translate.instant['ORGANIZATIONS'], path: '/super-admin/organizations' },
      { title: this.translate.instant('ORGANIZATION'), path: '/' },
    ];
  }

  clearDateRage() {
    $('#time_period').val('');
  }

  updateCurrency(code: string) {
    this.currency =
      this.currencies.find((f: Currency) => f.code == code) || null;
  }

  getCurrencies() {
    this.currenciesService.getCurrencies(this.requestReadPermissions).subscribe((res: any) => {
      this.currencies = res.record;
      console.log(res.record);
      
    });
  }

  getSubscriberAll() {
    this.subscriberService
      .getAllSubscribers(this.requestSubscriberReadPermissions)
      .subscribe((res: any) => {
        this.subscribers = res.record;

        if (this.subscribers.length > 0) {
          this.getSubscriberCurrencies(this.subscribers[0].id);
        }
      });
  }

  getSubscriberCurrencies(subscriber_id: any) {
    this.subscriberService
      .getSubscriber(subscriber_id, this.requestSubscriberReadPermissions)
      .subscribe((res: any) => {
        this.currencies = res.record.configurations;

        // this.params = {
        //   ...this.params,
        //   currency_code: this.currencies[0].code,
        //   subscriber_id,
        // };

        // this.updateCurrency(this.params.currency_code);

        this.setTimePeriod('all_time');
      });
    this.getAllActivePackages(subscriber_id);
  }

  getMonday() {
    const d = new Date();
    const day = d.getDay(),
      diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff));
  }

  getMonthStartDate() {
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth(), 2);
  }

  getMonthEndDate() {
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  }

  setTimePeriod(time_period: string) {
    this.time_period = time_period;

    this.params = { ...this.params };

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

    if(time_period.end_date <= '2000')
      this.params = { ...this.params ,start_date: '2001-11-31',  end_date: '2001-12-31'};
    (this.time_period = ''), (this.params = { ...this.params, ...time_period, });
    (this.time_period = ''), (this.params = { ...this.params, ...time_period });
    this.getData();
  }

  twoNum(num: number) {
    return num > 9 ? num : `0${num}`;
  }

  getData() {
    this.profit = 0;
    this.subdashboardService.getOrgDashboard(this.params).subscribe((res: any) => {     
      this.totalPlayers = res[0].record;
      this.totalSubscribers = res[1].record;
      this.betStats = res[2].record;
    });
  }

  resetFilter() {
    const that = this;
    setTimeout(() => {
      if (this.params.start_date && this.params.end_date) {
        $('#time_period').daterangepicker({
          startDate: new Date(this.params.start_date),
          endDate: new Date(this.params.end_date),
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
    }, 100);
    this.params = {
      start_date: this.startDate,
      end_date: this.endDate,
      status: '',
      player_status: '',
      currency: 'TRY',
      organization: this.id
    }
    this.getData();
  }
}

