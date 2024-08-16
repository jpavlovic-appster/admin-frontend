import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart, Event as NavigationEvent } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Tenant, User, Admin, Currency } from 'src/app/models';
import { isAllowedPermission, truncateString } from 'src/app/services/utils.service';
import { Constants, PageSizes } from 'src/app/shared/constants';
import { AdminAuthService } from '../../admin/services/admin-auth.service';
import { PlayerService } from '../../user/user.service';
import { SuperAdminAuthService } from '../../super-admin/services/super-admin-auth.service';
import { TenantService } from 'src/app/modules/tenant/tenant.service';
import { AgentService } from '../agent.service';
import Swal from 'sweetalert2';
import { AlertService } from 'src/app/services/alert.service';
import { TranslateService } from '@ngx-translate/core';
declare const $: any;
// declare const toastr: any;

@Component({
  templateUrl: './admin-details.component.html',
  styleUrls: ['./admin-details.component.scss']
})

export class AdminDetailsComponent implements OnInit {

  permissionTitles: any;

  setting: any;

  isAdmin: boolean = false;

  pageSizes = PageSizes;

  settingForm: FormGroup | any;
  submitted: boolean = false;
  settingLoader: boolean = false;

  role: any;
  tenantId: any = 0;
  adminId: any = 0;
  tenant!: Tenant;
  admin: any = [];
  wallets: any = [];
  subAdmins: Admin[] = [];
  currencies: Currency[] = [];
  players: User[] = [];

  subAdminParams: any = {
    size: 10,
    page: 1,
    search: '',
    tenant_id: this.tenantId,
    adminId: this.adminId,
  };

  subAdminP: number = 1;
  subAdminTotal: number = 0;

  playerParams: any = {
    size: 10,
    page: 1,
    search: '',
    status: '',
    tenant_id: this.tenantId,
    adminId: this.adminId,
  };

  playerP: number = 1;
  playerTotal: number = 0;
  adminType: string = 'super';
  loginAdminUser: any = [];

  breadcrumbs: Array<any> = [];
  translations = {
    "HOME": "",
    "ADMINS": "",
    "DETAILS": "",
    "SENTENCES.CONFIRM_ARE_YOU_SURE": "",
    "SENTENCES.CONFIRM_DELETE": "",
    "SENTENCES.CONFIRM_ACTIVE": "",
    "SENTENCES.CONFIRM_IN_ACTIVE": "",
    "SENTENCES.CONFIRM_YES": "",
    "ACTION_BUTTON.CANCEL": "",
  }

  // Permission Varibales
  requestReadPermissions = btoa(btoa('admins|:|R'));
  requestUpdatePermissions = btoa(btoa('admins|:|U'));
  requestDisablePermissions = btoa(btoa('admins|:|disable'));
  requestDeletePermissions = btoa(btoa('admins|:|D'));

  // can access permissions
  // Own Access permissions
  canUserRead: boolean = false;
  canUserCreate: boolean = false;
  canUserEdit: boolean = false;
  canUserDelete: boolean = false;

  constructor(private route: ActivatedRoute,
    private AlertService: AlertService,
    private tenantService: TenantService,
    private agentService: AgentService,
    private playerService: PlayerService,
    public adminAuthService: AdminAuthService,
    private superAdminAuthService: SuperAdminAuthService,
    private formBuilder: FormBuilder,
    private translateService: TranslateService
  ) {

    this.settingForm = this.formBuilder.group({
      admin_user_id: ['', Validators.required],
      key: ['commission_percentage', [Validators.required]],
      value: ['', [Validators.required, Validators.min(1), Validators.max(100)]]
    });

  }

  ngOnInit(): void {

    this.setPermissions();

    this.route.paramMap.subscribe(params => {
      this.tenantId = params.get("tenantId");
      this.adminId = params.get("adminId");

      this.playerParams = {
        ...this.playerParams,
        tenant_id: this.tenantId,
        adminId: this.adminId,
      }

      this.subAdminParams = {
        ...this.subAdminParams,
        tenant_id: this.tenantId,
        adminId: this.adminId,
      }

      this.adminType = (this.superAdminAuthService.superAdminTokenValue && this.superAdminAuthService.superAdminTokenValue.length > 0) ? 'super' : 'tenant';

      this.f.admin_user_id.setValue(this.adminId);

      this.superAdminAuthService.superAdminUser.subscribe((admin: any) => {
        this.loginAdminUser = admin;
      });

      this.getAgent();
    });

    if (this.superAdminAuthService.superAdminTokenValue && this.superAdminAuthService.superAdminTokenValue.length > 0) {
      this.superAdminAuthService.superAdminUser.subscribe((superAdmin: any) => {
        if (superAdmin.role && superAdmin.role.length > 0 && superAdmin.role[0].id) {
          this.getPermissions(this.adminType, superAdmin.role[0].id);
        }
      });
    } else {
      this.adminAuthService.adminUser.subscribe((admin: any) => {
        if (admin.role && admin.role.length > 0 && admin.role[0].id) {
          this.getPermissions(this.adminType, admin.role[0].id);
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
    // this.canUserRead = loggedInUserPermissions.users.includes('R');
    // this.canUserCreate = loggedInUserPermissions.users.includes('C');
    // this.canUserEdit = loggedInUserPermissions.users.includes('U');
    // this.canUserDelete = loggedInUserPermissions.users.includes('D');

    this.canUserRead = isAllowedPermission('users', 'R');
    this.canUserCreate = isAllowedPermission('users', 'C');
    this.canUserEdit = isAllowedPermission('users', 'U');
    this.canUserDelete = isAllowedPermission('users', 'D');

  }

  getPermissions(type: string, role: number) {
    this.agentService.getPermissions(type, role, this.requestReadPermissions).subscribe((res: any) => {
      this.permissionTitles = res.record.permission_titles;
    });
  }

  setAdminId(adminId: number = this.admin.tenant_id) {
    this.adminId = adminId;

    this.playerParams = {
      ...this.playerParams,
      adminId: this.adminId,
    }

    this.subAdminParams = {
      ...this.subAdminParams,
      adminId: this.adminId,
    }

    this.getAgent();
  }

  getAgent() {
    this.getTenantAdmin();
    this.getTenant();
    this.getSubAdmins();
    this.getPlayers();
  }

  get f() {
    return this.settingForm.controls;
  }

  setSetting(setting: any) {
    this.setting = setting;
    // this.f.value.setValue(setting.value);
    this.settingForm.patchValue({
      admin_user_id: this.adminId,
      key: 'commission_percentage',
      value: setting.value
    })
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.settingForm.invalid) return;

    this.settingLoader = true;
    this.agentService.updateAdminAgentSetting(this.settingForm.value, this.requestUpdatePermissions)
      .subscribe((res: any) => {
        if (res?.message) {
          this.AlertService.success(res.message);
          // toastr.success(res.message || 'Setting updaed successfully.');
        }
        this.settingLoader = false;
        $('#modal-setting').modal('hide');

        if (res?.record?.id) {

          const setgInx = this.admin.setting.findIndex((f: any) => f.id === res.record.id);

          if (setgInx > -1) {
            this.admin.setting = this.admin.setting.map((m: any) => {
              if (this.setting && this.setting.id === m.id) {
                m.value = this.settingForm.value.value;
              }
              return m;
            });
          } else {
            this.admin.setting.push(res.record);
          }

        } else {
          this.getTenantAdmin();
        }


      }, (err: any) => {
        this.settingLoader = false;
      });
  }

  getTenant() {
    if (this.adminType === 'super' && this.tenantId > 0) {
      this.tenantService.getTenant(this.tenantId, this.requestDisablePermissions).subscribe((res: any) => {
        this.tenant = res.record.tenants;
        this.currencies = res.record.configurations;
        this.breadcrumbs = [
          // { title: 'Home', path: '/super-admin' },
          // { title: truncateString(this.tenant.name, 10), path: `/super-admin/tenants/details/${this.tenantId}` },
          // { title: 'Edit', path: `/super-admin/tenants/admin/${this.adminId}` },
          // { title: 'Tenants', path: '/super-admin/tenants' }
        ];

      });
    } else if (this.adminType === 'tenant') {
      this.adminAuthService.adminUser.subscribe((res: any) => {

        if (res?.tenant_id) {
          this.tenantService.getAdminTenant(res.tenant_id, this.requestReadPermissions).subscribe((res: any) => {
            this.currencies = res.record.configurations;
            this.tenant = res.record.tenants;
          });
        }

      });
    }
  }

  getTenantAdmin() {
    if (this.adminType === 'super') {
      this.agentService.getSuperAdminAgent(this.adminId, this.adminType, this.requestReadPermissions).subscribe((res: any) => {
        this.admin = res.record.admin;
        this.wallets = res.record.wallets;
        this.role = this.admin.role[0];
      });
    } else {
      this.isAdmin = true;
      this.agentService.getAdminAgent(this.adminId, this.adminType, this.requestReadPermissions).subscribe((res: any) => {
        this.admin = res.record.admin;
        this.wallets = res.record.wallets;
        this.role = this.admin.role[0];
        // console.log(this.admin.permissions);
      });
    }
  }

  subAdminPageChanged(page: number) {
    this.subAdminParams = { ...this.subAdminParams, page };
    this.getSubAdmins();
  }

  subAdminResetFilter() {
    this.subAdminP = 1;
    this.subAdminParams = {
      size: 10,
      page: 1,
      search: '',
      tenant_id: this.tenantId,
      adminId: this.adminId,
    };
    this.getSubAdmins();
  }

  filterSubAdmins(evt: any) {
    this.subAdminP = 1;
    this.subAdminParams = { ...this.subAdminParams, page: this.subAdminP };
    this.getSubAdmins();
  }

  filterPlayers(evt: any) {
    this.playerP = 1;
    this.playerParams = { ...this.playerParams, page: this.playerP };
    this.getPlayers();
  }

  getSubAdmins() {
    if (this.adminType === 'super') {
      this.subAdminParams = { ...this.subAdminParams, type: 'super' };
      this.agentService.getSuperSubAdmins(this.requestReadPermissions, this.subAdminParams).subscribe((res: any) => {
        this.subAdminParams.subadminUser = 1;
        this.subAdmins = res.record.data;
        this.subAdminTotal = res.record.count;
      });
    } else {
      this.subAdminParams = { ...this.subAdminParams, type: 'tenant' };
      this.subAdminParams.subadminUser = 1;
      this.agentService.getAdminAgents(this.subAdminParams, this.requestReadPermissions).subscribe((res: any) => {

        this.subAdmins = res.record.data;
        this.subAdminTotal = res.record.count;
      });
    }
  }

  playerPageChanged(page: number) {
    this.playerParams = { ...this.playerParams, page };
    this.getPlayers();
  }

  getPlayers() {
    this.playerParams.admin_type = this.adminType;
    if (this.adminType === 'super' && this.tenantId > 0) {
      this.playerService.getSuperAdminPlayer(this.playerParams, this.requestReadPermissions).subscribe((res: any) => {
        // console.log(res);
        this.players = res.record.data;
        this.playerTotal = res.record.count;
      });
    } else if (this.adminType === 'tenant') {
      this.playerService.getAdminPlayer(this.playerParams, this.requestReadPermissions).subscribe((res: any) => {
        // console.log(res);
        this.players = res.record.data;
        this.playerTotal = res.record.count;
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
      tenant_id: this.tenantId,
      adminId: this.adminId,
    };
    this.getPlayers();
  }

  getCurrency(id: number) {
    const currency = this.currencies.find((f: Currency) => f.id === id);
    return currency;
  }

  createSetting() {
    this.settingForm.patchValue({
      admin_user_id: this.adminId,
      key: 'commission_percentage',
      value: ''
    })
  }

  async deleteSetting(setting: any) {
    if (await this.AlertService.swalConfirm(this.translateService.instant('SENTENCES.CONFIRM_DELETE'))) {

        this.agentService.deleteAdminAgentSetting(setting.id, this.requestDeletePermissions).subscribe((res: any) => {
          if (res?.message) {
            this.AlertService.success(res.message);
            // toastr.success(res.message || 'Setting deleted successfully');
          }
          this.admin.setting = this.admin.setting.filter((f: any) => setting.id != f.id);
        });

    }
    
    // Swal.fire({
    //   title: this.translations['SENTENCES.CONFIRM_ARE_YOU_SURE'],
    //   text: this.translations['SENTENCES.CONFIRM_DELETE'],
    //   icon: 'warning',
    //   showCancelButton: true,
    //   confirmButtonColor: '#3085d6',
    //   cancelButtonColor: '#d33',
    //   confirmButtonText: this.translations['SENTENCES.CONFIRM_YES'],
    //   cancelButtonText: this.translations['ACTION_BUTTON.CANCEL']
    // }).then((result) => {
    //   if (result.isConfirmed) {

    //     this.agentService.deleteAdminAgentSetting(setting.id, this.requestDeletePermissions).subscribe((res: any) => {
    //       if (res?.message) {
    //         this.AlertService.success(res.message);
    //         // toastr.success(res.message || 'Setting deleted successfully');
    //       }
    //       this.admin.setting = this.admin.setting.filter((f: any) => setting.id != f.id);
    //     });

    //   }
    // });

    // if(confirm(`Are you sure you want to delete ${setting.key}`)) {
    //   this.agentService.deleteAdminAgentSetting(setting.id).subscribe((res: any) => {
    //     toastr.success(res.message || 'Setting deleted successfully' );
    //     this.admin.setting = this.admin.setting.filter((f: any) => setting.id != f.id);
    //   });
    // }
  }

  async updatePlayerStatus(player: User, status: number) {

    if (await this.AlertService.swalConfirm((player.active) ? this.translations['SENTENCES.CONFIRM_IN_ACTIVE'] : this.translations['SENTENCES.CONFIRM_ACTIVE'])) {

        this.playerService.updateAdminPlayerStatus(player.id, status, this.requestUpdatePermissions).subscribe((res: any) => {
          if (res?.message) {
            this.AlertService.success(res.message);
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
    
    // Swal.fire({
    //   title: this.translations['SENTENCES.CONFIRM_ARE_YOU_SURE'],
    //   text: (player.active) ? this.translations['SENTENCES.CONFIRM_IN_ACTIVE'] : this.translations['SENTENCES.CONFIRM_ACTIVE'],
    //   icon: 'warning',
    //   showCancelButton: true,
    //   confirmButtonColor: '#3085d6',
    //   cancelButtonColor: '#d33',
    //   confirmButtonText: this.translations['SENTENCES.CONFIRM_YES'],
    //   cancelButtonText: this.translations['ACTION_BUTTON.CANCEL']
    // }).then((result) => {
    //   if (result.isConfirmed) {

    //     this.playerService.updateAdminPlayerStatus(player.id, status, this.requestUpdatePermissions).subscribe((res: any) => {
    //       if (res?.message) {
    //         this.AlertService.success(res.message);
    //         // toastr.success(res.message || 'Player updated successfully');
    //       }
    //       this.players = this.players.map((f: User) => {
    //         if (f.id == player.id) {
    //           f.active = player.active ? false : true;
    //         }
    //         return f;
    //       });
    //     });

    //   }
    // });
  }

  async activeAgentStatus(admin: Admin) {

    if (await this.AlertService.swalConfirm(this.translateService.instant('SENTENCES.CONFIRM_ACTIVE'))) {

        this.agentService.activeAdminAgentStatus(admin.id, this.requestDisablePermissions).subscribe((res: any) => {
          if (res?.message) {
            this.AlertService.success(res.message);
            // toastr.success(res.message || 'Admin updated successfully');
          }
          this.subAdmins = this.subAdmins.map((f: Admin) => {
            if (f.id == admin.id) {
              f.active = true;
            }
            return f;
          });
        });

    }
    
    // Swal.fire({
    //   title: this.translations['SENTENCES.CONFIRM_ARE_YOU_SURE'],
    //   text: this.translations['SENTENCES.CONFIRM_ACTIVE'],
    //   icon: 'warning',
    //   showCancelButton: true,
    //   confirmButtonColor: '#3085d6',
    //   cancelButtonColor: '#d33',
    //   confirmButtonText: this.translations['SENTENCES.CONFIRM_YES'],
    //   cancelButtonText: this.translations['ACTION_BUTTON.CANCEL']
    // }).then((result) => {
    //   if (result.isConfirmed) {

    //     this.agentService.activeAdminAgentStatus(admin.id, this.requestDisablePermissions).subscribe((res: any) => {
    //       if (res?.message) {
    //         this.AlertService.success(res.message);
    //         // toastr.success(res.message || 'Admin updated successfully');
    //       }
    //       this.subAdmins = this.subAdmins.map((f: Admin) => {
    //         if (f.id == admin.id) {
    //           f.active = true;
    //         }
    //         return f;
    //       });
    //     });

    //   }
    // });

    // if(confirm(`Are you sure you want to Active ${admin.agent_name}`)) {
    //   this.agentService.activeAdminAgentStatus(admin.id).subscribe((res: any) => {
    //     toastr.success(res.message || 'Player updated successfully' );
    //     this.subAdmins = this.subAdmins.map((f: Admin) => {
    //       if(f.id == admin.id) {
    //         f.active =  true;
    //       }
    //       return f;
    //     });
    //   });
    // }
  }

  async deactiveAgentStatus(admin: Admin) {
    if (await this.AlertService.swalConfirm(this.translateService.instant('SENTENCES.CONFIRM_IN_ACTIVE'))) {

        this.agentService.deactiveAdminAgentStatus(admin.id, this.requestDisablePermissions).subscribe((res: any) => {
          if (res?.message) {
            this.AlertService.success(res.message);
            // toastr.success(res.message || 'Admin updated successfully');
          }
          this.subAdmins = this.subAdmins.map((f: Admin) => {
            if (f.id == admin.id) {
              f.active = false;
            }
            return f;
          });
        });

    }
    
    // Swal.fire({
    //   title: this.translations['SENTENCES.CONFIRM_ARE_YOU_SURE'],
    //   text: this.translations['SENTENCES.CONFIRM_IN_ACTIVE'],
    //   icon: 'warning',
    //   showCancelButton: true,
    //   confirmButtonColor: '#3085d6',
    //   cancelButtonColor: '#d33',
    //   confirmButtonText: this.translations['SENTENCES.CONFIRM_YES'],
    //   cancelButtonText: this.translations['ACTION_BUTTON.CANCEL']
    // }).then((result) => {
    //   if (result.isConfirmed) {

    //     this.agentService.deactiveAdminAgentStatus(admin.id, this.requestDisablePermissions).subscribe((res: any) => {
    //       if (res?.message) {
    //         this.AlertService.success(res.message);
    //         // toastr.success(res.message || 'Admin updated successfully');
    //       }
    //       this.subAdmins = this.subAdmins.map((f: Admin) => {
    //         if (f.id == admin.id) {
    //           f.active = false;
    //         }
    //         return f;
    //       });
    //     });

    //   }
    // });
  }


  // Permissions
  getPermissionsFromValue(value: any) {
    return value;
  }

  parsePermissionHeader(header: any) {
    return Constants.permissionHeaders[header];
  }

  doTranslation() {

    this.translateService.get(Object.keys(this.translations)).subscribe(res => {
      this.translations = res;
      this.breadcrumbs = [
        { title: this.translations['HOME'], path: '/' },
        { title: this.translations['ADMINS'], path: '/agents' },
        { title: this.translations['DETAILS'], path: '' }
      ];

    });


    // $("#tenant_id").select2({
    //   placeholder: this.translations['PLACEHOLDERS.SELECT_TENANT'],
    // });

  }

}
