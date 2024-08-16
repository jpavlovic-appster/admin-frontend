import { Component, ElementRef, OnInit , ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Currency } from 'src/app/models';
import { TenantService } from 'src/app/modules/tenant/tenant.service';
import { AlertService } from 'src/app/services/alert.service';
import { CurrenciesService } from '../../currencies/currencies.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {


  id: number = 0;
  dId: number =0;
  org:any;
  language:any;
  currency!: Currency;
  orgForm: FormGroup | any;
  submitted: boolean = false;
  currencyLoader: boolean = false;
  primary: any = {};

  translations = {
    "HOME": "",
    "LANGUAGES": "",
    "ORGANIZATIONS": ""
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
    private tenantService: TenantService,
    private translateService: TranslateService) {
    this.id = this.route.snapshot.params['id'];


      this.orgForm = this.formBuilder.group({
        name: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$'),Validators.minLength(3)]],
      });


    if (this.id > 0) {
      this.title = 'ACTION_BUTTON.EDIT';
      this.getOrganization();
    }

  }

  ngOnInit(): void {
    this.setPermissions();
    this.doTranslation();
    this.translateService.onLangChange.subscribe(event => {
      this.doTranslation();
    });
  }

  getOrganization() {
    this.tenantService.getOrganization(this.id).subscribe((res: any) => {
      this.org = res.record;
      this.orgForm.patchValue({
        name: this.org.name,
      });
    });
  }

  setPermissions() {
    let loggedInUserPermissions: any = localStorage.getItem('permissions');
    loggedInUserPermissions = JSON.parse(atob(atob(loggedInUserPermissions)));

    this.canCreate = loggedInUserPermissions.currencies.includes('C');
    this.canEdit = loggedInUserPermissions.currencies.includes('U');
  }


  get f() {
    return this.orgForm.controls;
  }


  onSubmit() {

    this.submitted = true;
    // stop here if form is invalid

    // console.log(this.orgForm.value);

    if (this.orgForm.invalid) return;

    this.currencyLoader = true;

    if (this.id > 0) {
      const data = this.orgForm.value;
      data.id = this.id;

      this.tenantService.updateOrganization(data, this.requestUpdatePermissions)
        .subscribe((response: any) => {
          if (response?.message) {
            this.AlertService.success(response.message);
            // toastr.success(response?.message || 'Currency Updated Successfully!');
          }
          this.router.navigate(['/super-admin/organizations']);
        }, (err: any) => {
          this.currencyLoader = false;
        });

    } else {

      this.tenantService.createOrganization(this.orgForm.value)
        .subscribe((response: any) => {
          if (response?.message) {
            this.AlertService.success(response.message);
            // toastr.success(response?.message || 'Currency Created Successfully!');
          }
          this.router.navigate(['/super-admin/organizations']);
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
        { title: this.translations['ORGANIZATIONS'], path: '/super-admin/organizations' },
        { title: this.translations[this.title], path: '' },
      ];
    });
  }

}
