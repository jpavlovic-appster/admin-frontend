import { Component, ElementRef, OnInit , ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Currency } from 'src/app/models';
import { TenantService } from 'src/app/modules/tenant/tenant.service';
import { AlertService } from 'src/app/services/alert.service';
import { CurrenciesService } from '../../currencies/currencies.service';
import { saveAs } from 'file-saver';

// declare const $: any;
// declare const toastr: any;

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  @ViewChild('file') logo_file!: ElementRef ;
  id: number = 0;
  dId: number =0;
  selectLogo: File | null = null;
  selectLogo2: File | null = null;
  selectLogo3: File | null = null;
  language:any;
  currency!: Currency;
  imgURL: any;
  languageForm: FormGroup | any;
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
    if(this.dId==1){
    this.languageForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      code: ['', [Validators.required, Validators.pattern('[a-z][a-z]')]],
      jsonFile: ['', [Validators.required]],

    });}
    else if(this.dId==0){
      this.languageForm = this.formBuilder.group({
        name: ['', [Validators.required]],
        code: ['', [Validators.required, Validators.pattern('[a-z][a-z]')]],
        userJsonFile: ['', [Validators.required]],

      });
  }
  else if(this.dId==3){
    this.languageForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      code: ['', [Validators.required, Validators.pattern('[a-z][a-z]')]],
      userBackendJsonFile: ['', [Validators.required]],

    });
}
  else{
    this.languageForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      code: ['', [Validators.required, Validators.pattern('[a-z][a-z]')]],
      jsonFile: ['', [Validators.required]],
      userJsonFile: ['', [Validators.required]],
      userBackendJsonFile: ['', [Validators.required]],
    });
  }

    if (this.id > 0) {
      this.title = 'ACTION_BUTTON.EDIT';
      this.getLanguage();
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

  getLanguage() {
    this.tenantService.getSingleLang(this.id).subscribe((res: any) => {
      this.language = res.record;
      this.languageForm.patchValue({
        name: this.language.name,
        code: this.language.code,
      });
    });
  }

  selectFile(files: any) {
    if (files.length === 0)
      return;
    const extension = files[0].name.split('.')[1].toLowerCase();

    if (extension != 'json') {
      console.log('use json fromat');
      this.languageForm.controls['jsonFile'].reset()
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

    if (extension != 'json') {
      console.log('use json fromat');
      this.languageForm.controls['userJsonFile'].reset()
        return;
    }
      const reader = new FileReader();
      reader.readAsDataURL(files[0]);

      reader.onload = (_event) => {
        this.imgURL = reader.result;
      }
      this.selectLogo2 = files[0];
  }

  selectFile3(files: any) {
    if (files.length === 0)
      return;
    const extension = files[0].name.split('.')[1].toLowerCase();

    if (extension != 'json') {
      console.log('use json fromat');
      this.languageForm.controls['userBackendJsonFile'].reset()
        return;
    }
      const reader = new FileReader();
      reader.readAsDataURL(files[0]);

      reader.onload = (_event) => {
        this.imgURL = reader.result;
      }
      this.selectLogo3 = files[0];
  }

  get f() {
    return this.languageForm.controls;
  }


//   download() {

//     this.tenantService
//       .download('/public/i18n/en.json')
//       .subscribe(blob => saveAs(blob, 'en.json'))
// }

  onSubmit() {

    this.submitted = true;
    // stop here if form is invalid



    if (this.languageForm.invalid) return;

    this.currencyLoader = true;

    const data = this.languageForm.value;
    const fd = new FormData();

    if (this.selectLogo && this.selectLogo.name) {
      fd.append('jsonFile', this.selectLogo, this.selectLogo.name);
    }

    if (this.selectLogo2 && this.selectLogo2.name) {
      fd.append('userJsonFile', this.selectLogo2, this.selectLogo2.name);
    }

    if (this.selectLogo3 && this.selectLogo3.name) {
      fd.append('userBackendJsonFile', this.selectLogo3, this.selectLogo3.name);
    }

    if (this.id > 0) {

      const data = this.languageForm.value;
      data.id = this.id;
      delete data.jsonFile;
      delete data.userJsonFile;
      delete data.userBackendJsonFile;

      for (let key in data) {
        fd.append(key, data[key]);
      }

      this.tenantService.updateLanguage(fd,this.id)
        .subscribe((response: any) => {
          if (response?.message) {
            this.AlertService.success(response.message);
          }
          this.router.navigate(['/super-admin/languages']);
        }, (err: any) => {
          this.currencyLoader = false;

        });

    } else {
      delete data.jsonFile;
      delete data.userJsonFile;
      delete data.userBackendJsonFile;

      for (let key in data) {
        fd.append(key, data[key]);
      }
      this.tenantService.addLanguage(fd)
        .subscribe((response: any) => {
          if (response?.message) {
            this.AlertService.success(response.message);
            this.tenantService.languageUpdateSubject.next(true);
          }
          this.router.navigate(['/super-admin/languages']);
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
        { title: this.translations['LANGUAGES'], path: '/super-admin/languages' },
        { title: this.translations[this.title], path: '' },
      ];
    });
  }

}
