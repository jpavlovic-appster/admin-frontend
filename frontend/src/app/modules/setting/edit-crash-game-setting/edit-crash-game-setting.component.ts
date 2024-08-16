import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminAuthService } from '../../admin/services/admin-auth.service';
import { SuperAdminAuthService } from '../../super-admin/services/super-admin-auth.service';
import { TenantService } from 'src/app/modules/tenant/tenant.service';
import { SubscriberAuthService } from '../../subscriber-system/services/subscriber-auth.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { AlertService } from 'src/app/services/alert.service';
import { TranslateService } from '@ngx-translate/core';

declare const toastr: any;

@Component({
  selector: 'app-edit-crash-game-setting',
  templateUrl: './edit-crash-game-setting.component.html',
  styleUrls: ['./edit-crash-game-setting.component.scss'],
})
export class EditCrashGameSettingComponent implements OnInit {
  helo: any;
  edit = true;
  editCurrency = true;
  setting: any;
  freeBetSettings : any;
  tab_name = 'min_bet';
  stId: number = 0;
  settingId: number = 0;
  min_bet: any;
  max_bet: any;
  settingForm: FormGroup | any;
  freeBetSettingForm: FormGroup | any;
  betSettingForm: FormGroup | any;
  submitted: boolean = false;
  submitted_rain: boolean = false;
  adminLoader: boolean = false;
  primary_currency: any;
  isSaveButton: any = true;

  translations = {
    HOME: '',
    SETTINGS: '',
  };

  breadcrumbs: Array<any> = [];

  // Permission Variables
  requestReadPermissions = btoa(btoa('tenant_settings|:|R'));
  requestUpdatePermissions = btoa(btoa('tenant_settings|:|U'));

  requestSubscriberReadPermissions = btoa(btoa('subscriber_settings|:|R'));
  requestSubscriberUpdatePermissions = btoa(btoa('subscriber_settings|:|U'));

  canEdit = false;

  subscriber: boolean = false;
  currencies: any;
  uId: any;
  mainArr: any;
  isErrorMsg: boolean = false;
  data: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private AlertService: AlertService,
    private formBuilder: FormBuilder,
    private tenantService: TenantService,
    public superAdminAuthService: SuperAdminAuthService,
    public adminAuthService: AdminAuthService,
    public subscriberAuthService: SubscriberAuthService,
    private authService: AuthenticationService,
    private translateService: TranslateService
  ) {
    this.stId = this.route.snapshot.params['stId'];
    this.settingId = this.route.snapshot.params['id'];

    this.subscriber = this.router.url.includes('subscribers');

    this.settingForm = this.formBuilder.group({
      max_odd: [0, [Validators.required ,  Validators.min(1.01)]],
      betting_period: [0, [Validators.required ,  Validators.min(4), Validators.max(20)]],
      min_odd: ['', [Validators.required]],
      house_edge: ['', [Validators.required,  Validators.min(1), Validators.max(100)]],
      min_auto_rate: ['', [Validators.required, Validators.min(1.01)]],
    });

    // this.freeBetSettingForm = this.formBuilder.group({
    //   check_bet_time_before_claim: ['', [Validators.required]],
    //   check_bet_amount_before_claim: ['', [Validators.required]],
    // });
  }

  ngOnInit(): void {
    this.setPermissions();
    this.tenantService
      .getTenantSportSettings()
      .subscribe((res: any) => {
        this.setting = res.record;
        if (this.superAdminAuthService.superAdminTokenValue && this.superAdminAuthService.superAdminTokenValue.length > 0) {
        this.setting = {
          min_odd: res.record[0].min_odds,
          max_odd: res.record[0].max_odds,
          betting_period: res.record[0].betting_period,
          min_auto_rate: res.record[0].min_auto_rate,
          house_edge: res.record[0].house_edge,
        };
        this.settingForm.patchValue(this.setting);
      }
      else{
        // this.tenantService.getFreeBetSettings(this.stId).subscribe((res: any) => {
        //   this.freeBetSettings = res.record[0];
        //   console.log(this.freeBetSettings);
          
        //   this.freeBetSettingForm.patchValue({
        //     check_bet_time_before_claim: this.freeBetSettings.check_bet_time_before_claim_in_minutes,
        //     check_bet_amount_before_claim: this.freeBetSettings.check_bet_amount_before_claim
        //   });
        // });
        this.tenantService
          .getTenantCrashGameSettingsCurrency(
            'min_bet',
            this.stId,
            this.subscriber
              ? this.requestSubscriberUpdatePermissions
              : this.requestUpdatePermissions
          )
          .subscribe((res: any) => {

            this.min_bet = res.record[0];
            this.min_bet = Object.entries(this.min_bet);

            this.min_bet = JSON.parse(res.record[0]['min_bet']);
            this.min_bet = Object.entries(this.min_bet);
          });
        this.tenantService
          .getTenantCrashGameSettingsCurrency(
            'max_bet',
            this.stId,
            this.subscriber
              ? this.requestSubscriberUpdatePermissions
              : this.requestUpdatePermissions
          )
          .subscribe((res: any) => {
            this.max_bet = res.record[0];
            this.max_bet = Object.entries(this.max_bet);

            this.max_bet = JSON.parse(res.record[0]['max_bet']);
            this.max_bet = Object.entries(this.max_bet);

          });
          this.getTenantCurrencies(this.tab_name);
        }
      });
    
    this.doTranslation();
    this.translateService.onLangChange.subscribe((event) => {
      this.doTranslation();
    });
  }

  setPermissions() {
    if (this.subscriber) {
      let loggedInUserPermissions: any = localStorage.getItem('permissions');
      loggedInUserPermissions = JSON.parse(atob(atob(loggedInUserPermissions)));

      this.canEdit = loggedInUserPermissions.subscriber_settings.includes('U');
    } else {
      let loggedInUserPermissions: any = localStorage.getItem('permissions');
      loggedInUserPermissions = JSON.parse(atob(atob(loggedInUserPermissions)));

      this.canEdit = loggedInUserPermissions.tenant_settings.includes('U');
    }
  }

  get f() {
    return this.settingForm.controls;
  }

  // get g() {
  //   return this.freeBetSettingForm.controls;
  // }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid

    if (this.settingForm.invalid) return;

    this.adminLoader = true;

    const data = this.settingForm.value;

    data.type = this.authService.adminTypeValue;
    console.log(this.settingForm.value);
    this.tenantService
      .updateTenantSportSettings(
        this.settingForm.value,
        this.subscriber
          ? this.requestSubscriberUpdatePermissions
          : this.requestUpdatePermissions
      )
      .subscribe(
        (res: any) => {
          if (res?.message) {
            this.AlertService.success(res.message);
          }

          this.adminLoader = false;
          this.router.navigate(['settings/crash-game/super-admin/1']);
        },
        (err) => (this.adminLoader = false)
      );
    this.edit = true;
  }

  doTranslation() {
    this.translateService
      .get(Object.keys(this.translations))
      .subscribe((res) => {
        this.translations = res;
        this.breadcrumbs = [
          { title: this.translations['SETTINGS'], path: '' },
        ];
      });
  }
  getTenantCurrencies(type) {
    this.tab_name = type;
    this.tenantService
      .getTenantCrashGameSettingsCurrency(
        type,
        this.stId,
        this.subscriber
          ? this.requestSubscriberUpdatePermissions
          : this.requestUpdatePermissions
      )
      .subscribe((res: any) => {
        this.currencies = res.record[0];
        this.currencies = Object.entries(this.currencies);

        this.currencies = JSON.parse(res.record[0][this.tab_name]);
        this.currencies = Object.entries(this.currencies);
      });
      this.editCurrency = true;
  }

  onChangeSetting(e, key) {
    let value = e.target.value;
    this.currencies.forEach((element, i) => {
      if (element[0] == key) {
        this.currencies[i][1] = value;
      }
    });
  }
  onSaveCurrencySetting() {
    var obj = null;
    this.isErrorMsg = false;
    for (var i = 0; i < this.currencies.length; i++) {

      if (this.currencies[i][1] == '' || this.currencies[i][1] == null) {
        this.AlertService.error('Please fill the field');
        return;
      }
      if(this.currencies[i][1]<1 && this.tab_name != 'max_profit') {
        this.AlertService.error('Cannot be less than 1');
        return;
        }
        if(this.currencies[i][1]<=0 && this.tab_name == 'max_profit') {
          this.AlertService.error('Cannot be less than or equal to 0');
          return;
          }
      if (this.tab_name == 'min_bet') {
        if (parseFloat(this.currencies[i][1]) > parseFloat(this.max_bet[i][1])) {
          this.AlertService.error('Cannot be greter than max bet');
          return;
        } else {
          this.min_bet[i][1] = this.currencies[i][1];
        }
      }
      if (this.tab_name == 'max_bet') {
        if (
          parseFloat(this.currencies[i][1]) < parseFloat(this.min_bet[i][1])
        ) {
          this.AlertService.error('Cannot be less than min bet');
          return;
        } else {
          this.max_bet[i][1] = this.currencies[i][1];
        }
      }
    }
    this.tenantService
      .updateCrashGameSettingsCurrency(
        this.subscriber,
        this.stId,
        this.tab_name,
        this.currencies,
        this.subscriber
          ? this.requestSubscriberUpdatePermissions
          : this.requestUpdatePermissions
      )
      .subscribe(
        (res: any) => {
          if (res?.message) {
            this.AlertService.success(res.message);
          }

          this.adminLoader = false;
        },
        (err) => (this.adminLoader = false)
      );
      this.editCurrency = true;
  }

  editForm() {
    this.edit = false;
  }

  // freeBetSubmitForm() {
  //   this.submitted_rain = true;
  //   if (this.freeBetSettingForm.invalid) return;

  //   this.data = this.freeBetSettingForm.value;
  //   this.data.id = this.stId;
  //   this.tenantService.updateFreeBetSetting(this.data)
  //   .subscribe((response: any) => {
  //     if (response?.message) {
  //       this.AlertService.success(response.message);
  //     }

  // });
  // }

  editCurrencyForm() {
    this.editCurrency = false;
  }
}
