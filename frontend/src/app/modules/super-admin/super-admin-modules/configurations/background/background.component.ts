import { Component, ElementRef, OnInit , ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Currency } from 'src/app/models';
import { TenantService } from 'src/app/modules/tenant/tenant.service';
import { AlertService } from 'src/app/services/alert.service';
import { CurrenciesService } from '../../currencies/currencies.service';

@Component({
  selector: 'app-background',
  templateUrl: './background.component.html',
  styleUrls: ['./background.component.scss']
})
export class BackgroundComponent implements OnInit {

  @ViewChild('file') logo_file!: ElementRef ;
  id: number = 0;
  dId: number =0;
  selectLogo: File | null = null;
  selectLogo2: File | null = null;
  language:any;
  currency!: Currency;
  imgURL: any;
  configForm: FormGroup | any;
  submitted: boolean = false;
  currencyLoader: boolean = false;
  primary: any = {};

  translations = {
    "HOME": "",
    "LANGUAGES": "",

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
    private tenantService: TenantService,
    private translateService: TranslateService) {
    this.id = this.route.snapshot.params['id'];
    this.dId = this.route.snapshot.params['dId'];

    this.configForm = this.formBuilder.group({

      bgJsonFile: ['', [Validators.required]],
      bgPngFile: ['', [Validators.required]],
    });

    if (this.id > 0) {
      this.title = 'ACTION_BUTTON.EDIT';

    }

    // this.getPrimaryCurrency();

    // this.breadcrumbs.push({ title, path: `/super-admin/currencies/${this.id}` });

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


  selectFile(files: any) {
    if (files.length === 0)
      return;
    const extension = files[0].name.split('.')[1].toLowerCase();

    if (extension != 'json') {
      this.AlertService.error('JSON file needed');
      this.configForm.controls['bgJsonFile'].reset()
        return;
    }

      const reader = new FileReader();
      reader.readAsDataURL(files[0]);

      reader.onload = (_event) => {
        this.imgURL = reader.result;
      }

      this.selectLogo = files[0];



  }

  selectFile2(files: any) {
    if (files.length === 0)
      return;
    const extension = files[0].name.split('.')[1].toLowerCase();

    if (extension != 'png') {
      this.AlertService.error('png file needed');
      this.configForm.controls['bgPngFile'].reset()
        return;
    }

      const reader = new FileReader();
      reader.readAsDataURL(files[0]);

      reader.onload = (_event) => {
        this.imgURL = reader.result;
      }

      this.selectLogo2 = files[0];



  }

  get f() {
    return this.configForm.controls;
  }


//   download() {

//     this.tenantService
//       .download('/public/i18n/en.json')
//       .subscribe(blob => saveAs(blob, 'en.json'))
// }

  onSubmit() {

    this.submitted = true;
    // stop here if form is invalid



    if (this.configForm.invalid) return;

    this.currencyLoader = true;

    const fd = new FormData();

    if (this.selectLogo && this.selectLogo.name) {
      fd.append('bgJsonFile', this.selectLogo, this.selectLogo.name);
    }

    if (this.selectLogo2 && this.selectLogo2.name) {
      fd.append('bgPngFile', this.selectLogo2, this.selectLogo2.name);
    }


      this.tenantService.updateHero(fd,this.id)
        .subscribe((response: any) => {
          if (response?.message) {
            this.AlertService.success(response.message);
          }
          this.router.navigate(['/super-admin/subscribers/list/0']);
        }, (err: any) => {
          this.currencyLoader = false;

        });
  }

  doTranslation() {
    this.translations[this.title] = "";
    this.translateService.get(Object.keys(this.translations)).subscribe((res) => {
      this.translations = res;
      this.breadcrumbs = [
        // { title: this.translations['HOME'], path: '/super-admin/subscribers' },
        { title: 'Background', path: '/super-admin/suscribers/list/0' },
        { title: this.translations[this.title], path: '' },
      ];
    });
  }

}
