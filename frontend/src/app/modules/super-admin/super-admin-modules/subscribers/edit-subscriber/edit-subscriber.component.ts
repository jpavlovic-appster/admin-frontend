import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Admin, Currency, Subscriber } from 'src/app/models';
import { TenantService } from 'src/app/modules/tenant/tenant.service';
import { Constants } from 'src/app/shared/constants';
import { AlertService } from 'src/app/services/alert.service';
import { CustomValidators } from 'src/app/shared/validators';
import { SubscriberService } from '../../../../subscriber-system/services/subscriber.service';
import { CurrenciesService } from '../../currencies/currencies.service';
import { IDeactivateComponent } from 'src/app/guards';
import { isAllowedPermission } from 'src/app/services/utils.service';
import { TranslateService } from '@ngx-translate/core';

declare const $: any;
// declare const toastr: any;

@Component({
  templateUrl: './edit-subscriber.component.html',
  styleUrls: ['./edit-subscriber.component.scss']
})

export class EditSubscriberComponent implements OnInit, IDeactivateComponent {

  subBool: boolean = true;
  packageBool: boolean = false;
  credentialBool: boolean = false;
  themeBool: boolean = false;
  sportSettingBool: boolean = false;
  adminBool: boolean = false;
  configBool: boolean = false;
  submitSuccessBool: boolean = false;

  remainingCredentials: any[] = [];

  sportsSetting: any;
  crashGameSetting: any;
  config:any;
  multi_bet:any;
  graph_colour: any;
  graph:any;

  allPackages: any[] = [];
  activePackages: any[] = [];

  format: string = "YYYY-MM-DD";
  minDate: any = new Date();
  langs:any;
  // imgURL: any;
  id: number = 0;

  currencies: Currency[] = [];
  primaryCurrency!: Currency;
  organizations:any;
  subscriber!: Subscriber;
  users: Admin[] = [];

  editForm: FormGroup | any;
  packages: FormArray | any;
  credentials: FormArray | any;

  submitted: boolean = false;
  submitted1: boolean = false;
  loader: boolean = false;
  selectLogo: File | null = null;

  theme: any = { ...Constants.THEME_MODES[0], theme_id: 0 };
  themeDisabled: boolean = false;

  title: string = 'Create';

  p: number = 1;
  total: number = 0;

  params: any = {
    size: 10,
    page: 1,
    search: '',
    subscriber_id: this.id
  };

  translations = {
    "HOME": "",
    "SUBSCRIBERS": "",
    "SENTENCES.CONFIRM_ARE_YOU_SURE": "",
    "SENTENCES.CONFIRM_LEAVE_PAGE": "",
    "SENTENCES.CONFIRM_YES": "",
    "ACTION_BUTTON.CANCEL": "",
  };

  breadcrumbs: Array<any> = [];

  // Permissions variables
  requestReadPermissions = btoa(btoa('subscribers|:|R'));
  componentCreatePermissions = btoa(btoa('subscribers|:|C'));
  requestUpdatePermissions = btoa(btoa('subscribers|:|U'));
  canCreate = false;
  canEdit = false;
  canEditSportSettings = false;
  loader_colour: any;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private AlertService: AlertService,
    private formBuilder: FormBuilder,
    private subscriberService: SubscriberService,
    private tenantService: TenantService,
    private currenciesService: CurrenciesService,
    private translateService: TranslateService,
  ) {
    this.id = this.route.snapshot.params['id'];

    this.params.subscriber_id = this.id;

    this.title = 'ACTION_BUTTON.CREATE';

    this.editForm = this.formBuilder.group({
      subscriber_name: ['', [Validators.required ,Validators.minLength(3)]],
      organization: ['', [Validators.required]],
      domain: ['', [Validators.required]],
      language: ['', [Validators.required]],
      primary_currency: [{ value: '', disabled: this.id > 0 }, [Validators.required]],
      currencies: ['', [Validators.required]],
      packages: this.formBuilder.array([]),
      auth_api: [''],
      credit_api: [''],
      rollback_api: [''],
      debit_api: [''],
      secret_key: [''],
      trader_id: ['', [Validators.required]],
      trader_preference: ['', [Validators.required]],
    });

    if (this.id > 0) {
      this.title = 'ACTION_BUTTON.EDIT';
      this.getSubscriber();
      this.getSubscriberAdmins();

    }

    this.breadcrumbs.push({ title: this.title, path: `/super-admin/subscribers/${this.id}` });

  }

  ngOnInit(): void {
    // this.getCredential();
    this.setPermissions();
    this.getCurrencies();
    this.getLanguages();
    this.getOrganizations();

    let that = this;

    if (this.id > 0) {

      $('#currencies').on("select2:unselecting", function (e: any) {

        let canDelete = true;
        for (let c in that.subscriber.configurations) {
          if (that.subscriber.configurations[c].id == e.params.args.data.id) {

            that.AlertService.error('SENTENCES.CURRENCY_CANNOT_REMOVED');
            // toastr.error('Already added currencies cannot be removed');

            canDelete = false;
            break;
          }
        }
        return canDelete;

      });

    }

    this.doTranslation();
    this.translateService.onLangChange.subscribe(event => {
      this.doTranslation();
    });

  }

  

  getLanguages(){
    this.tenantService.getLang().subscribe((res: any) => {
      this.langs = res.record.data;

    });
  }


  getCurrencies() {
    this.currenciesService.getCurrencies(this.requestReadPermissions).subscribe((res: any) => {
      this.currencies = res.record;
      if (this.id > 0 && this.subscriber && this.subscriber.configurations && this.subscriber.configurations.length > 0) {
        setTimeout(() => {
          $("#currencies").val(this.subscriber.configurations.map((m: Currency) => m.id)).trigger('change');
        }, 100);
      }
    });
  }


  // credentials
  addCredential(credential: any) {
    this.packages = this.editForm.get('credentials') as FormArray;
    this.packages.push(this.createCredential(credential.name, credential.value, credential.description));
  }

  createCredential(key = '', value = '', description = ''): FormGroup {
    return this.formBuilder.group({
      key: [key],
      // value: [value, Constants.VALID_URL_CREDENTIAL.includes(key) ? [Validators.pattern(CustomValidators.urlRegex)] : [ ] ],
      value: [value || ''],
      description: [description || '']
    });
  }

  pageChanged(page: number) {
    this.params = { ...this.params, page };
    this.getSubscriberAdmins();
  }

  getSubscriberAdmins() {
    this.subscriberService.getSubscriberAdmins(this.params, this.requestReadPermissions).subscribe((res: any) => {
      this.users = res.record.data;
      this.total = res.record.total;
    });
  }

  getOrganizations() {
    this.tenantService.getOrganizations().subscribe((res: any) => {
      this.organizations = res.record;
    });
  }

  getSubscriber() {
    this.subscriberService.getSubscriber(this.id, this.requestReadPermissions).subscribe((res: any) => {
      this.subscriber = res.record;
      
      this.sportsSetting = res.record.sports_bet_setting;
      this.crashGameSetting = res.record.crash_game_setting;
      this.config = res.record.config[0];
      this.multi_bet = res.record.config[0].multi_bet;
      this.graph_colour = res.record.config[0].graph_colour.substring(2);
      this.graph_colour = this.graph_colour.slice(0, 0) + "#" + this.graph_colour.slice(0);
      this.loader_colour = res.record.config[0].loader_colour.substring(2);
      this.loader_colour = this.loader_colour.slice(0, 0) + "#" + this.loader_colour.slice(0);
      this.graph = res.record.config[0].graph;
      let currencies: any[] = [];

      if (this.subscriber && this.subscriber.configurations && this.subscriber.configurations.length > 0) {
        currencies = this.subscriber.configurations.map((m: Currency) => m.id);
      }

      this.editForm.patchValue({
        subscriber_name: this.subscriber.subscriber_name,
        domain: this.subscriber.domain,
        language: this.subscriber.language,
        organization: this.subscriber.organization_id,
        primary_currency: this.subscriber.primary_currency,
        currencies: currencies,
        auth_api:  this.subscriber.auth,
        credit_api:  this.subscriber.credit,
        debit_api:  this.subscriber.debit,
        rollback_api:  this.subscriber.rollback,
        trader_id: this.subscriber.trader_id,
        trader_preference: this.subscriber.trader_preference
      });

      // this.imgURL = this.subscriber.logo;
      // this.theme = this.setTheme(this.subscriber.theme);
      this.theme = { ...this.theme, ...JSON.parse(this.subscriber.theme.theme_options) };

    
      if (this.theme.theme_id == 0) {
          this.themeDisabled = false;
      } else {
          this.themeDisabled = true;
      }

      if (currencies.length > 0 && this.currencies.length > 0) {
        setTimeout(() => {
          $("#currencies").val(currencies).trigger('change');
        }, 100);
      }

      if (res.record?.credentials?.length > 0) {
        for (let i = 0; i < res.record.credentials.length; i++) {
          const credential = res.record.credentials[i];
          this.addCredential({ ...credential, name: credential.key });
        }
      }

    });
  }


  setPermissions() {
    // let loggedInUserPermissions: any = localStorage.getItem('permissions');
    // loggedInUserPermissions = JSON.parse(atob(atob(loggedInUserPermissions)));

    // let subscribersPermissions = loggedInUserPermissions.subscribers;

    this.canEditSportSettings = isAllowedPermission('subscriber_settings', 'U');
    this.canCreate = isAllowedPermission('subscribers', 'C');
    this.canEdit = isAllowedPermission('subscribers', 'U');

    // this.canCreate = subscribersPermissions.includes('C');
    // this.canEdit = subscribersPermissions.includes('U');
  }

  
  get selectedCurrencies() {
    return this.currencies.filter(f => this.f.currencies.value.includes(f.id)) || [];
  }

  get f() {
    return this.editForm.controls;
  }

  // selectCurrencies(currencies: any) {
  //   this.f.currencies.setValue(currencies);
  // }

  selectCurrencies(currencies: any) {
    currencies = currencies.map((m: string) => parseInt(m));
    this.f.currencies.setValue(currencies);

    if (this.f.primary_currency.value && currencies && currencies.length > 0) {

      const index = this.currencies.filter(f => currencies.includes(f.id))
        .map((c: Currency) => c.code)
        .findIndex((f: any) => f == this.f.primary_currency.value);

      if (index === -1) {
        this.f.primary_currency.setValue("");
      }

    }
  }

  selectDateRange(time_period: any) {
    this.editForm.patchValue({
      ...time_period
    });
  }

  


  activeTab(tab: string) {

    setTimeout(() => {
      $('.nav-link').removeClass("active");
      $('.tab-pane').removeClass("active");
      $(`#${tab}`).addClass("active");
      $(`#${tab}_t`).addClass("active");
    }, 100);

  }

  subscriberSubmit() {

    this.submitted = true;

    // if (this.editForm.invalid) return;
    if (this.f.subscriber_name.invalid || this.f.domain.invalid || this.f.currencies.invalid || this.f.primary_currency.invalid || this.f.language.invalid || this.f.organization.invalid || this.f.trader_id.invalid || this.f.trader_preference.invalid) return;

    this.subBool = false;
    this.credentialBool = true;

    this.activeTab('credentials');
  }

  goBackSubscriber() {
    this.subBool = true;
    this.credentialBool = false;

    this.activeTab('subscriber');
  }

  goToPackage() {
    this.packageBool = true;
    this.credentialBool = false;

    this.activeTab('packages');
  }

  goToCredential() {
    this.themeBool = false;
    this.credentialBool = true;

    this.activeTab('credentials');
  }

  credSubmit() {

    this.submitted = true;
    if (this.editForm.invalid) return;

    this.credentialBool = false;
    this.themeBool = true;

    this.activeTab('theme');
  }

  nextAdmins() {
    this.configBool = false;
    this.adminBool = true;

    this.activeTab('admins');
  }

  nextConfig() {
    this.sportSettingBool = false;
    this.configBool = true;

    this.activeTab('configurations');
  }

  nextSportSetting() {
    this.themeBool = false;
    this.configBool = true;

    this.activeTab('configurations');
  }

  goBackTheme() {
    this.themeBool = true;
    this.sportSettingBool = false;

    this.activeTab('theme');
  }

  goBackConfig() {
    this.configBool = true;
    this.adminBool = false;

    this.activeTab('configurations');
  }

  goBackSportSetting() {
    this.adminBool = false;
    this.sportSettingBool = true;

    this.activeTab('sport_setting');
  }

  onSubmit() {
    this.submitted = true;
    this.submitted1 = true;

    // console.log(this.editForm.value);

    if (this.editForm.invalid) return;

    const data = this.editForm.value;
    const packages = data.packages.filter(f => !!f.active);

    // if (this.id == 0 && packages.length === 0) {
    //   this.AlertService.error('SENTENCES.PACKAGE_ATLEAST_ONE');
    //   // toastr.error('Please select atleast one Package');
    //   return;
    // }

    const fd = new FormData();

    delete data.logo;
    delete data.packages;

    if (this.selectLogo && this.selectLogo.name) {
      fd.append('logo', this.selectLogo, this.selectLogo.name);
    }

    for (let key in data) {
      if (key !== 'currencies') fd.append(key, data[key]);
    }


    data.currencies.forEach((currency: any, i: number) => {
      fd.append(`currencies[${i}]`, currency);
    });



    // if (packages.length > 0) {
    //   for (let pack in packages) {
    //     fd.append(`packages[${pack}][package_id]`, packages[pack].package_id);
    //     fd.append(`packages[${pack}][abbr]`, packages[pack].abbr);
    //     fd.append(`packages[${pack}][status]`, packages[pack].active);
    //   }
    // }



    this.loader = true;

    if (this.id > 0) {

      fd.append('id', `${this.id}`);

      this.subscriberService.updateSubscriber(fd, this.requestUpdatePermissions)
        .subscribe((response: any) => {
          if (response?.message) {
            this.AlertService.success(response.message);
            // toastr.success(response?.message || 'Subscriber has been updated successfully!');
          }
          this.loader = false;
          this.submitSuccessBool = true;
          //this.router.navigate(['/super-admin/subscribers']);
        }, (err: any) => {
          this.loader = false;
        });

    } else {

      this.subscriberService.createSubscriber(fd, this.componentCreatePermissions)
        .subscribe((response: any) => {
          if (response?.message) {
            this.AlertService.success(response.message);
            // toastr.success(response?.message || 'Subscriber has been created successfully!');
          }
          this.submitSuccessBool = true;
          this.loader = false;
          this.router.navigate(['/super-admin/subscribers/list/0']);
        }, (err: any) => {
          this.loader = false;
        });

    }

  }

  async canExit() {

    if (this.submitSuccessBool) {
      return true;
    } else {
      return await this.AlertService.swalConfirm(this.translateService.instant('SENTENCES.CONFIRM_LEAVE_PAGE'))
      // return Swal.fire({
      //   title: this.translations['SENTENCES.CONFIRM_ARE_YOU_SURE'],
      //   text: this.translations['SENTENCES.CONFIRM_LEAVE_PAGE'],
      //   icon: 'warning',
      //   showCancelButton: true,
      //   confirmButtonColor: '#3085d6',
      //   cancelButtonColor: '#d33',
      //   confirmButtonText: this.translations['SENTENCES.CONFIRM_YES'],
      //   cancelButtonText: this.translations['ACTION_BUTTON.CANCEL']
      // }).then((result) => {
      //   return result.isConfirmed;
      // });
    }
  }

  doTranslation() {
    this.translations[this.title] = "";
    this.translateService.get(Object.keys(this.translations)).subscribe(res => {
      this.translations = res;
      this.breadcrumbs = [
        { title: this.translations['SUBSCRIBERS'], path: '/super-admin/subscribers/list/0' },
        { title: this.translations[this.title], path: '' }
      ];
    });
  }

  goEdit() {
    this.submitSuccessBool = true;
  }

  setDefault(id:any){
    this.tenantService.setDefault(this.config.id,id)
        .subscribe((response: any) => {
          if (response?.message) {
            this.AlertService.success(response.message);
          }
          this.router.navigate(['/super-admin/subscribers/list/0']);
        });
  }

  updateMutiBet(){

    if(this.multi_bet == null)
    {
      this.AlertService.error("Can't be empty.");
      return;
    }
    const fd = new FormData();
    fd.append('multi_bet', this.multi_bet);
    this.tenantService.updateHero(fd,this.config.id)
        .subscribe((response: any) => {
          if (response?.message) {
            this.AlertService.success(response.message);
          }
          window.location.reload();
        });
  }

  updateColour(id:any){
    const fd = new FormData();
    if(id==1){
      this.graph_colour = this.graph_colour.substring(1);
      this.graph_colour = this.graph_colour.slice(0, 0) + "0x" + this.graph_colour.slice(0);
      fd.append('graph_colour', this.graph_colour);
    }
    else{
      this.loader_colour = this.loader_colour.substring(1);
      this.loader_colour = this.loader_colour.slice(0, 0) + "0x" + this.loader_colour.slice(0);   
      fd.append('loader_colour', this.loader_colour);    }
    this.tenantService.updateHero(fd,this.config.id)
        .subscribe((response: any) => {
          if (response?.message) {
            this.AlertService.success(response.message);
          }
          window.location.reload();
        });
  }

  updateGraph(status:any){

    const fd = new FormData();
    if(status==1 || status===2){
    fd.append('graph', status);
    }
    this.tenantService.updateHero(fd,this.config.id)
        .subscribe((response: any) => {
          if (response?.message) {
            this.AlertService.success(response.message);
          }
          window.location.reload();
        });
  }

}
