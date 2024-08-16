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
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.scss']
})
export class PlayersComponent implements OnInit, AfterViewInit {
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

  playerParams: any = {
    size: 10,
    page: 1,
    search: '',
    status: '',
    online_status: '',
    allUser: '',
    subscriber_id: 0,
    order: 'desc',
    sort_by: 'created_at'
  };

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
    this.playerParams.subscriber_id = this.id;

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
    this.getPlayers();
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

  playerResetFilter() {
    this.playerP = 1;
    this.playerParams = {
      size: 10,
      page: 1,
      search: '',
      status: '',
      online_status: '',
      allUser: '',
      subscriber_id: this.id,
      order: 'desc',
      sort_by: 'created_at'
    };


    // if (this.subscribers.length > 0) {
    //   this.playerParams = { ...this.playerParams, subscriber_id: this.subscribers[0].id };
    //   $('#subscriber_id').val(this.subscribers[0].id).change();
    // }

    this.getPlayers();
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

  pageChange(page: number) {
    console.log("test")
    this.playerParams = { ...this.playerParams, page };
    this.getPlayers();
  }

  filterPlayers(evt: any) {
    this.playerP = 1;
    this.playerParams = { ...this.playerParams, page: this.playerP };
    this.getPlayers();
  }

  setOrder(column: any) {
    this.playerP = 1;
    this.order = (this.order == 'asc' ? 'desc' : 'asc')

    this.playerParams = { ...this.playerParams, page: this.p, order: this.order, sort_by: column };
    this.getPlayers();
  }

  getPlayers() {
    this.playerParams.admin_type = this.adminType;
    this.playerService
      .getAdminPlayer(this.playerParams, this.requestReadPermissions)
      .subscribe((res: any) => {
        // if (this.superAdminAuthService.superAdminTokenValue && this.superAdminAuthService.superAdminTokenValue.length > 0) {
        this.players = res.record.data;
        this.playerTotal = res.record.total;
       
      });
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

  twoNum(num: number) {
    return num > 9 ? num : `0${num}`;
  }
}
