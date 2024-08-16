import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminType } from 'src/app/models';
import { AdminAuthService } from 'src/app/modules/admin/services/admin-auth.service';
import { SubscriberService } from 'src/app/modules/subscriber-system/services/subscriber.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { AlertService } from 'src/app/services/alert.service';
import { encryptPassword } from 'src/app/services/utils.service';
import { CustomValidators } from 'src/app/shared/validators';
import { SuperAdminAuthService } from '../../services/super-admin-auth.service';
import { TenantService } from 'src/app/modules/tenant/tenant.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {


  subscriberId: number = 0;
  adminId: number = 0;

  admin: any;

  phoneMinLen: number = 5;

  adminForm: FormGroup | any;
  submitted: boolean = false;
  adminLoader: boolean = false;

  title: string = 'Create';

  adminType: any;

  breadcrumbs: Array<any> = [
    // { title: 'Home', path: '/super-admin' },
    // { title: 'Admins', path: '/super-admin/subscribers' }
  ];

  requestReadPermissions = btoa(btoa('admins|:|R'));
  componentCreatePermissions = btoa(btoa('admins|:|C'));
  requestUpdatePermissions = btoa(btoa('admins|:|U'));

  constructor(
    private AlertService: AlertService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private subscriberService: SubscriberService,
    public superAdminAuthService: SuperAdminAuthService,
    public adminAuthService: AdminAuthService,
    public authService: AuthenticationService,
    public tenantService: TenantService,
  ) {
    this.adminForm = this.formBuilder.group({
      admin_id: [this.adminId, Validators.required],
      old_password: ['', [Validators.required]],
      email: [''],
      password: ['', [Validators.pattern(CustomValidators.passwordRegex)]],
      confirm_password: ['', [Validators.required]],
    }, {
      validators: [CustomValidators.MustMatch('password', 'confirm_password')]
    });
    this.title = 'Edit';
    this.getAdmin();

    const passControl = this.adminForm.get('password');
    passControl.setValidators([Validators.required, Validators.pattern(CustomValidators.passwordRegex)]);
    passControl.updateValueAndValidity();

    // this.breadcrumbs.push({ title: 'Admins', path: '/agents' });
    this.breadcrumbs.push({ title: `Change Password`, path: '/agents' });

  }

  ngOnInit(): void {
    this.adminType = AdminType;
  }

  getAdmin() {
    this.superAdminAuthService.superAdminUser.subscribe((res: any) => {
      if (Object.keys(res).length) {
        this.adminId = res.id
        this.adminForm.patchValue({
          email: res.email
        });
      }
    })
  }

  get f() {
    return this.adminForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    // console.log(this.adminForm.value);
    if (this.adminForm.invalid) return;

    this.adminLoader = true;
    const data = this.adminForm.value;

    if (data.password) {
      data.encrypted_password = encryptPassword(data.password);
    }

    data.id = this.adminId;

    this.tenantService.updateSuperAdmin(data)
      .subscribe((response: any) => {
        if (response?.message) {
          this.AlertService.success(response.message);
        }
        if (this.authService.adminTypeValue === AdminType.Super) {
          this.router.navigate(['/super-admin/change-password']);
        } else {
          this.router.navigate(['/users']);
        }
        this.adminLoader = false;
      }, (err: any) => {
        this.adminLoader = false;
      });


  }

}

