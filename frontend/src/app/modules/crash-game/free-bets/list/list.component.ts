import { Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Tenant, User } from 'src/app/models';
import { AdminAuthService } from '../../../admin/services/admin-auth.service';
import { PlayerService } from '../../../user/user.service'
import { PageSizes } from 'src/app/shared/constants';

import { SuperAdminAuthService } from '../../../super-admin/services/super-admin-auth.service';
import { TenantService } from '../../../tenant/tenant.service';
import { AlertService } from 'src/app/services/alert.service';
import { TranslateService } from "@ngx-translate/core";
import { SubscriberAuthService } from '../../../subscriber-system/services/subscriber-auth.service';
import { CrashGameService } from '../../crash-game.service';

declare const $: any;
// declare const toastr: any;

@Component({
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})

export class ListComponent implements OnInit {

  tenants: Tenant[] = [];
  freeBets:any;
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
    sort_by: 'created_at'
  };

  order = 'asc';
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
    'FREE_BETS':"",
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
    private tenantService: TenantService,
    private translateService: TranslateService,
    private crashGameService: CrashGameService
  ) {

  }

  ngOnInit(): void {

    this.adminType = (this.superAdminAuthService.superAdminTokenValue && this.superAdminAuthService.superAdminTokenValue.length > 0) ? 'super' : (this.subscriberAuthService.subscriberAdminTokenValue && this.subscriberAuthService.subscriberAdminTokenValue.length > 0)  ? 'subscriber':'tenant';

    if (this.superAdminAuthService.superAdminTokenValue && this.superAdminAuthService.superAdminTokenValue.length > 0) {
      this.getTenantsAll();
    } else {

      this.setPermissions();
      this.getFreeBets();
    }

    this.doTranslation();
    this.translateService.onLangChange.subscribe(event => {
      this.doTranslation();
    });

  }


  getTenantsAll() {
    this.tenantService.getTenantsAll(this.requestReadPermissions).subscribe((res: any) => {
      this.tenants = res.record;
      this.changeTenant(this.tenants[0].id);
    });
  }

  changeTenant(tenant_id: any) {
    this.playerP = 1;
    this.playerParams = { ...this.playerParams, page: 1, tenant_id };
    this.getFreeBets();
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
    this.getFreeBets();
  }

  filterPlayers(evt: any) {
    this.playerP = 1;
    this.playerParams = { ...this.playerParams, page: this.playerP };
    this.getFreeBets();
  }

  getFreeBets() {
    this.playerParams.admin_type = this.adminType;
    this.subscriberAuthService.subscriberAdminUser.subscribe((res: any) => {
      this.playerParams.subscriber_id = res.subscriber_id
      console.log(this.playerParams);
      this.crashGameService
      .getFreeBets(this.playerParams, this.requestReadPermissions)
      .subscribe((res: any) => {
        console.log(res.record.data);

        this.freeBets = res.record.data;
        this.playerP = res.record.current_page;
        this.playerTotal = res.record.count;

      });

    });


  }
 async deleteEntry(id:any){
if ( await this.AlertService.swalConfirm(this.translateService.instant('SENTENCES.CONFIRM_DELETE')) ) {

  this.crashGameService.deleteFreeBet(id).subscribe((res: any) => {
    console.log(res.message);

    this.getFreeBets();
    if (res.message) {
      this.AlertService.success(res.message);
      // toastr.success('Templates Deleted Successfully');
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
      sort_by: 'num_of_free_bets'
      // adminId: this.adminId,
    };

    if (this.tenants.length > 0) {
      this.playerParams = { ...this.playerParams, tenant_id: this.tenants[0].id };
      $('#tenant_id').val(this.tenants[0].id).change();
    }

    this.getFreeBets();
  }

  async updatePlayerStatus(player: User, status: number) {

    if ( await this.AlertService.swalConfirm(player.active ? this.translations['SENTENCES.CONFIRM_IN_ACTIVE'] : this.translations['SENTENCES.CONFIRM_ACTIVE']) ) {
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

 

  selectUser(event: any, user: User) {

    if (event.checked) {
      this.selectedUsers.push(user);
      if (this.selectedUsers.length === this.players.length) {
        $('.cst-check').prop('checked', true);
      }
    } else {
      this.selectedUsers = this.selectedUsers.filter(f => f.id != user.id);
      $('#checkboxPrimary').prop('checked', false);
    }

  }

  // unSelectUser(user: User) {
  //   $(`#checkboxPrimary${user.id}`).prop('checked', false);
  //   $('#checkboxPrimary').prop('checked', false);

  //   this.selectedUsers = this.selectedUsers.filter(f => f.id != user.id);
  // }

 

  doTranslation() {
    this.translateService.get(Object.keys(this.translations)).subscribe(res => {
      this.translations = res;
      console.log(res);

      this.breadcrumbs = [
        // { title: this.translations['HOME'], path: '/' },
        { title: this.translations['FREE_BETS'], path: '/free-bets' },
      ];

      $("#tenant_id").select2({
        placeholder: this.translations['PLACEHOLDERS.SELECT_TENANT'],
      });
    });
  }

  onChange(event) {
    this.file = event.target.files[0];
    const extension = this.file.name.split('.')[1].toLowerCase();
    if (extension != 'xlsx') {
      event.target.value = null;
        return;
    }
  }

onUpload() {

  this.crashGameService.upload(this.file).subscribe(
      (event: any) => {
          if (typeof (event) === 'object') {
            //  this.getFreeBets();
            this.AlertService.success("Successfully imported data");
            this.getFreeBets();
              // Short link via api response
              // this.shortLink = event.link;

              // this.loading = false; // Flag variable
          }
      }
  );
}

setOrder(column: any) {
  this.playerP = 1;
  this.order = (this.order == 'asc' ? 'desc' : 'asc')
  this.playerParams = { ...this.playerParams, page: this.playerP, order: this.order, sort_by: column };
  this.getFreeBets();
}

}
