import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Admin, Tenant, Wallet } from 'src/app/models';
import { AlertService } from 'src/app/services/alert.service';
import { encryptPassword } from 'src/app/services/utils.service';
import { CustomValidators } from 'src/app/shared/validators';
import { AdminAuthService } from '../../admin/services/admin-auth.service';
import { SuperAdminAuthService } from '../../super-admin/services/super-admin-auth.service';
import { AgentService } from '../agent.service';
import { TranslateService } from '@ngx-translate/core';
import { Constants } from 'src/app/shared/constants';

declare const $: any;
declare const toastr: any;

@Component({
  templateUrl: './edit-admin.component.html',
  styleUrls: ['./edit-admin.component.scss']
})

export class EditAdminComponent implements OnInit {

  currencyBool: boolean = false;
  // levelTwoAdmins: Admin[] = [];
  levelThreeAdmins: Admin[] = [];
  levelFourAdmins: Admin[] = [];
  levelFiveAdmins: Admin[] = [];

  wallets: Wallet[] = [];

  // levelTwoBool: boolean = false;
  levelThreeBool: boolean = false;
  levelFourBool: boolean = false;
  levelFiveBool: boolean = false;

  queryParams: any;

  tenantId: number = 0;
  adminId: number = 0;
  admin: any = [];
  tenant!: Tenant;
  phoneMinLen: number = 5;

  currencies: any = [];

  adminForm: FormGroup | any;
  submitted: boolean = false;
  adminLoader: boolean = false;

  title: string = 'ACTION_BUTTON.CREATE'

  breadcrumbs: Array<any> = [];

  loggedInUser: any;
  roles: any = [];
  permissions: any = [];
  permissionTitles: any = [];
  selectedPermissions: any = [];

  // Permission Varaibles
  requestReadPermissions = btoa(btoa('admins|:|R'));
  componentCreatePermissions = btoa(btoa('admins|:|C'));
  requestUpdatePermissions = btoa(btoa('admins|:|U'));
  canCreate = false;
  canEdit = false;
  translations = {
    "PLACEHOLDERS.SELECT_ROLE": "",
    "PLACEHOLDERS.SELECT_ADMIN": "",
    "PLACEHOLDERS.SELECT_SUPER_SENIOR": "",
    "PLACEHOLDERS.SELECT_SENIOR_MASTER": "",
    "PLACEHOLDERS.SELECT_MASTER_AGENT": "",
    "PLACEHOLDERS.SELECT_CURRENCY": "",
    "VALIDATION_MSGS.PERMISSION.REQUIRED": "",
    "VALIDATION_MSGS.PERMISSION.READ_REQUIRED": "",
  };

  constructor(private route: ActivatedRoute,
    private AlertService: AlertService,
    private router: Router,
    private formBuilder: FormBuilder,
    private agentService: AgentService,
    public superAdminAuthService: SuperAdminAuthService,
    public adminAuthService: AdminAuthService,
    public translateService: TranslateService,
  ) {
    this.tenantId = this.route.snapshot.params['tenantId'];
    this.adminId = this.route.snapshot.params['adminId'];

    this.adminForm = this.formBuilder.group({
      tenant_id: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(CustomValidators.emailRegEx)]],
      encrypted_password: ['', [Validators.pattern(CustomValidators.passwordRegex)]],
      agent_name: ['', [Validators.required]],
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.minLength(this.phoneMinLen), Validators.pattern(CustomValidators.phoneRegex)]],
      role: ['', [Validators.required]],
      currency_code: [''],
      status: [true],
      phone_verified: [false],
      permissions: ['', [Validators.required]],
      admin_type: ['', [Validators.required]],
    });

    if (this.adminId > 0) {
      this.title = 'ACTION_BUTTON.EDIT';

    } else {
      const passControl = this.adminForm.get('encrypted_password');
      passControl.setValidators([Validators.required, Validators.pattern(CustomValidators.passwordRegex)]);
      passControl.updateValueAndValidity();
    }

    this.f.admin_type.setValue((this.superAdminAuthService.superAdminTokenValue && this.superAdminAuthService.superAdminTokenValue.length > 0) ? 'super' : 'tenant');

    this.f.tenant_id.setValue(this.tenantId);

    this.getAdmin();

    if (this.f.admin_type.value === 'super') {

      this.agentService.getRoles(this.requestReadPermissions, this.f.admin_type.value).subscribe((res: any) => {
        this.roles = res.record;
      });

    } else {

      this.agentService.getRoles(this.requestReadPermissions, this.f.admin_type.value).subscribe((res: any) => {
        this.roles = res.record;
        this.roles = this.roles.filter((role) => {
          return role.abbr !== 'affiliate';
        });
      });

    }

    this.route.queryParams.subscribe(params => {
      // console.log('ihere', params);
      if (params.admin) {
        this.queryParams = params;

      }
    });

  }

  ngOnInit(): void {

    this.setPermissions();

    let that = this;
    $('#currency').on("select2:unselecting", function (e: any) {

      let canDelete = true;

      for (let c in that.admin.wallets) {
        if (that.admin.wallets[c].currency_code == e.params.args.data.element.value) {
          // toastr.error('Already added currencies cannot be removed');
          that.AlertService.error('SENTENCES.CURRENCY_CANNOT_REMOVED');
          canDelete = false;
          break;
        }
      }
      return canDelete;

    });

    if (this.f.admin_type.value === 'super') {
      this.superAdminAuthService.superAdminUser.subscribe((res: any) => {

        this.loggedInUser = res;
      });
    } else {
      this.adminAuthService.adminUser.subscribe((res: any) => {

        this.loggedInUser = res;
      });
    }

    this.doTranslations();
    this.translateService.onLangChange.subscribe(event => {
      this.doTranslations();
    });

  }

  ngAfterViewInit(): void {

    this.placeHolderTranslations();

    // $("#roles").select2({
    //   placeholder: this.translations['PLACEHOLDERS.SELECT_ROLE'],
    // });
    // $("#select-admin").select2({
    //   placeholder: this.translations['PLACEHOLDERS.SELECT_ADMIN'],
    // });
    // $("#select-super-senior").select2({
    //   placeholder: this.translations['PLACEHOLDERS.SELECT_SUPER_SENIOR'],
    // });
    // $("#select-senior-master").select2({
    //   placeholder: this.translations['PLACEHOLDERS.SELECT_SENIOR_MASTER'],
    // });
    // $("#select-master-agent").select2({
    //   placeholder: this.translations['PLACEHOLDERS.SELECT_MASTER_AGENT'],
    // });
  }

  setPermissions() {
    let loggedInUserPermissions: any = localStorage.getItem('permissions');
    loggedInUserPermissions = JSON.parse(atob(atob(loggedInUserPermissions)));

    this.canCreate = loggedInUserPermissions.admins.includes('C');
    this.canEdit = loggedInUserPermissions.admins.includes('U');
  }

  getAdmin() {
    if (this.f.admin_type.value === 'super') {
      this.agentService.getSuperAdminAgent(this.adminId, this.f.admin_type.value, this.requestReadPermissions).subscribe((res: any) => {
        if (this.adminId > 0) {
          this.admin = res.record.admin;
          this.setValue();
        }
        // if (res.record.wallets) {
        //   this.currencies = res.record.wallets;
        // }

      });
    } else {
      this.agentService.getAdminAgent(this.adminId, this.f.admin_type.value, this.requestReadPermissions).subscribe((res: any) => {

        if (this.adminId > 0) {
          this.admin = res.record.admin;
          this.setValue();

          this.currencyBool = true;
          setTimeout(() => {
            $("#currency").val(this.admin.wallets.map((currency) => currency.currency.code)).trigger('change');
          }, 500);

        }
        if (res.record.wallets) {
          this.wallets = res.record.wallets;
          this.currencies = this.wallets;
        }

      });
    }
  }

  setValue() {

    this.adminForm.patchValue({
      email: this.admin.email,
      agent_name: this.admin.agent_name,
      first_name: this.admin.first_name,
      last_name: this.admin.last_name,
      phone: this.admin.phone,
      role: this.admin.role[0].id,
      currency_code: this.admin.currency_code,
      phone_verified: this.admin.phone_verified,
      status: this.admin.active
    });

    setTimeout(() => {
      // if (this.f.admin_type.value === 'tenant') {
      //   $("#currency").val(this.admin.wallets.map((currency) => currency.currency.code)).trigger('change');
      // }
      $("#roles").val(this.admin.role[0].id).prop('disabled', true).trigger('change');
    }, 500);


  }

  changeRoles(role: any) {

    this.f.role.setValue(role);
    this.selectedPermissions = {};

    const selectedRole = this.roles.find(f => f.id == role);

    if (this.f.admin_type.value === 'super') {
      this.levelThreeBool = false;
      this.adminForm.removeControl('super_admin_id');

      this.agentService.getPermissions(this.f.admin_type.value, role, this.requestReadPermissions).subscribe((res: any) => {
        this.permissions = res.record.permissions;
        this.permissionTitles = res.record.permission_titles;

        this.setRoleWisePermissions(role, this.permissions);

      });
    } else {

      this.adminForm.removeControl('super_senior_id');
      this.adminForm.removeControl('senior_master_id');
      this.adminForm.removeControl('master_agent_id');

      this.levelThreeBool = false;
      this.levelFourBool = false;
      this.levelFiveBool = false;

      this.agentService.getPermissions(this.f.admin_type.value, role, this.requestReadPermissions).subscribe((res: any) => {

        this.permissions = res.record.permissions;
        this.permissionTitles = res.record.permission_titles;

        this.setRoleWisePermissions(role, this.permissions);
      });

    }

    if (this.adminId == 0) {

      if (this.roles && (selectedRole.id === this.roles[0]?.id || selectedRole.id === this.roles[1]?.id)) {
        this.currencies = this.wallets;
      } else {
        this.addField(selectedRole.level);
      }

      this.changeCurrency('');
      $('#currency').val('').trigger('change');

    }

  }

  addField(level: number) {
    // const level = tsRole.level;
    // const currenctRole = this.roles[0];

    if (this.f.admin_type.value === 'super') {

      this.superAdminAuthService.superAdminUser.subscribe((user: any) => {
        if (user.id && user.role && user.role.length > 0) {
          this.getAdmins(user.id, user.role[0].level + 1);
        }
      });

      switch (level) {
        // case 2:
        //   this.adminForm.addControl('super_id', new FormControl('', [Validators.required]));
        //   break;
        case 3:
          // this.adminForm.addControl('super_id', new FormControl('', [Validators.required]));
          this.adminForm.addControl('super_admin_id', new FormControl('', [Validators.required]));
          break;
      }

    } else if (this.f.admin_type.value === 'tenant') {

      this.adminAuthService.adminUser.subscribe((user: any) => {
        if (user.id && user.role && user.role.length > 0) {
          this.loggedInUser = user;
          this.currencyBool = false;
          this.getAdmins(user.id, user.role[0].level + 1);

          if (this.loggedInUser && this.loggedInUser.role[0].level) {

            if (this.loggedInUser.role[0].level == 1) {
              switch (level) {
                // case 2:
                //   this.adminForm.addControl('admin_id', new FormControl('', [Validators.required]));
                //   break;

                case 3:
                  // this.adminForm.addControl('admin_id', new FormControl('', [Validators.required]));
                  this.adminForm.addControl('super_senior_id', new FormControl('', [Validators.required]));
                  break;

                case 4:
                  // this.adminForm.addControl('admin_id', new FormControl('', [Validators.required]));
                  this.adminForm.addControl('super_senior_id', new FormControl('', [Validators.required]));
                  this.adminForm.addControl('senior_master_id', new FormControl('', [Validators.required]));
                  break;

                case 5:
                  // this.adminForm.addControl('admin_id', new FormControl('', [Validators.required]));
                  this.adminForm.addControl('super_senior_id', new FormControl('', [Validators.required]));
                  this.adminForm.addControl('senior_master_id', new FormControl('', [Validators.required]));
                  this.adminForm.addControl('master_agent_id', new FormControl('', [Validators.required]));
                  break;
              }
            } else if (this.loggedInUser.role[0].level == 2) {
              switch (level) {

                case 4:
                  this.adminForm.addControl('senior_master_id', new FormControl('', [Validators.required]));
                  break;

                case 5:
                  this.adminForm.addControl('senior_master_id', new FormControl('', [Validators.required]));
                  this.adminForm.addControl('master_agent_id', new FormControl('', [Validators.required]));
                  break;
              }
            } else if (this.loggedInUser.role[0].level == 3) {
              switch (level) {

                case 5:
                  this.adminForm.addControl('master_agent_id', new FormControl('', [Validators.required]));
                  break;
              }
            }

          }

        }
      });

    }

  }

  selectAdmin(evt: any, level: number) {

    const role = this.roles.find(f => f.id == this.f.role.value);

    if (evt.value && role) {

      // if (level < arr.length) {
      if (role.level > level) {

        this.currencyBool = false;
        this.getAdmins(evt.value, level);

        if (level === 3) {
          this.f.senior_master_id.setValue('');
        } else if (level === 4) {
          this.f.master_agent_id.setValue('');
        }

      } else {
        this.changeCurrency('');
        $('#currency').val('').trigger('change');

        this.getCurrencies(evt);
      }

    } else {
      this.currencyBool = false;
      this.changeCurrency('');
      $('#currency').val('').trigger('change');

      if (level === 3) {
        this.levelFourBool = false;
        this.levelFiveBool = false;
      } else if (level === 4) {
        this.levelFiveBool = false;
      }

    }

  }

  getAdmins(id: number, level: number) {
    this.agentService.getAllAdmins(this.f.admin_type.value, id, level, this.f.role.value, this.requestReadPermissions).subscribe((res: any) => {

      if (level === 2) {
        this.levelThreeAdmins = res.record;
        this.levelThreeBool = true;

        this.levelFourBool = false;
        this.levelFiveBool = false;
      } else if (level === 3) {
        this.levelFourBool = true;
        this.levelFourAdmins = res.record;

        this.levelFiveBool = false;
      } else if (level === 4) {
        this.levelFiveBool = true;
        this.levelFiveAdmins = res.record;
      }

    });
  }

  setRolePermissions(evt: any) {
    this.selectedPermissions = {};
    const admin: any = [...this.levelThreeAdmins, ...this.levelFourAdmins, ...this.levelFiveAdmins].find(f => f.id == evt.value);

    if (admin) {
      this.permissions = admin.permissions;
      this.setRoleWisePermissions(this.f.role.value, this.permissions);
    }
  }

  getCurrencies(data: any) {

    this.setRolePermissions(data);

    if (data.value) {
      this.currencyBool = true;

      this.agentService.getAdminAgent(data.value, this.f.admin_type.value, this.requestReadPermissions).subscribe((res: any) => {

        if (res.record.wallets) {
          this.currencies = res.record.wallets;
        }

      });
    }
  }

  setRoleWisePermissions(role, permissions) {

    if (role == this.loggedInUser.role[0].id || this.adminId > 0) {
      if (this.adminId > 0 && this.admin.role[0].id == role) {
        this.selectedPermissions = this.admin.permissions;
      } else {
        this.selectedPermissions = Object.assign({}, permissions);
      }
    }
  }

  changeCurrency(currency: any) {
    this.f.currency_code.setValue(currency);
  }

  get f() {
    return this.adminForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid

    this.f.permissions.setErrors({ 'required': null });

    // console.log(this.adminForm.value);
    let isPermissionSelected = false;
    for (let sp in this.selectedPermissions) {
      if (this.selectedPermissions[sp].length > 0) {
        isPermissionSelected = true;
        break;
      }
    }

    if (isPermissionSelected) {
      this.f.permissions.setValue(JSON.stringify(this.selectedPermissions));
    } else {
      this.f.permissions.setErrors({
        'required': this.translations["VALIDATION_MSGS.PERMISSION.REQUIRED"]
      });
    }

    if (this.adminForm.invalid) return;

    this.adminLoader = true;
    const data = this.adminForm.value;

    if (data.encrypted_password) {
      data.encrypted_password = encryptPassword(data.encrypted_password);
    }

    if (this.adminId > 0) {
      data.id = this.adminId;

      if (this.f.admin_type.value === 'super') {

        this.agentService.updateSuperAdminAgent(data, this.requestUpdatePermissions)
          .subscribe((response: any) => {
            if (response?.message) {
              this.AlertService.success(response.message);
              // toastr.success(response?.message || 'Tenant Admin Updated Successfully!');
            }
            this.adminLoader = false;
          }, (err: any) => {
            this.adminLoader = false;
          });

      } else {

        this.agentService.updateAdminAgent(data, this.requestUpdatePermissions)
          .subscribe((response: any) => {
            if (response?.message) {
              this.AlertService.success(response.message);
              // toastr.success(response?.message || 'Admin Updated Successfully!');
            }
            this.adminLoader = false;
          }, (err: any) => {
            this.adminLoader = false;
          });

      }

    } else {

      if (this.f.admin_type.value === 'super') {
        this.agentService.addSuperAdminAgent(this.adminForm.value, this.componentCreatePermissions)
          .subscribe((response: any) => {
            if (response?.message) {
              this.AlertService.success(response.message);
              // toastr.success(response?.message || 'Tenant Admin Created Successfully!');
            }
            this.router.navigate(['/agents']);
            this.adminLoader = false;
          }, (err: any) => {
            this.adminLoader = false;
          });
      } else {
        this.agentService.addAdminAgent(this.adminForm.value, this.componentCreatePermissions)
          .subscribe((response: any) => {
            if (response?.message) {
              this.AlertService.success(response.message);
              // toastr.success(response?.message || 'Admin Created Successfully!');
            }
            this.router.navigate(['/agents']);
            this.adminLoader = false;
          }, (err: any) => {
            this.adminLoader = false;
          });
      }

    }
  }

  getPermissionsFromValue(value: any) {
    return value;
  }

  parsePermissionHeader(header: any) {

    return Constants.permissionHeaders[header];
    // return header.replaceAll('_', ' ');
  }

  isEmptyPermission(value: any) {
    return value.length > 0;
  }

  isPermissionSelected(header: any, permission: any) {
    return (this.selectedPermissions[header]) ? this.selectedPermissions[header].includes(permission) : false;
  }

  togglePermission(header: any, permission: any) {

    let isRemoved = false;
    if (!this.selectedPermissions[header]) {
      this.selectedPermissions[header] = [];
    }

    if (permission !== "R" && !this.selectedPermissions[header].includes("R")) {
      toastr.error(this.translations['VALIDATION_MSGS.PERMISSION.READ_REQUIRED']);
      return;
    }

    this.selectedPermissions[header] = this.selectedPermissions[header].filter((p) => {
      if (p == permission) {
        isRemoved = true;
        return false;
      }
      return true;
    });

    if (isRemoved) {

      if (permission === "R") {
        this.selectedPermissions[header] = [];
      }

    } else {
      this.selectedPermissions[header].push(permission);
    }

  }

  // tree
  roletree() {

    $("#agent_tree").jstree("destroy");

    const admins = [...this.levelThreeAdmins, ...this.levelFourAdmins, ...this.levelFiveAdmins];

    const data = [
      this.getTreeUser(this.loggedInUser, '#')
    ];

    if (this.f.admin_type.value === 'super') {

      if (this.f.super_admin_id && this.f.super_admin_id.value) {

        const sadmin = admins.find(f => f.id == this.f.super_admin_id.value);
        data.push(this.getTreeUser(sadmin, data[data.length - 1].id));

      }

    } else {

      let tssadmin: any = {};
      let tsmadmin: any = {};
      let tmaadmin: any = {};

      if (this.f.super_senior_id && this.f.super_senior_id.value) {

        tssadmin = admins.find(f => f.id == this.f.super_senior_id.value);
        data.push(this.getTreeUser(tssadmin, data[data.length - 1].id));

      }

      if (this.f.senior_master_id && this.f.senior_master_id.value) {

        tsmadmin = admins.find(f => f.id == this.f.senior_master_id.value);
        data.push(this.getTreeUser(tsmadmin, data[data.length - 1].id));

      }

      if (this.f.master_agent_id && this.f.master_agent_id.value) {

        tmaadmin = admins.find(f => f.id == this.f.master_agent_id.value);
        data.push(this.getTreeUser(tmaadmin, data[data.length - 1].id));

      }

    }

    setTimeout(() => {
      data.push({ a_attr: { style: "color: green; height: 25px;" }, id: 0, parent: data[data.length - 1].id, text: `${this.f.first_name.value} ${this.f.last_name.value}` });
    }, 10);

    setTimeout(() => {

      $('#agent_tree').jstree({
        core: {
          animation: 0,
          check_callback: true,
          themes: { stripes: false, theme: "proton" },
          data
        },
        // types: {
        //   default: {
        //     icon: "fa fa-plus"
        //   }
        // },
        // plugins: ['themes', 'types', 'contextmenu']
      });

      // $('#agent_tree').on('loaded.jstree', function () {
      //   if ($('#agent_tree li').length == 0) {
      //     $('#agent_tree').html('<h4>No subagents present for this agent</h4>')
      //     return;
      //   }
      //   $('#agent_tree').jstree('select_node', 'ul > li:first');
      // });

      // $('#agent_tree').on("select_node.jstree", function (e: any, data: any) {

      //     const id = data.node.original.id;

      //     if (data.node.state.opened) {
      //       $('#agent_tree').jstree().close_node(id);
      //       $('#agent_tree').jstree().set_icon(id, 'fa fa-plus')
      //       return;
      //     }

      //     if (data.node.children != 0) {
      //       $('#agent_tree').jstree().open_node(id);
      //       $('#agent_tree').jstree().set_icon(id, 'fa fa-minus')
      //       return;
      //     }

      // });

    }, 100);

  }

  getTreeUser(user, parent) {
    return { a_attr: { style: "color: green; height: 25px;" }, id: user.id, parent, text: `${user.first_name} ${user.last_name}` };
  }

  get isTree() {

    if (this.f.admin_type.value === 'super' && this.f.first_name.value && this.f.last_name.value) {

      if (this.f.super_admin_id) {
        if (this.f.super_admin_id.value) { return true; } else { return false; }
      }

      return true;

    } else if (this.f.admin_type.value === 'tenant' && this.f.first_name.value && this.f.last_name.value && this.f.currency_code.value && this.f.currency_code.value.length > 0) {

      return true;

    } else {
      return false;
    }

  }

  doTranslations() {

    let translationsKeys = Object.keys(this.translations);

    this.translateService.get(translationsKeys).subscribe(res => {
      this.translations = res;
    });

    this.breadcrumbs = [
      { title: this.translateService.instant('HOME'), path: '/' },
      { title: this.translateService.instant('ADMIN'), path: '/agents' },
      // { title: this.translateService.instant('ACTION_BUTTON.CREATE'), path: '/agents' },
    ];

    if (this.adminId > 0) {
      this.breadcrumbs.push({ title: this.translateService.instant('ACTION_BUTTON.EDIT'), path: '/agents' });
    } else {
      this.breadcrumbs.push({ title: this.translateService.instant('ACTION_BUTTON.CREATE'), path: '/agents' });
    }

    this.placeHolderTranslations();

  }

  placeHolderTranslations() {
    $("#roles").select2({
      placeholder: this.translations['PLACEHOLDERS.SELECT_ROLE'],
    });
    $("#select-admin").select2({
      placeholder: this.translations['PLACEHOLDERS.SELECT_ADMIN'],
    });
    $("#select-super-senior").select2({
      placeholder: this.translations['PLACEHOLDERS.SELECT_SUPER_SENIOR'],
    });
    $("#select-senior-master").select2({
      placeholder: this.translations['PLACEHOLDERS.SELECT_SENIOR_MASTER'],
    });
    $("#select-master-agent").select2({
      placeholder: this.translations['PLACEHOLDERS.SELECT_MASTER_AGENT'],
    });
  }

}
