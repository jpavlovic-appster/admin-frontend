import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SubscriberAuthService } from '../../services/subscriber-auth.service';
import { CustomValidators } from '../../../../shared/validators';
import { encryptPassword } from '../../../../services/utils.service';
import { Constants } from 'src/app/shared/constants';
import { TranslateService } from '@ngx-translate/core';
import { TenantService } from 'src/app/modules/tenant/tenant.service';
import * as $ from "jquery";
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  returnUrl: string = '/users';
  resetPasswordForm: FormGroup | any;
  submitted: boolean = false;
  loginLoader: boolean = false;

  langs: any ;
  currentLang: string = Constants.defaultLang;
  token: any;

  constructor(private formBuilder: FormBuilder,
    private AlertService: AlertService,
    private subscriberAuthService: SubscriberAuthService,
    private router: Router,
    private route: ActivatedRoute,
    private translateService: TranslateService,
    private tenantService: TenantService
  ) {
    this.resetPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(CustomValidators.emailRegEx)]],
      password: ['', [Validators.required, Validators.pattern(CustomValidators.passwordRegex)]],
      confirm_password:  ['', [Validators.required]],
    },{
      validators: [CustomValidators.MustMatch('password', 'confirm_password')]
    });
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.params['token'];    
    this.subscriberAuthService.checkResetPasswordToken(this.token)
      .subscribe((response: any) => {
        this.resetPasswordForm.patchValue({
          email: response.record
        });
        this.AlertService.success("Token verified");
      }, (err: any) => {
        
        this.router.navigate(['/subscriber/login']);
      });
    this.getLanguages();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/users';
  }

  ngAfterViewInit(): void {
    $(document.body).addClass('hold-transition login-page');
  }

  get f() {
    return this.resetPasswordForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.resetPasswordForm.invalid) return;

    const data = this.resetPasswordForm.value;

    if (data.password) {
      data.encrypted_password = encryptPassword(data.password);
    }
    this.loginLoader = true;
    this.subscriberAuthService.resetPassword(data)
      .subscribe((response: any) => {
        
        this.router.navigate(['/subscriber/login']);
      }, (err: any) => {
      
        this.router.navigate(['/subscriber/login']);
      });
      this.loginLoader = false;
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
}

