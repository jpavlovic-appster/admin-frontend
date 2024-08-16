import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SuperAdminAuthService } from '../../services/super-admin-auth.service';
import { CustomValidators } from 'src/app/shared/validators';
import { encryptPassword } from 'src/app/services/utils.service';
import { Constants } from 'src/app/shared/constants';
import { TranslateService } from '@ngx-translate/core';
import { TenantService } from 'src/app/modules/tenant/tenant.service';
declare const $: any;
declare const toastr: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit, AfterViewInit, OnDestroy {

  returnUrl: string = '/settings/crash-game/super-admin';
  loginForm: FormGroup | any;
  submitted: boolean = false;
  loginLoader: boolean = false;
  show: boolean = false;

  langs: any;
  currentLang: string = Constants.defaultLang;

  constructor(private formBuilder: FormBuilder,
    private superAdminAuthService: SuperAdminAuthService,
    private router: Router,
    private route: ActivatedRoute,
    private translateService: TranslateService,
    private tenantService: TenantService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(CustomValidators.emailRegEx)]],
      password: ['', [Validators.required]],
      remember_me: [false],
    });
  }

  ngOnInit(): void {
    this.getLanguages();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/super-admin/subscriber-dashboard';
  }

  ngAfterViewInit(): void {
    $(document.body).addClass('hold-transition login-page');
  }
  getLanguages() {
    this.tenantService.getLang().subscribe((res: any) => {
      this.langs = res.record.data;
      console.log(res.record);

    });
  }
  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.loginForm.invalid) return;

    const data = this.loginForm.value;
    data.password = encryptPassword(data.password);

    this.loginLoader = true;
    this.superAdminAuthService.login(data)
      .subscribe((response: any) => {
        this.router.navigate([this.returnUrl]);
      }, (err: any) => {
        this.loginLoader = false;
      });
  }

  switchLang(e: any) {
    this.translateService.use(e.target.value);
    localStorage.setItem('lang', e.target.value);
    this.currentLang = e.target.value;
  }

  ngOnDestroy(): void {
    $(document.body).removeClass('login-page');
  }

  password() {
    console.log(this.show);
    
    this.show = !this.show;
}

}
