import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuperAdminAuthService } from '../../super-admin/services/super-admin-auth.service';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/models';
import { PlayerService } from '../user.service';
import Swal from 'sweetalert2';
import { AdminAuthService } from '../../admin/services/admin-auth.service';
import { AlertService } from 'src/app/services/alert.service';
import { TranslateService } from '@ngx-translate/core';

declare const $: any;
// declare const toastr: any;

@Component({
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
  setting: any;
  isAdmin: boolean = true;
  settingForm: FormGroup | any;
  submitted: boolean = false;
  settingLoader: boolean = false;

  ncbForm: FormGroup | any;
  ncbSubmitted: boolean = false;
  ncbLoader: boolean = false;
  ncbType: string = 'Deposit';

  document: any;
  rejForm: FormGroup | any;
  rejSubmitted: boolean = false;
  rejLoader: boolean = false;

  player!: User;

  playerId: number = 0;
  tenantId: number = 0;

  keys: Array<any> = [
    { name: 'Betting limit', value: 'betting_limit' },
    { name: 'Deposit limit', value: 'deposit_limit' },
  ];

  translations = {
    'HOME': '',
    'USERS': '',
    'PLAYERS': '',
    'DETAILS': '',
    "SENTENCES.CONFIRM_ARE_YOU_SURE": "",
    "SENTENCES.CONFIRM_DELETE": "",
    "SENTENCES.CONFIRM_APPROVE": "",
    "SENTENCES.CONFIRM_YES": "",
    "ACTION_BUTTON.CANCEL": "",
  };

  breadcrumbs: Array<any> = [];

  // Permission Variables
  requestReadPermissions = btoa(btoa('users|:|R'));
  requestUpdatePermissions = btoa(btoa('users|:|U'));
  canEdit = false;
  canDeposit = false;
  canWithdraw = false;

  constructor(
    private AlertService: AlertService,
    private route: ActivatedRoute,
    private playerService: PlayerService,
    private superAdminAuthService: SuperAdminAuthService,
    public adminAuthService: AdminAuthService,
    private formBuilder: FormBuilder,
    private translateService: TranslateService
  ) {
    this.playerId = this.route.snapshot.params['id'];

    this.settingForm = this.formBuilder.group({
      user_id: ['', Validators.required],
      key: ['betting_limit', [Validators.required]],
      value: ['', [Validators.required, Validators.min(1)]],
      duration: ['', [Validators.required, Validators.min(1)]],
      description: ['', [Validators.required]],
    });

    this.ncbForm = this.formBuilder.group({
      wallet_id: ['', Validators.required],
      non_cash_amount: ['', [Validators.required, Validators.min(1)]],
    });

    this.rejForm = this.formBuilder.group({
      reason: ['', Validators.required],
      user_id: ['', Validators.required],
      document_id: ['1', Validators.required],
      status: ['rejected', Validators.required],
    });

    this.rejf.user_id.setValue(this.playerId);

    this.f.user_id.setValue(this.playerId);
  }

  ngOnInit(): void {

    this.setPermissions();

    // if (this.superAdminAuthService.superAdminTokenValue && this.superAdminAuthService.superAdminTokenValue.length > 0) {
    //   this.isAdmin = false;
    //   this.tenantId = this.route.snapshot.queryParams['tenant_id'];
    //   this.getSuperPlayer();
    // } else {
    //   this.getPlayer();
    // }
    this.getPlayer();
    this.doTranslation();
    this.translateService.onLangChange.subscribe(event => {
      this.doTranslation();
    });
  }

  setPermissions() {
    let loggedInUserPermissions: any = localStorage.getItem('permissions');
    loggedInUserPermissions = JSON.parse(atob(atob(loggedInUserPermissions)));

    // this.canEdit = loggedInUserPermissions.users.includes('U');
    // this.canDeposit = loggedInUserPermissions.transactions.includes('deposit');
    // this.canWithdraw = loggedInUserPermissions.transactions.includes('withdrawal');
  }

  ngAfterViewInit(): void {
    const tab = history.state.tab;

    if (tab) {
      $('.nav-link').removeClass("active");
      $('.tab-pane').removeClass("active");
      $(`#${tab}`).addClass("active");
      $(`#${tab}l`).addClass("active");
    }

  }

  // getSuperPlayer() {
  //   this.playerService
  //     .getSuperPlayerById(this.playerId, this.tenantId, this.requestReadPermissions)
  //     .subscribe((res: any) => {
  //       this.player = res.record;
  //       this.ncb.wallet_id.setValue(this.player.wallet_id);
  //     });
  // }

  getPlayer() {
    this.playerService
      .getPlayer(this.playerId)
      .subscribe((res: any) => {
        this.player = res.record;
       
      });
  }

  get f() {
    return this.settingForm.controls;
  }

  get rejf() {
    return this.rejForm.controls;
  }

  setSetting(setting: any) {
    this.setting = setting;
    this.settingForm.patchValue({
      user_id: this.playerId,
      key: setting.key,
      value: setting.value,
      duration: setting.duration,
      description: setting.description,
    });
  }

  createNew() {
    this.setting = null;
    this.submitted = false;
    this.settingForm.patchValue({
      user_id: this.playerId,
      key: 'betting_limit',
      value: '',
      duration: '',
      description: '',
    });
  }

  get ncb() {
    return this.ncbForm.controls;
  }

  deposit() {
    this.ncbType = 'Deposit';
    this.ncb.non_cash_amount.setValue('');
  }

  withdraw() {
    this.ncbType = 'Withdraw';
    this.ncb.non_cash_amount.setValue('');
  }

  // onNCBSubmit() {
  //   this.ncbSubmitted = true;
  //   if (this.ncbForm.invalid) return;

  //   this.ncbLoader = true;

  //   if (this.ncbType === 'Deposit') {
  //     this.playerService.nonCashDeposit(this.ncbForm.value, this.requestCreatePermissions).subscribe(
  //       (res: any) => {
  //         toastr.success(res.message || 'Amount deposit successfully');
  //         this.player.non_cash_amount = `${parseFloat(this.player.non_cash_amount) +
  //           this.ncb.non_cash_amount.value
  //           }`;
  //         $('#modal-ncb').modal('hide');
  //         this.ncbSubmitted = false;
  //         this.ncbLoader = false;
  //       },
  //       (err) => {
  //         this.ncbSubmitted = false;
  //         this.ncbLoader = false;
  //       }
  //     );
  //   } else {
  //     this.playerService.nonCashWithdraw(this.ncbForm.value, this.requestCreatePermissions).subscribe(
  //       (res: any) => {
  //         toastr.success(res.message || 'Amount withdraw successfully');
  //         this.player.non_cash_amount = `${parseFloat(this.player.non_cash_amount) -
  //           this.ncb.non_cash_amount.value
  //           }`;
  //         $('#modal-ncb').modal('hide');
  //         this.ncbSubmitted = false;
  //         this.ncbLoader = false;
  //       },
  //       (err) => {
  //         this.ncbSubmitted = false;
  //         this.ncbLoader = false;
  //       }
  //     );
  //   }
  // }

  onSubmit() {
    this.f.user_id.setValue(this.playerId);
    this.submitted = true;
    // stop here if form is invalid
    if (this.settingForm.invalid) return;

    this.settingLoader = true;
    if (this.setting && this.setting.id > 0) {
      const data = this.settingForm.value;
      data.id = this.setting.id;

      // this.playerService
      //   .updateAdminPlayerSetting(this.playerId, data, this.requestUpdatePermissions)
      //   .subscribe(
      //     (res: any) => {
      //       if (res?.message) {
      //         this.AlertService.success(res.message);
      //         // toastr.success(res.message || 'Setting updated successfully.');
      //       }

      //       if (res?.record?.id) {
      //         this.player.setting = this.player.setting.map((m: any) => {
      //           if (this.setting && this.setting.id === m.id) {
      //             m.key = this.f.key.value;
      //             m.value = this.f.value.value;
      //             m.duration = this.f.duration.value;
      //             m.description = this.f.description.value;
      //           }
      //           return m;
      //         });
      //       } else {
      //         this.getPlayer();
      //       }

      //       this.resetSettingForm();
      //     },
      //     (err: any) => {
      //       this.settingLoader = false;
      //     }
      //   );
    } else {
      // this.playerService
      //   .createAdminPlayerSetting(this.settingForm.value, this.requestUpdatePermissions)
      //   .subscribe(
      //     (res: any) => {
      //       if (res?.message) {
      //         this.AlertService.success(res.message);
      //         // toastr.success(res.message || 'Setting created successfully.');
      //       }
      //       this.settingLoader = false;
      //       $('#modal-setting').modal('hide');
      //       this.resetSettingForm();

      //       if (res?.record?.id) {
      //         this.player.setting.push(res.record);
      //       } else {
      //         this.getPlayer();
      //       }
      //     },
      //     (err: any) => {
      //       this.settingLoader = false;
      //     }
      //   );
    }
  }

  resetSettingForm() {
    this.settingForm.reset();
    this.submitted = false;
    this.settingLoader = false;
    $('#modal-setting').modal('hide');
  }

  async deleteSetting(setting: any) {
    if ( await this.AlertService.swalConfirm(this.translateService.instant('SENTENCES.CONFIRM_DELETE')) ) {
        // this.playerService
        //   .deleteAdminPlayerSetting(setting.id, this.requestUpdatePermissions)
        //   .subscribe((res: any) => {
        //     if (res?.message) {
        //       this.AlertService.success(res.message);
        //       // toastr.success(res.message || 'Setting deleted successfully');
        //     }
        //     this.player.setting = this.player.setting.filter(
        //       (f: any) => setting.id != f.id
        //     );
        //   });
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
    //     this.playerService
    //       .deleteAdminPlayerSetting(setting.id, this.requestUpdatePermissions)
    //       .subscribe((res: any) => {
    //         if (res?.message) {
    //           this.AlertService.success(res.message);
    //           // toastr.success(res.message || 'Setting deleted successfully');
    //         }
    //         this.player.setting = this.player.setting.filter(
    //           (f: any) => setting.id != f.id
    //         );
    //       });
    //   }
    // });

    // if(confirm(`Are you sure you want to delete ${setting.key}`)) {
    //   this.playerService.deleteAdminPlayerSetting(setting.id).subscribe((res: any) => {
    //     toastr.success(res.message || 'Setting deleted successfully' );
    //     this.player.setting = this.player.setting.filter((f: any) => setting.id != f.id);
    //   });
    // }
  }

  async updatePlayerDocStatus(docs: any, status: string) {

    if ( await this.AlertService.swalConfirm(this.translateService.instant('SENTENCES.CONFIRM_APPROVE')) ) {
        const params = {
          user_id: this.playerId,
          document_id: docs.id,
          status,
        };

        // this.playerService
        //   .updatePlayerDocStatus(params, this.requestUpdatePermissions)
        //   .subscribe((res: any) => {
        //     if (res?.message) {
        //       this.AlertService.success(res.message);
        //       // toastr.success(
        //       //   res.message || 'Player Document updated successfully'
        //       // );
        //     }
        //     this.getPlayer();
        //   });
    }
    
    // Swal.fire({
    //   title: this.translations['SENTENCES.CONFIRM_ARE_YOU_SURE'],
    //   text: this.translations['SENTENCES.CONFIRM_APPROVE'],
    //   icon: 'warning',
    //   showCancelButton: true,
    //   confirmButtonColor: '#3085d6',
    //   cancelButtonColor: '#d33',
    //   confirmButtonText: this.translations['SENTENCES.CONFIRM_YES'],
    //   cancelButtonText: this.translations['ACTION_BUTTON.CANCEL']
    // }).then((result) => {
    //   if (result.isConfirmed) {
    //     const params = {
    //       user_id: this.playerId,
    //       document_id: docs.id,
    //       status,
    //     };

    //     this.playerService
    //       .updatePlayerDocStatus(params, this.requestUpdatePermissions)
    //       .subscribe((res: any) => {
    //         if (res?.message) {
    //           this.AlertService.success(res.message);
    //           // toastr.success(
    //           //   res.message || 'Player Document updated successfully'
    //           // );
    //         }
    //         this.getPlayer();
    //       });
    //   }
    // });

    // if(confirm(`Are you sure you want to ${status} it`)) {

    //   const params = {
    //     user_id: this.playerId,
    //     document_id: docs.id,
    //     status
    //   };

    //   this.playerService.updatePlayerDocStatus(params).subscribe((res: any) => {
    //     toastr.success(res.message || 'Player Document updated successfully' );
    //     this.player.user_documents = this.player.user_documents.map((f: any) => {
    //       if(f.id == docs.id) {
    //         f.status = status;
    //       }
    //       return f;
    //     });
    //   });
    // }
  }

  setPlayerDoc(doc: any) {
    this.document = doc;
    this.rejSubmitted = false;

    this.rejForm.patchValue({
      reason: '',
      user_id: this.playerId,
      document_id: doc.id,
      status: 'rejected',
    });
  }

  onSubmitPlayerDoc() {
    this.rejSubmitted = true;

    // console.log(this.rejForm.value);

    if (this.rejForm.invalid) return;
    this.rejLoader = true;

    // this.playerService.updatePlayerDocStatus(this.rejForm.value, this.requestUpdatePermissions).subscribe(
    //   (res: any) => {
    //     this.rejLoader = false;
    //     this.rejSubmitted = false;
    //     $('#modal-rej').modal('hide');
    //     this.getPlayer();
    //     if (res?.message) {
    //       this.AlertService.success(res.message);
    //       // toastr.success(res.message || 'Player Document updated successfully');
    //     }
    //   },
    //   (err) => {
    //     this.rejLoader = false;
    //   }
    // );
  }

  doTranslation() {
    this.translateService.get(Object.keys(this.translations)).subscribe(res => {
      this.translations = res;
      this.breadcrumbs = [
        { title: this.translations['HOME'], path: '/' },
        { title: this.translations['PLAYERS'], path: '/users' },
        { title: this.translations['DETAILS'], path: '/users' },
      ];
    });
  }
}
