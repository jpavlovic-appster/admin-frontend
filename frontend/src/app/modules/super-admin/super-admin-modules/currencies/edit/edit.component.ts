import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Currency } from 'src/app/models';
import { AlertService } from 'src/app/services/alert.service';
import { CurrenciesService } from '../currencies.service';

// declare const $: any;
// declare const toastr: any;

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  id: number = 0;
  currency!: Currency;

  currencyForm: FormGroup | any;
  submitted: boolean = false;
  currencyLoader: boolean = false;
  primary: any = {};

  translations = {
    "HOME": "",
    "CURRENCIES": "",
  };

  breadcrumbs: Array<any> = [];

  title = 'ACTION_BUTTON.CREATE';

  // Permission Variables
  requestReadPermissions = btoa(btoa('currencies|:|R'));
  componentCreatePermissions = btoa(btoa('currencies|:|C'));
  requestUpdatePermissions = btoa(btoa('currencies|:|U'));
  canCreate = false;
  canEdit = false;

  constructor(private route: ActivatedRoute,
    private AlertService: AlertService,
    private router: Router,
    private formBuilder: FormBuilder,
    private currenciesService: CurrenciesService,
    private translateService: TranslateService) {
    this.id = this.route.snapshot.params['id'];

    this.currencyForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      code: ['', [Validators.required, Validators.pattern(/^[A-Z_]+$/i)]],
      symbol: ['', [Validators.required]],
      exchange_rate: ['', [Validators.required, Validators.min(0)]],
    });

    if (this.id > 0) {
      this.title = 'ACTION_BUTTON.EDIT';
      this.getCurrency();
    }

    this.getPrimaryCurrency();

    //this.breadcrumbs.push({ title, path: `/super-admin/currencies/${this.id}` });

  }

  ngOnInit(): void {
    this.setPermissions();
    this.doTranslation();
    this.translateService.onLangChange.subscribe(event => {
      this.doTranslation();
    });
  }

  setPermissions() {
    let loggedInUserPermissions: any = localStorage.getItem('permissions');
    loggedInUserPermissions = JSON.parse(atob(atob(loggedInUserPermissions)));

    this.canCreate = loggedInUserPermissions.currencies.includes('C');
    this.canEdit = loggedInUserPermissions.currencies.includes('U');
  }

  getCurrency() {
    this.currenciesService.getCurrencyById(this.id, this.requestReadPermissions).subscribe((res: any) => {
      this.currency = res.record;
      this.currencyForm.patchValue({
        name: this.currency.name,
        code: this.currency.code,
        symbol: this.currency.symbol,
        exchange_rate: this.currency.exchange_rate,
      });
    });
  }

  get f() {
    return this.currencyForm.controls;
  }

  getPrimaryCurrency() {
    this.currenciesService.getPrimaryCurrency(this.requestReadPermissions).subscribe((res: any) => {
      this.primary = res.record;
    });
  }

  onSubmit() {

    this.submitted = true;
    // stop here if form is invalid

    if (this.f.exchange_rate.value <= 0) {
      this.f.exchange_rate.setErrors({ min: 'Exchange Rate must be greater then 0' });
    }

    // console.log(this.currencyForm.value);

    if (this.currencyForm.invalid) return;

    this.currencyLoader = true;

    if (this.id > 0) {
      const data = this.currencyForm.value;
      data.id = this.id;

      this.currenciesService.updateCurrency(data, this.requestUpdatePermissions)
        .subscribe((response: any) => {
          if (response?.message) {
            this.AlertService.success(response.message);
            // toastr.success(response?.message || 'Currency Updated Successfully!');
          }
          this.router.navigate(['/super-admin/currencies']);
        }, (err: any) => {
          this.currencyLoader = false;
        });

    } else {

      this.currenciesService.createCurrency(this.currencyForm.value, this.componentCreatePermissions)
        .subscribe((response: any) => {
          if (response?.message) {
            this.AlertService.success(response.message);
            // toastr.success(response?.message || 'Currency Created Successfully!');
          }
          this.router.navigate(['/super-admin/currencies']);
        }, (err: any) => {
          this.currencyLoader = false;
        });

    }
  }

  doTranslation() {
    this.translations[this.title] = "";
    this.translateService.get(Object.keys(this.translations)).subscribe((res) => {
      this.translations = res;
      this.breadcrumbs = [
        // { title: this.translations['HOME'], path: '/super-admin/subscribers' },
        { title: this.translations['CURRENCIES'], path: '/super-admin/currencies' },
        { title: this.translations[this.title], path: '' },
      ];
    });
  }

}
