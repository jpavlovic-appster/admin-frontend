import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Tenant, User } from 'src/app/models';
import { AdminAuthService } from '../../../admin/services/admin-auth.service';
import { PlayerService } from '../../../user/user.service'
import { PageSizes } from 'src/app/shared/constants';
import { SuperAdminAuthService } from '../../../super-admin/services/super-admin-auth.service';
import { AlertService } from 'src/app/services/alert.service';
import { TranslateService } from "@ngx-translate/core";
import { SubscriberAuthService } from '../../../subscriber-system/services/subscriber-auth.service';
import { CrashGameService } from '../../crash-game.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  tenants: Tenant[] = [];
  freeBets: any;
  selectedUsers: any[] = [];
  crmTemplates: any[] = [];
  crmTemplate: string = '';
  crmTemplateLoader: boolean = false;
  loading: boolean = false;

  // adminId: number = 0;

  players: User[] = [];

  pageSizes = PageSizes;

  playerParams: any = {
    size: 10,
    page: 1,
    search: '',
    status: '',
    order: 'desc',
    sort_by: 'start_time'
  };
  order='asc';
  playerP: number = 1;
  playerTotal: number = 0;
  adminType = 'super';
  file: any;
  translations = {
    "HOME": "",
    "USERS": "",
    "PLACEHOLDERS.SELECT_TENANT": "",
    "SENTENCES.CONFIRM_ARE_YOU_SURE": "",
    "SENTENCES.CONFIRM_ACTIVE": "",
    "SENTENCES.CONFIRM_IN_ACTIVE": "",
    "SENTENCES.CONFIRM_YES": "",
    "ACTION_BUTTON.CANCEL": "",
    'FREE_BETS': "",
  }

  breadcrumbs: Array<any> = [];

  // Permission Variables
  requestReadPermissions = btoa(btoa('users|:|R'));
  requestUpdatePermissions = btoa(btoa('users|:|U'));
  canCreate = false;
  canEdit = false;
  canDelete = false;


  constructor(
    private AlertService: AlertService,
    private route: ActivatedRoute,
    private adminAuthService: AdminAuthService,
    private playerService: PlayerService,
    public superAdminAuthService: SuperAdminAuthService,
    public subscriberAuthService: SubscriberAuthService,
    private translateService: TranslateService,
    private crashGameService: CrashGameService
  ) {

  }

  ngOnInit(): void {
    this.adminType = (this.superAdminAuthService.superAdminTokenValue && this.superAdminAuthService.superAdminTokenValue.length > 0) ? 'super' : (this.subscriberAuthService.subscriberAdminTokenValue && this.subscriberAuthService.subscriberAdminTokenValue.length > 0) ? 'subscriber' : 'tenant';
    this.setPermissions();
    this.getFreeBetRains();
    this.doTranslation();
    this.translateService.onLangChange.subscribe(event => {
      this.doTranslation();
    });
  }

  changeTenant(tenant_id: any) {
    this.playerP = 1;
    this.playerParams = { ...this.playerParams, page: 1, tenant_id };
    this.getFreeBetRains();
  }

  setPermissions() {
    let loggedInUserPermissions: any = localStorage.getItem('permissions');
    loggedInUserPermissions = JSON.parse(atob(atob(loggedInUserPermissions)));
    this.canCreate = loggedInUserPermissions.users.includes('C');
    this.canEdit = loggedInUserPermissions.users.includes('U');
    this.canDelete = loggedInUserPermissions.users.includes('D');
  }


  playerPageChanged(page: number) {
    this.playerParams = { ...this.playerParams, page };
    this.getFreeBetRains();
  }

  filterPlayers(evt: any) {
    this.playerP = 1;
    this.playerParams = { ...this.playerParams, page: this.playerP };
    this.getFreeBetRains();
  }

  getFreeBetRains() {
    this.playerParams.admin_type = this.adminType;
    this.subscriberAuthService.subscriberAdminUser.subscribe((res: any) => {
      this.playerParams.subscriber_id = res.subscriber_id
      this.crashGameService
        .getFreeBetRains(this.playerParams, this.requestReadPermissions)
        .subscribe((res: any) => {
          this.freeBets = res.record.data;
          this.playerP = res.record.current_page;
          this.playerTotal = res.record.count;
        });
    });
  }

  async deleteEntry(id: any) {
    if (await this.AlertService.swalConfirm(this.translateService.instant('SENTENCES.CONFIRM_DELETE'))) {

      this.crashGameService.deleteFreeBetRain(id).subscribe((res: any) => {
        this.getFreeBetRains();
        if (res.message) {
          this.AlertService.success(res.message);
        }
      });
    }
  }

  playerResetFilter() {
    this.playerP = 1;
    this.playerParams = {
      size: 10,
      page: 1,
      search: '',
      status: '',
      order: 'desc',
      sort_by: 'start_time'
    };

    this.getFreeBetRains();
  }

  async updatePlayerStatus(player: User, status: number) {

    if (await this.AlertService.swalConfirm(player.active ? this.translations['SENTENCES.CONFIRM_IN_ACTIVE'] : this.translations['SENTENCES.CONFIRM_ACTIVE'])) {
      this.playerService
        .updateAdminPlayerStatus(player.id, status, this.requestUpdatePermissions)
        .subscribe((res: any) => {
          if (res?.message) {
            this.AlertService.success(res?.message);
            // toastr.success(res.message || 'Player updated successfully');
          }
          this.players = this.players.map((f: User) => {
            if (f.id == player.id) {
              f.active = player.active ? false : true;
            }
            return f;
          });
        });
    }
  }

  doTranslation() {
    this.translateService.get(Object.keys(this.translations)).subscribe(res => {
      this.translations = res;
      console.log(res);

      this.breadcrumbs = [
        { title: 'Free Bet Rain', path: '/free-bet-rain' },
      ];
    });
  }

  setOrder(column: any) {
    this.playerP = 1;
    this.order = (this.order == 'asc' ? 'desc' : 'asc')
    this.playerParams = { ...this.playerParams, page: this.playerP, order: this.order, sort_by: column };
    this.getFreeBetRains();
  }

}
