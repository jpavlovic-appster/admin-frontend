import { Component, OnInit } from '@angular/core';
import { Currency } from 'src/app/models';
import { CurrenciesService } from '../currencies.service';
import { AlertService } from 'src/app/services/alert.service';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { PageSizes } from 'src/app/shared/constants';
// declare const toastr: any;

@Component({
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})

export class ListComponent implements OnInit {

  pageSizes: any[] = PageSizes;
  params: any = {
    size: 10,
    page: 1,
    search: '',
  };

  p: number = 1;
  total: number = 0;

  currencies: Currency[] = [];
  primary: any = {};

  breadcrumbs: Array<any> = [
    // { title: 'Home', path: '/super-admin' },
    // { title: 'Currencies', path: '/super-admin/currencies' },
  ];

  // Permission Variables
  requestReadPermissions = btoa(btoa('currencies|:|R'));
  requestDeletePermissions = btoa(btoa('currencies|:|D'));
  requestUpdatePermissions = btoa(btoa('currencies|:|U'));
  canCreate = false;
  canEdit = false;
  canMarkPrimary = false;

  constructor(private currencyService: CurrenciesService,
    private AlertService: AlertService,
    private translate: TranslateService) {
    this.doTranslation();

    this.translate.onLangChange.subscribe(event => {
      this.doTranslation();
    });
  }

  ngOnInit(): void {
    this.getCurrencies();
    this.getPrimaryCurrency();
    this.setPermissions();
  }

  doTranslation() {
    this.breadcrumbs = [
      // { title: this.translate.instant('HOME'), path: '/super-admin/subscribers' },
      { title: this.translate.instant('CURRENCIES'), path: '/super-admin/currencies' },
    ];
  }

  setPermissions() {
    let loggedInUserPermissions: any = localStorage.getItem('permissions');
    loggedInUserPermissions = JSON.parse(atob(atob(loggedInUserPermissions)));

    this.canCreate = loggedInUserPermissions.currencies.includes('C');
    this.canEdit = loggedInUserPermissions.currencies.includes('U');
    this.canMarkPrimary = loggedInUserPermissions.currencies.includes('mark_primary');
  }

  getCurrencies() {
    this.currencyService.getCurrenciesAll(this.params).subscribe((res: any) => {
      this.currencies = res.record.data;
      this.total = res.record.total;
    });
  }

  async markPrimary(currency: any) {

    if (await this.AlertService.swalConfirm( `You are going to mark currency ${currency.code} as Primary. All the other currencies exchange rates will be adjusted as per the exchange rate of ${currency.code} which is ${currency.exchange_rate}` ) ) {
        this.currencyService.markPrimary(currency.id, this.requestUpdatePermissions).subscribe((res: any) => {
          if (res?.message) {
            this.AlertService.success(res.message);
            // toastr.success(res.message);
          }

          this.getCurrencies();
          this.getPrimaryCurrency();
        });
    }


    // Swal.fire({
    //   title: 'Are you sure?',
    //   text: `You are going to mark currency ${currency.code} as Primary. All the other currencies exchange rates will be adjusted as per the exchange rate of ${currency.code} which is ${currency.exchange_rate}`,
    //   icon: 'warning',
    //   showCancelButton: true,
    //   confirmButtonColor: '#3085d6',
    //   cancelButtonColor: '#d33',
    //   confirmButtonText: `Yes, mark it!`
    // }).then((result) => {
    //   if (result.isConfirmed) {
    //     this.currencyService.markPrimary(currency.id, this.requestUpdatePermissions).subscribe((res: any) => {
    //       if (res?.message) {
    //         this.AlertService.success(res.message);
    //         // toastr.success(res.message);
    //       }

    //       this.getCurrencies();
    //       this.getPrimaryCurrency();
    //     });
    //   }
    // });
  }

  getPrimaryCurrency() {
    this.currencyService.getPrimaryCurrency(this.requestReadPermissions).subscribe((res: any) => {
      this.primary = res.record;
    });
  }

  async delete(currency: Currency) {

    if (await this.AlertService.swalConfirm(this.translate.instant('SENTENCES.CONFIRM_DELETE'))) {

        this.currencyService.deleteCurrency(currency, this.requestDeletePermissions).subscribe((res: any) => {
          if (res?.message) {
            this.AlertService.success(res.message);
            // toastr.success(res.message || 'Currency Deleted Successfully.');
          }
          this.getCurrencies();
        });

      }

    // Swal.fire({
    //   title: 'Are you sure?',
    //   text: `You want to delete ${currency.name}!`,
    //   icon: 'warning',
    //   showCancelButton: true,
    //   confirmButtonColor: '#3085d6',
    //   cancelButtonColor: '#d33',
    //   confirmButtonText: `Yes, delete it!`
    // }).then((result) => {
    //   if (result.isConfirmed) {

    //     this.currencyService.deleteCurrency(currency, this.requestDeletePermissions).subscribe((res: any) => {
    //       if (res?.message) {
    //         this.AlertService.success(res.message);
    //         // toastr.success(res.message || 'Currency Deleted Successfully.');
    //       }
    //       this.getCurrencies();
    //     });

    //   }
    // });

  }

  filter(event: any) {
    this.p = 1;
    this.params = { ...this.params, page: this.p };
    this.getCurrencies();
  }

  pageChanged(page: number) {
    this.params = { ...this.params, page };
    this.getCurrencies();
  }

  resetFilter() {
    this.p = 1;
    this.params = {
      size: 10,
      page: 1,
      search: '',
    }
    this.getCurrencies();
  }

}
