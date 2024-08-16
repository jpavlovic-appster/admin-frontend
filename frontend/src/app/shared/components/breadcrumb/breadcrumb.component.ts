import { Component, Input, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AdminType } from 'src/app/models';
import { TenantService } from 'src/app/modules/tenant/tenant.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styles: [`
    .back { margin-top: -3px; }
  `]
})

export class BreadcrumbComponent implements OnInit {

  @Input() title: string = '';
  @Input() breadcrumbs: Array<any> = [];

  adminTypes = AdminType;

  // remainingCredentials: any[] = [];

  // Permission Varibales
  requestTenantCredReadsPermissions = btoa(btoa('tenant_credentials|:|R'));
  requestSubscriberCredsReadPermissions = btoa(btoa('subscriber_credentials|:|R'));

  constructor(private location: Location,
    public authService: AuthenticationService,
  public tenantService: TenantService) { }

  ngOnInit(): void {
    if ( !this.tenantService.remainingCredsBool && ( this.authService.adminTypeValue == AdminType.Tenant || this.authService.adminTypeValue == AdminType.Subscriber ) ) {
      // this.tenantService.getAdminTenantRemCred(this.authService.adminTypeValue === AdminType.Subscriber ? this.requestSubscriberCredsReadPermissions : this.requestTenantCredReadsPermissions).subscribe();
      // this.getRemTenCred();
    }
  }

  goBack() {
    this.location.back();
  }

  // getRemTenCred() {
    // this.tenantService.getAdminTenantRemCred(this.authService.adminTypeValue === AdminType.Subscriber ? this.requestSubscriberCredsReadPermissions : this.requestTenantCredReadsPermissions).subscribe();
      // .subscribe((res: any) => {
      //   this.remainingCredentials = res.record;
      // });
  // }

}
