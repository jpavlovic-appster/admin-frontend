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


// declare const toastr: any;

@Component({
  templateUrl: './edit-subscriber-admin.component.html'
})

export class EditSubscriberAdminComponent implements OnInit {

  subscriberId: number = 0;
  adminId: number = 0;
  passChange: boolean = false;
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
      email: ['', [Validators.required, Validators.pattern(CustomValidators.emailRegEx)]],
      password: ['',[Validators.required, Validators.pattern(CustomValidators.passwordRegex)]],
      confirm_password: ['',[Validators.required]],
      agent_name: ['', [Validators.required, Validators.minLength(3)]],
      first_name: ['', [Validators.required, Validators.minLength(3)]],
      last_name: ['', [Validators.required, Validators.minLength(3)]],
      phone: ['', [Validators.required, Validators.minLength(this.phoneMinLen), Validators.pattern(CustomValidators.phoneRegex)]],
      active: [true]
    },{
      validators: [CustomValidators.MustMatch('password', 'confirm_password')]
    });

    if (this.adminId > 0) {
      this.title = 'Edit';
      this.getAdmin();
    }
    // const passControl = this.adminForm.get('password');
    // passControl.setValidators([Validators.required, Validators.pattern(CustomValidators.passwordRegex)]);
    // passControl.updateValueAndValidity();


    if (this.authService.adminTypeValue === AdminType.Super) {
      this.breadcrumbs.push({ title: 'Subscribers', path: '/super-admin/subscribers/list/0' });
      this.breadcrumbs.push({ title: 'Subscribers Details', path: `/super-admin/subscribers/details/${this.subscriberId}` });
      this.breadcrumbs.push({ title: this.title, path: `/super-admin/subscribers/details/${this.subscriberId}` });
    } else {
      // this.breadcrumbs.push({ title: 'Admins', path: '/agents' });
      this.breadcrumbs.push({ title: `${this.title} Admins`, path: '/agents' });
    }

  }

  ngOnInit(): void {
    this.adminType = AdminType;
  }

  getAdmin() {
    this.subscriberService.getSubscriberAdmin(this.adminId, this.requestReadPermissions).subscribe((res: any) => {
      this.admin = res.record;

      this.adminForm.patchValue({
        email: this.admin.email,
        agent_name: this.admin.agent_name,
        first_name: this.admin.first_name,
        last_name: this.admin.last_name,
        phone: this.admin.phone,
        active: this.admin.active
      });
    });
  }

  get f() {
    return this.adminForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    if(!this.passChange && this.adminId>0){
      this.adminForm.get('password').setErrors(null);
      this.adminForm.get('confirm_password').setErrors(null);
    }
    // console.log(this.adminForm.value);
    if (this.adminForm.invalid) return;

    this.adminLoader = true;
    const data = this.adminForm.value;

    if (data.password) {
      data.encrypted_password = encryptPassword(data.password);
    }

    if (this.adminId > 0) {
      data.id = this.adminId;
     const passControl = this.adminForm.get('password');
     this.adminForm.get('password').setValidators([]);
     passControl.updateValueAndValidity();
      this.subscriberService.updateSubscriberAdmin(data, this.requestUpdatePermissions)
        .subscribe((response: any) => {
          if (response?.message) {
            this.AlertService.success(response.message);
            // toastr.success(response?.message || 'Subscriber Admin has been Updated Successfully!');
          }
          if (this.authService.adminTypeValue === AdminType.Super) {
            this.router.navigate(['/super-admin/subscribers/details', this.subscriberId]);
          } else {
            this.router.navigate(['/agents/subscriber/', this.subscriberId, this.adminId]);
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

  changePassword(type:any) {
    if(type ==1)
    this.passChange = true;
    else
    this.passChange = false;

  }



}
