import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SubscriberAuthService } from '../../services/subscriber-auth.service';
import { CustomValidators } from '../../../../shared/validators';
import { encryptPassword } from '../../../../services/utils.service';
import { Constants } from 'src/app/shared/constants';
import { TranslateService } from '@ngx-translate/core';
import { TenantService } from 'src/app/modules/tenant/tenant.service';

declare const $: any;
declare const toastr: any;

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit, AfterViewInit, OnDestroy {

  returnUrl: string = '/sub-dashboard';
  loginForm: FormGroup | any;
  submitted: boolean = false;
  loginLoader: boolean = false;
  show: boolean = false;


  langs: any ;
  currentLang: string = Constants.defaultLang;


  constructor(private formBuilder: FormBuilder,
    private subscriberAuthService: SubscriberAuthService,
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
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/sub-dashboard';
  }

  ngAfterViewInit(): void {
    $(document.body).addClass('hold-transition login-page');
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.loginForm.invalid) return;

    const data = this.loginForm.value;
    data.encrypt_password = encryptPassword(data.password);

    delete data.password;

    this.loginLoader = true;
    this.subscriberAuthService.login(data)
      .subscribe((response: any) => {
        this.translateService.use(response.record.language);
        localStorage.setItem('lang', response.record.language);
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

  getLanguages() {
    this.tenantService.getLang().subscribe((res: any) => {
      this.langs = res.record.data;
    });
  }

  password() {
    this.show = !this.show;
}
}
