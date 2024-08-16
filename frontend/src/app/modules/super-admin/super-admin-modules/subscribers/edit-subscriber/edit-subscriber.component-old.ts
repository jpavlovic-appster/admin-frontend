import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Currency, Subscriber } from 'src/app/models';
import { TenantService } from 'src/app/modules/tenant/tenant.service';
import { Constants } from 'src/app/shared/constants';
import { AlertService } from 'src/app/services/alert.service';
import { CustomValidators } from 'src/app/shared/validators';
import { SubscriberService } from '../../../../subscriber-system/services/subscriber.service';
import { CurrenciesService } from '../../currencies/currencies.service';

declare const $: any;
// declare const toastr: any;

@Component({
  templateUrl: './edit-subscriber.component.html',
  styleUrls: ['./edit-subscriber.component.scss']
})

export class EditSubscriberComponent implements OnInit, AfterViewInit {

  format: string = "YYYY-MM-DD";
  minDate: any = new Date();

  imgURL: any;
  id: number = 0;

  currencies: Currency[] = [];
  primaryCurrency!: Currency;

  subscriber!: Subscriber;

  editForm: FormGroup | any;
  packages: FormArray | any;

  submitted: boolean = false;
  loader: boolean = false;
  selectLogo: File | null = null;

  theme: any = Constants.DARK_THEME;

  title: string = 'Create';

  breadcrumbs: Array<any> = [
    { title: 'Home', path: '/super-admin' },
    { title: 'Subscribers', path: '/super-admin/subscribers/list/0' }
  ];

  // Permissions variables
  requestReadPermissions = btoa(btoa('subscribers|:|R'));
  componentCreatePermissions = btoa(btoa('subscribers|:|C'));
  requestUpdatePermissions = btoa(btoa('subscribers|:|U'));
  canCreate = false;
  canEdit = false;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private AlertService: AlertService,
    private formBuilder: FormBuilder,
    private subscriberService: SubscriberService,
    private tenantService: TenantService,
    private currenciesService: CurrenciesService
  ) {
    this.id = this.route.snapshot.params['id'];

    this.title = 'Create';

    this.editForm = this.formBuilder.group({
      subscriber_name: ['', [Validators.required]],
      status: [0],
      // start_date: [''],
      // end_date: [''],
      domain: ['', [Validators.required, Validators.pattern(CustomValidators.urlRegex)]],
      logo: ['', [CustomValidators.requiredFileType(CustomValidators.imgType)]],
      currencies: ['', [Validators.required]],
      packages: this.formBuilder.array([])
    });

    if (this.id > 0) {
      this.title = 'Edit';
      this.getSubscriber();
    } else {
      this.getAllPackages();
      const logoControl = this.editForm.get('logo');
      logoControl.setValidators([Validators.required, CustomValidators.requiredFileType(CustomValidators.imgType)]);
      logoControl.updateValueAndValidity();
    }

    this.breadcrumbs.push({ title: this.title, path: `/super-admin/subscribers/${this.id}` });

  }

  ngOnInit(): void {
    this.setPermissions();
    this.getCurrencies();
  }

  ngAfterViewInit(): void {
    $('#date_range').val('');
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

  addPackage(pack: any) {
    this.packages = this.editForm.get('packages') as FormArray;
    this.packages.push(this.createPackage(pack.abbr, pack.name, pack.plans, pack.plans[0].id));
  }

  createPackage(abbr = '', name = '', plans = [], package_id = ''): FormGroup {
    return this.formBuilder.group({
      abbr: [abbr],
      name: [name],
      plans: [plans],
      package_id: [package_id],
      active: true
    });
  }

  getSubscriber() {
    this.subscriberService.getSubscriber(this.id, this.requestReadPermissions).subscribe((res: any) => {
      this.subscriber = res.record;

      let currencies: any[] = [];

      if (this.subscriber && this.subscriber.configurations && this.subscriber.configurations.length > 0) {
        currencies = this.subscriber.configurations.map((m: Currency) => m.id);
      }

      this.editForm.patchValue({
        subscriber_name: this.subscriber.subscriber_name,
        domain: this.subscriber.domain,
        status: this.subscriber.status,
        currencies: currencies
      });

      this.imgURL = this.subscriber.logo;
      this.theme = this.setTheme(this.subscriber.theme);

      if (currencies.length > 0 && this.currencies.length > 0) {
        setTimeout(() => {
          $("#currencies").val(currencies).trigger('change');
        }, 100);
      }

    });
  }

  setTheme(theme) {

    theme = { ...theme };

    let newTheme = {
      ...Constants.DARK_THEME, palette: {
        mode: theme.theme_mode,
        primary: theme.primary_color,
        secondry: theme.secondry_color,
      },
    };

    newTheme.typography.font_family = this.theme.typography.font_family;

    return newTheme;
  }

  setPermissions() {
    let loggedInUserPermissions: any = localStorage.getItem('permissions');
    loggedInUserPermissions = JSON.parse(atob(atob(loggedInUserPermissions)));

    let subscribersPermissions = loggedInUserPermissions.subscribers;

    this.canCreate = subscribersPermissions.includes('C');
    this.canEdit = subscribersPermissions.includes('U');
  }

  getAllPackages() {
    this.tenantService.getAllPackages(this.requestReadPermissions).subscribe((res: any) => {

      const packages = res.record.packages;
      this.primaryCurrency = res.record.primary_currency;
      // console.log(packages);

      for (let i = 0; i < packages.length; i++) {
        this.addPackage(packages[i]);
      }

    });
  }

  get f() {
    return this.editForm.controls;
  }

  selectCurrencies(currencies: any) {
    this.f.currencies.setValue(currencies);
  }

  selectImage(files: any) {
    if (files.length === 0) return;

    const extension = files[0].name.split('.')[1].toLowerCase();
    const imgt = CustomValidators.imgType.includes(extension);

    if (imgt) {
      const reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onload = (_event) => {
        this.imgURL = reader.result;
      }
      this.selectLogo = files[0];
    } else {
      this.selectLogo = null;
      this.imgURL = '';
    }

  }

  selectDateRange(time_period: any) {
    this.editForm.patchValue({
      ...time_period
    });
  }

  changeTheme(theme: any) {
    this.theme = theme;
  }

  onSubmit() {
    this.submitted = true;

    // console.log(this.editForm.value);

    if (this.editForm.invalid) return;

    const data = this.editForm.value;
    const packages = data.packages.filter(f => !!f.active);

    if (this.id == 0 && packages.length === 0) {
      this.AlertService.error('SENTENCES.PACKAGE_ATLEAST_ONE');
      // toastr.error('Please select atleast one Package');
      return;
    }

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

    fd.append('theme', JSON.stringify(this.theme));

    if (packages.length > 0) {
      for (let pack in packages) {
        fd.append(`packages[${pack}][package_id]`, packages[pack].package_id);
        fd.append(`packages[${pack}][status]`, packages[pack].active);
      }
    }

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
          this.router.navigate(['/super-admin/subscribers/list/0']);
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
          this.router.navigate(['/super-admin/subscribers/list/0']);
          this.loader = false;
        }, (err: any) => {
          this.loader = false;
        });

    }

  }

}
