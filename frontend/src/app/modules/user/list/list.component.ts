import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Tenant, User } from 'src/app/models';
import { AdminAuthService } from '../../admin/services/admin-auth.service';
import { PlayerService } from '../user.service';
import { PageSizes } from 'src/app/shared/constants';

import Swal from 'sweetalert2';
import { SuperAdminAuthService } from '../../super-admin/services/super-admin-auth.service';
import { AlertService } from 'src/app/services/alert.service';
import { TranslateService } from "@ngx-translate/core";
import { SubscriberAuthService } from '../../subscriber-system/services/subscriber-auth.service';
import { SubscriberService } from '../../subscriber-system/services/subscriber.service';
import { forEach } from 'lodash';

declare const $: any;
// declare const toastr: any;

@Component({
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})

export class ListComponent implements OnInit {

  subscribers:any;

  selectedUsers: any[] = [];
  crmTemplates: any[] = [];
  crmTemplate: string = '';
  crmTemplateLoader: boolean = false;
  active=true;
  // adminId: number = 0;

  players: User[] = [];

  pageSizes = PageSizes;

  playerParams: any = {
    size: 10,
    page: 1,
    search: '',
    status: '',
    allUser: '',
    online_status: '',
    order: 'desc',
      sort_by: 'created_at'
    // adminId: this.adminId,
  };

  order='asc';
  playerP: number = 1;
  playerTotal: number = 0;
  adminType = 'super';

  translations = {
    "HOME": "",
    "USERS": "",
    "PLAYERS": "",
    "PLACEHOLDERS.SELECT_TENANT": "",
    "SENTENCES.CONFIRM_ARE_YOU_SURE": "",
    "SENTENCES.CONFIRM_ACTIVE": "",
    "SENTENCES.CONFIRM_IN_ACTIVE": "",
    "SENTENCES.CONFIRM_YES": "",
    "ACTION_BUTTON.CANCEL": "",
  }

  breadcrumbs: Array<any> = [];

  // Permission Variables
  requestReadPermissions = btoa(btoa('users|:|R'));
  requestUpdatePermissions = btoa(btoa('users|:|U'));
  canCreate = false;
  canEdit = false;
  canDelete = false;
  revenueData: any;
  winning_amount =0;
  bet_amount = 0;
  revenue = 0;

  constructor(
    private AlertService: AlertService,
    private route: ActivatedRoute,
    private adminAuthService: AdminAuthService,
    private playerService: PlayerService,
    public superAdminAuthService: SuperAdminAuthService,
    public subscriberAuthService: SubscriberAuthService,
    private translateService: TranslateService,
    private subscriberService: SubscriberService
  ) {
    // this.playerParams = {
    //   ...this.playerParams,
    //   adminId: this.adminId,
    // };
  }

  ngOnInit(): void {

    this.adminType = (this.superAdminAuthService.superAdminTokenValue && this.superAdminAuthService.superAdminTokenValue.length > 0) ? 'super' : (this.subscriberAuthService.subscriberAdminTokenValue && this.subscriberAuthService.subscriberAdminTokenValue.length > 0)  ? 'subscriber':'tenant';

    if (this.superAdminAuthService.superAdminTokenValue && this.superAdminAuthService.superAdminTokenValue.length > 0) {
      this.getSubscribersAll();
    } else {

      this.setPermissions();
      this.getPlayers();

      // this.adminAuthService.adminUser.subscribe((user: any) => {
      //   if (user && user.id) {
      //     this.adminId = user.id;
      //     this.playerParams = {
      //       ...this.playerParams,
      //       adminId: this.adminId,
      //     };
      //     this.getPlayers();
      //   }
      // });

    }

    this.doTranslation();
    this.translateService.onLangChange.subscribe(event => {
      this.doTranslation();
    });

  }


  getSubscribersAll() {
    this.subscriberService.getAllSubscribers(this.requestReadPermissions).subscribe((res: any) => {
      this.subscribers = res.record;
      this.changeSubscriber(this.subscribers[0].id);

    });
  }

  changeSubscriber(subscriber_id: any) {
    this.playerP = 1;
    this.playerParams = { ...this.playerParams, page: 1, subscriber_id };
    this.getPlayers();
  }

  changeCheckbox(event: Event) {
    if(this.active==true)
    this.playerParams = { ...this.playerParams, allUser:1};
    else
    this.playerParams = { ...this.playerParams, allUser:''};
    this.getPlayers();
  }

  setPermissions() {
    let loggedInUserPermissions: any = localStorage.getItem('permissions');
    loggedInUserPermissions = JSON.parse(atob(atob(loggedInUserPermissions)));

    this.canCreate = loggedInUserPermissions.users.includes('C');
    this.canEdit = loggedInUserPermissions.users.includes('U');
    this.canDelete = loggedInUserPermissions.users.includes('D');
  }

  // getPromotionals() {
  //   // category = 2 -> Promotional
  //   this.crmService.getPromotionals({ category: 2 }, this.requestReadPermissions).subscribe((res: any) => {
  //     this.crmTemplates = res.record;
  //   });
  // }

  playerPageChanged(page: number) {
    this.playerParams = { ...this.playerParams, page };
    this.getPlayers();
  }

  filterPlayers(evt: any) {
    this.playerP = 1;
    this.playerParams = { ...this.playerParams, page: this.playerP };
    this.getPlayers();
  }

  getPlayers() {
    this.playerParams.admin_type = this.adminType;
    if(this.subscriberAuthService.subscriberAdminTokenValue && this.subscriberAuthService.subscriberAdminTokenValue.length > 0){
    this.subscriberAuthService.subscriberAdminUser.subscribe((res: any) => {
      this.playerParams.subscriber_id = res.subscriber_id

    });
  }
    this.playerService
      .getAdminPlayer(this.playerParams, this.requestReadPermissions)
      .subscribe((res: any) => {
        if (this.superAdminAuthService.superAdminTokenValue && this.superAdminAuthService.superAdminTokenValue.length > 0) {

        this.players = res.record[0].users;
      }else{
        this.players = res.record.data;
        this.playerTotal = res.record.total;

      }
      });
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
      order: 'desc',
      sort_by: 'created_at'
      // adminId: this.adminId,
    };
    console.log(this.playerParams);
    

    // if (this.subscribers.length > 0) {
    //   this.playerParams = { ...this.playerParams, subscriber_id: this.subscribers[0].id };
    //   $('#subscriber_id').val(this.subscribers[0].id).change();
    // }

    this.getPlayers();
  }

  async updatePlayerStatus(player: User, status: number) {

    if ( await this.AlertService.swalConfirm(player.status ? this.translations['SENTENCES.CONFIRM_IN_ACTIVE'] : this.translations['SENTENCES.CONFIRM_ACTIVE']) ) {
        this.playerService
          .updateAdminPlayerStatus(player.id, status, this.requestUpdatePermissions)
          .subscribe((res: any) => {
            if (res?.message) {
              this.AlertService.success(res?.message);
              // toastr.success(res.message || 'Player updated successfully');
            }
           this.getPlayers();
          });
    }

    // Swal.fire({
    //   title: this.translations['SENTENCES.CONFIRM_ARE_YOU_SURE'],
    //   text: player.active ? this.translations['SENTENCES.CONFIRM_IN_ACTIVE'] : this.translations['SENTENCES.CONFIRM_ACTIVE'],
    //   icon: 'warning',
    //   showCancelButton: true,
    //   confirmButtonColor: '#3085d6',
    //   cancelButtonColor: '#d33',
    //   confirmButtonText: this.translations['SENTENCES.CONFIRM_YES'],
    //   cancelButtonText: this.translations['ACTION_BUTTON.CANCEL']
    // }).then((result) => {
    //   if (result.isConfirmed) {
    //     this.playerService
    //       .updateAdminPlayerStatus(player.id, status, this.requestUpdatePermissions)
    //       .subscribe((res: any) => {
    //         if (res?.message) {
    //           this.AlertService.success(res?.message);
    //           // toastr.success(res.message || 'Player updated successfully');
    //         }
    //         this.players = this.players.map((f: User) => {
    //           if (f.id == player.id) {
    //             f.active = player.active ? false : true;
    //           }
    //           return f;
    //         });
    //       });
    //   }
    // });
  }

  selectAllUsers(event: any) {
    this.selectedUsers = [];

    if (event.checked) {
      $('.cst-check').prop('checked', true);
      this.selectedUsers = [...this.selectedUsers, ...this.players];
    } else {
      $('.cst-check').prop('checked', false);
      this.selectedUsers = [];
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

  // setCrmTemplate() {

  //   if (!this.crmTemplate) {
  //     this.AlertService.error('SENTENCES.TEMPLATE_REQUIRED');
  //     // toastr.error('Please select Template');
  //     return;
  //   }

  //   this.crmTemplateLoader = true;

  //   this.crmService.setCrmTemplate({ users: this.selectedUsers.map(m => m.id), id: this.crmTemplate }, this.requestUpdatePermissions).subscribe((res: any) => {

  //     this.crmTemplateLoader = false;

  //     this.selectedUsers = [];
  //     this.crmTemplate = '';
  //     if (res?.message) {
  //       this.AlertService.success(res?.message);
  //       // toastr.success(res.message || 'Users Template updated successfully.');
  //     }
  //     $('.cst-check').prop('checked', false);

  //   }, err => this.crmTemplateLoader = false);
  // }

  doTranslation() {
    this.translateService.get(Object.keys(this.translations)).subscribe(res => {
      this.translations = res;
      this.breadcrumbs = [
        // { title: this.translations['HOME'], path: '/' },
        { title: this.translations['PLAYERS'], path: '/users' },
      ];

      $("#tenant_id").select2({
        placeholder: this.translations['PLACEHOLDERS.SELECT_TENANT'],
      });
    });
  }

  setOrder(column: any) {
    this.playerP = 1;
    this.order = (this.order == 'asc' ? 'desc' : 'asc')

    this.playerParams = { ...this.playerParams, page: this.playerP, order: this.order, sort_by: column };
    this.getPlayers();
  }

}
