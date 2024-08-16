import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminAuthService } from 'src/app/modules/admin/services/admin-auth.service';
import { SuperAdminAuthService } from 'src/app/modules/super-admin/services/super-admin-auth.service';
import { LayoutService } from '../layout.service';
import { SubscriberAuthService } from 'src/app/modules/subscriber-system/services/subscriber-auth.service';
import { AdminType } from 'src/app/models';

declare const $: any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})

export class SidebarComponent implements OnInit, AfterViewInit {

  adminType: string = '';
  permissions: any;
  canAccess: any = [];

  constructor(public router: Router,
    public layoutService: LayoutService,
    public adminAuthService: AdminAuthService,
    public superAdminAuthService: SuperAdminAuthService,
    public subscriberAuthService: SubscriberAuthService
  ) {
  }

  ngOnInit() {

    this.adminType = (this.superAdminAuthService.superAdminTokenValue && this.superAdminAuthService.superAdminTokenValue.length > 0) ? AdminType.Super
      : (this.adminAuthService.adminTokenValue && this.adminAuthService.adminTokenValue.length > 0) ? AdminType.Tenant
      : (this.subscriberAuthService.subscriberAdminTokenValue && this.subscriberAuthService.subscriberAdminTokenValue.length > 0) ? AdminType.Subscriber : AdminType.Affiliate;

    this.permissions = (this.adminType === AdminType.Super) ? this.superAdminAuthService.superAdminPermissionsValue
      : (this.adminType === AdminType.Tenant) ? this.adminAuthService.adminPermissionsValue: this.subscriberAuthService.subscriberAdminPermissionsValue;

    this.permissions = JSON.parse(atob(atob(this.permissions)));

    for (let p in this.permissions) {
      if (this.permissions[p].includes('R')) {
        this.canAccess.push(p);
      }

      if (p === 'bet_history' && this.permissions[p].includes('bet_settlement')) {
        this.canAccess.push('bet_settlement');
      }
    }
    
  }

  ngAfterViewInit() {
    $(".nav-main-item").on('click', function (this: any) {
      if ($(this).closest('.nav-item').hasClass("menu-is-opening menu-open")) {
        $(this).closest('.nav-item').removeClass('menu-is-opening menu-open');
      } else {
        $(this).closest('.nav-item').addClass('menu-is-opening menu-open');
      }
    });


    $('.sidebar').overlayScrollbars({
      className: 'os-theme-light',
      sizeAutoCapable: true,
      scrollbars: {
        autoHide: 'l',
        clickScrolling: true
      }
    });

  }

}
