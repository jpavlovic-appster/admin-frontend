import { Component, OnInit } from '@angular/core';
import { Currency } from 'src/app/models';
import { CurrenciesService } from '../../currencies/currencies.service';
import { AlertService } from 'src/app/services/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { TenantService } from 'src/app/modules/tenant/tenant.service';
import { PageSizes } from 'src/app/shared/constants';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  pageSizes: any[] = PageSizes;
  params: any = {
    size: 10,
    page: 1,
    search: '',
    status: '',
    order: 'desc',
    sort_by: 'created_at'
  };

  p: number = 1;
  total: number = 0;
  order= 'asc';

  currencies: Currency[] = [];
  organizations: any;
  primary: any = {};
  translations = {
    "HOME": "",
    "SUBSCRIBERS": "",
    "SENTENCES.CONFIRM_ARE_YOU_SURE": "",
    "SENTENCES.CONFIRM_ACTIVE": "",
    "SENTENCES.CONFIRM_IN_ACTIVE": "",
    "SENTENCES.CONFIRM_YES": "",
    "ACTION_BUTTON.CANCEL": "",
  };
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

    this.getOrganizations();
    this.setPermissions();
  }

  doTranslation() {
    this.translate.get(Object.keys(this.translations)).subscribe(res => {
      this.translations = res;
    });
    this.breadcrumbs = [
      // { title: this.translate.instant('HOME'), path: '/super-admin/subscribers' },
      { title: this.translate.instant('ORGANIZATIONS'), path: '/super-admin/organizations' },
    ];
  }

  setPermissions() {
    let loggedInUserPermissions: any = localStorage.getItem('permissions');
    loggedInUserPermissions = JSON.parse(atob(atob(loggedInUserPermissions)));

    this.canCreate = loggedInUserPermissions.currencies.includes('C');
    this.canEdit = loggedInUserPermissions.currencies.includes('U');
    this.canMarkPrimary = loggedInUserPermissions.currencies.includes('mark_primary');
  }

  async changeStatus(organization: any) {

    if (await this.AlertService.swalConfirm( (organization.status == 1) ? this.translations['SENTENCES.CONFIRM_IN_ACTIVE'] : this.translations['SENTENCES.CONFIRM_ACTIVE'] )) {

        this.tenantService.updateOrgStatus({ id: organization.id, status: organization.status == 1 ? 0 : 1 }).subscribe((res: any) => {

          if (res?.message) {
            this.AlertService.success(res.message);
            // toastr.success(res.message || 'Subscriber updated successfully');
          }
          this.getOrganizations();
        });
      }
    }

  getOrganizations() {
    this.tenantService.getOrganizationsAll(this.params).subscribe((res: any) => {
      this.organizations = res.record.data; 
      this.total = res.record.total;
    });
  }

  async deleteOrg(id:any){
    if (await this.AlertService.swalConfirm(this.translate.instant('SENTENCES.CONFIRM_DELETE'))) {

      this.tenantService.deleteOrg(id).subscribe((res: any) => {
        if (res?.message) {
          this.AlertService.success(res.message);
          // toastr.success(res.message || 'Currency Deleted Successfully.');
        }
        this.getOrganizations();
      });

    }
  }

  filter(event: any) {
    this.p = 1;
    this.params = { ...this.params, page: this.p };
    this.getOrganizations();
  }

  setOrder(column: any) {
    this.p = 1;
    this.order = (this.order == 'asc' ? 'desc' : 'asc')
    
    this.params = { ...this.params, page: this.p, order: this.order, sort_by: column };
    this.getOrganizations();
  }

  pageChanged(page: number) {
    this.params = { ...this.params, page };
    this.getOrganizations();
  }

  resetFilter() {
    this.p = 1;
    this.params = {
      size: 10,
      page: 1,
      search: '',
      status: '',
      order: 'desc',
      sort_by: 'created_at'
    }
    this.getOrganizations();
  }
}
