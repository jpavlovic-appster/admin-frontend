import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminType } from 'src/app/models';
import { AdminAuthService } from 'src/app/modules/admin/services/admin-auth.service';
import { SubscriberService } from 'src/app/modules/subscriber-system/services/subscriber.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { AlertService } from 'src/app/services/alert.service';
import { encryptPassword } from 'src/app/services/utils.service';
import { CustomValidators } from 'src/app/shared/validators';
import { SuperAdminAuthService } from '../../super-admin/services/super-admin-auth.service';

@Component({
  selector: 'app-change-subscriber-password',
  templateUrl: './change-subscriber-password.component.html',
  styleUrls: ['./change-subscriber-password.component.scss']
})
export class ChangeSubscriberPasswordComponent implements OnInit {

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
    public authService: AuthenticationService
  ) {
    this.subscriberId = this.route.snapshot.params['subscriberId'];
    this.adminId = this.route.snapshot.params['adminId'];

    this.adminForm = this.formBuilder.group({
      subscriber_id: [this.subscriberId, Validators.required],
      old_password:  ['',[Validators.required]],
      email: [''],
      password: ['', [Validators.pattern(CustomValidators.passwordRegex)]],
      confirm_password: ['',[Validators.required]],
    },{
      validators: [CustomValidators.MustMatch('password', 'confirm_password')]
    });

    if (this.adminId > 0) {
      this.title = 'Edit';
      this.getAdmin();
    }
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
   this.subscriberService.getSubscriberAdmin(this.adminId, this.requestReadPermissions).subscribe((res: any) => {
     this.admin = res.record;
        this.adminForm.patchValue({
          email: this.admin.email,
        });
    });
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

    if (this.adminId > 0) {
      data.id = this.adminId;

      this.subscriberService.updateSubscriberAdmin(data, this.requestUpdatePermissions)
        .subscribe((response: any) => {
          if (response?.message) {
            this.AlertService.success(response.message);
            // toastr.success(response?.message || 'Subscriber Admin has been Updated Successfully!');
          }
        if (this.authService.adminTypeValue === AdminType.Super) {
          this.router.navigate(['/super-admin/subscribers/details', this.subscriberId]);
        } else {
          this.router.navigate(['/users']);
        }
        this.adminLoader = false;
      }, (err: any) => {
        this.adminLoader = false;
      });

    } else {

      this.subscriberService.createSubscriberAdmin(this.adminForm.value, this.componentCreatePermissions)
        .subscribe((response: any) => {
          if (response?.message) {
            this.AlertService.success(response.message);
            // toastr.success(response?.message || 'Subscriber Admin has been Created Successfully!');
          }
        if (this.authService.adminTypeValue === AdminType.Super) {
          this.router.navigate(['/super-admin/subscribers/details', this.subscriberId]);
        } else {
          this.router.navigate(['/agents']);
        }
        this.adminLoader = false;
      }, (err: any) => {
        this.adminLoader = false;
      });

    }

  }

}
