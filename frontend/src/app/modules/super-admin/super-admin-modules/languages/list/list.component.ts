import { Component, OnInit } from '@angular/core';
import { Currency } from 'src/app/models';
import { CurrenciesService } from '../../currencies/currencies.service';
import { AlertService } from 'src/app/services/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { TenantService } from 'src/app/modules/tenant/tenant.service';
import { saveAs } from 'file-saver';
import { PageSizes } from 'src/app/shared/constants';
// declare const toastr: any;

@Component({
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})

export class ListComponent implements OnInit {

  langParams: any = {
    size: 10,
    page: 1,
    search: '',
  };

  
  langTotal: number = 0;
  p: number = 1;
  pageSizes: any[] = PageSizes;
  currencies: Currency[] = [];
  languages: any;
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
    private tenantService: TenantService,
    private translate: TranslateService) {
    this.doTranslation();

    this.translate.onLangChange.subscribe(event => {
      this.doTranslation();
    });
  }

  ngOnInit(): void {

    this.getLanguages();
    this.setPermissions();
  }

  doTranslation() {
    this.breadcrumbs = [
      { title: this.translate.instant('LANGUAGES'), path: '/super-admin/languages' },
    ];
  }

  setPermissions() {
    let loggedInUserPermissions: any = localStorage.getItem('permissions');
    loggedInUserPermissions = JSON.parse(atob(atob(loggedInUserPermissions)));

    this.canCreate = loggedInUserPermissions.currencies.includes('C');
    this.canEdit = loggedInUserPermissions.currencies.includes('U');
    this.canMarkPrimary = loggedInUserPermissions.currencies.includes('mark_primary');
  }

  download(code:any) {
    this.tenantService
      .download('/public/i18n/'+code+'.json')
      .subscribe(blob => saveAs(blob, code+'.json'))
}

downloadUserJson(id:any,type:any){
  this.tenantService.downloadLangUserJson(id).subscribe((res: any) => {
  //   this.tenantService
  //   .download(res.record.user_json)
  //   .subscribe(blob => saveAs(blob, code+'.json');
if(type==1)
  window.open(res.record.user_json, '_blank');
  else
  window.open(res.record.user_backend_json, '_blank');

  });

}

  getLanguages() {
    this.tenantService.getLanguages(this.langParams).subscribe((res: any) => {
      this.languages = res.record.data;
      this.langTotal = res.record.total;
    });
  }

  filter(event: any) {
    this.p = 1;
    this.langParams = { ...this.langParams, page: this.p };
    this.getLanguages();
  }

  pageChanged(page: number) {
    this.langParams = { ...this.langParams, page };
    this.getLanguages();
  }

  resetFilter() {
    this.p = 1;
    this.langParams = {
      size: 10,
      page: 1,
      search: '',
    }
    this.getLanguages();
  }


}

