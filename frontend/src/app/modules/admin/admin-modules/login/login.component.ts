import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminAuthService } from '../../services/admin-auth.service';
import { CustomValidators } from 'src/app/shared/validators';
import { encryptPassword } from 'src/app/services/utils.service';
import { Constants } from 'src/app/shared/constants';
import { TranslateService } from '@ngx-translate/core';
declare const $: any;
declare const toastr: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit, AfterViewInit, OnDestroy {

  returnUrl: string = '/';
  loginForm: FormGroup | any;
  submitted: boolean = false;
  loginLoader: boolean = false;

  langs: any = Constants.supportedLangs;
  currentLang: string = Constants.defaultLang;

  constructor(private formBuilder: FormBuilder,
    private adminAuthService: AdminAuthService,
    private router: Router,
    private route: ActivatedRoute,
    private translateService: TranslateService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(CustomValidators.emailRegEx)]],
      password: ['', [Validators.required]],
      remember_me: [false],
    });
  }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
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
    data.password = encryptPassword(data.password);

    this.loginLoader = true;
    this.adminAuthService.login(data)
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

}
