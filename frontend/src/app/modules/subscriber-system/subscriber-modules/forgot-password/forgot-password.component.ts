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
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  returnUrl: string = '/users';
  forgotPassswordForm: FormGroup | any;
  submitted: boolean = false;
  loginLoader: boolean = false;

  langs: any ;
  currentLang: string = Constants.defaultLang;


  constructor(private formBuilder: FormBuilder,
    private AlertService: AlertService,
    private subscriberAuthService: SubscriberAuthService,
    private router: Router,
    private route: ActivatedRoute,
    private translateService: TranslateService,
    private tenantService: TenantService
  ) {
    this.forgotPassswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(CustomValidators.emailRegEx)]],
      // password: ['', [Validators.required]],
      // remember_me: [false],
    });
  }

  ngOnInit(): void {
    this.getLanguages();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/users';
  }

  ngAfterViewInit(): void {
    $(document.body).addClass('hold-transition login-page');
  }

  get f() {
    return this.forgotPassswordForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.forgotPassswordForm.invalid) return;

    const data = this.forgotPassswordForm.value;

    this.loginLoader = true;
    this.subscriberAuthService.forgotPassword(data)
      .subscribe((response: any) => {
        console.log(response);
        
        this.AlertService.success(response.message);
      }, (err: any) => {
     
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
