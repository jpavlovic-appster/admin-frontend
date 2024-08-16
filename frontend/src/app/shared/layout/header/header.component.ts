import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminAuthService } from 'src/app/modules/admin/services/admin-auth.service';
import { SuperAdminAuthService } from 'src/app/modules/super-admin/services/super-admin-auth.service';
import { LayoutService } from '../layout.service';
import { interval, Subscription } from 'rxjs';
import { SubscriberAuthService } from 'src/app/modules/subscriber-system/services/subscriber-auth.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { AdminType } from 'src/app/models';
import { Constants } from '../../constants';
import { TranslateService } from '@ngx-translate/core';
import { TenantService } from 'src/app/modules/tenant/tenant.service';

declare const $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [`  `]
})

export class HeaderComponent implements OnInit, AfterViewInit, OnDestroy {

  adminType: string = '';

  subscription!: Subscription;

  notifications: any[] = [];

  langs: any = Constants.supportedLangs;
  currentLang: string = Constants.defaultLang;

    // Permission Varibales
  affiliateRequestReadPermissions = btoa(btoa('affiliates|:|R'));
  subscriberRequestReadPermissions = btoa(btoa('admins|:|R'));

  requestReadPermissions = btoa(btoa('notifications|:|R'));

  constructor(private router: Router,
    private layoutService: LayoutService,
    public adminAuthService: AdminAuthService,
    public superAdminAuthService: SuperAdminAuthService,
    public subscriberAuthService: SubscriberAuthService,
    public authService: AuthenticationService,
    public translateService: TranslateService,
    private tenantService: TenantService
  ) {

    // this.translateService.addLangs(Object.keys(Constants.supportedLangs));
    // this.translateService.setDefaultLang(Constants.defaultLang);

  }

  ngOnInit() {
    this.switchLang({ target: { value: localStorage.getItem('lang') || 'en' } });
    this.adminType = (this.superAdminAuthService.superAdminTokenValue && this.superAdminAuthService.superAdminTokenValue.length > 0) ? AdminType.Super
      : (this.adminAuthService.adminTokenValue && this.adminAuthService.adminTokenValue.length > 0) ? AdminType.Tenant
        : (this.subscriberAuthService.subscriberAdminTokenValue && this.subscriberAuthService.subscriberAdminTokenValue.length > 0) ? AdminType.Subscriber : AdminType.Affiliate;

    this.authService.setAdminType();

    if (this.adminType == AdminType.Super) {
      this.superAdminAuthService.getPersonalDetails().subscribe();
    } else if (this.adminType == AdminType.Tenant) {
      this.adminAuthService.getPersonalDetails().subscribe();
      // this.getUnreadNotifications();
    } else if (this.adminType == AdminType.Subscriber) {
      this.subscriberAuthService.getPersonalDetails(this.subscriberRequestReadPermissions).subscribe();
    }
    this.getLanguages();
    this.tenantService.isLanguageUpdated().subscribe((data:Boolean)=>{
      if(data){
      this.getLanguages();
      }
    })
  }

  ngAfterViewInit(): void {

  }

  toggleSidebar() {
    if ($('body').hasClass('sidebar-collapse')) {
      $('body').removeClass('sidebar-collapse');
      this.layoutService.changeSidebarToggle(true);
    } else {
      this.layoutService.changeSidebarToggle(false);
      $('body').addClass('sidebar-collapse');
    }
  }

  getLanguages() {
    this.tenantService.getLang().subscribe((res: any) => {
      this.langs = res.record.data;

    });
  }
  logout() {
    $('#preloader').css('height', '');
    $('#preloader img').show();

    const superAdminToken = this.superAdminAuthService.superAdminTokenValue;

    if (superAdminToken && superAdminToken.length > 0) {
      this.superAdminAuthService.logout().subscribe(() => {
        this.hideLoader();
      });
    } else if (this.adminAuthService.adminTokenValue && this.adminAuthService.adminTokenValue.length > 0) {
      this.adminAuthService.logout().subscribe(() => {
        this.hideLoader();
      });
    } else if (this.subscriberAuthService.subscriberAdminTokenValue && this.subscriberAuthService.subscriberAdminTokenValue.length > 0) {
      this.subscriberAuthService.logout().subscribe(() => {
        this.hideLoader();
      });
    }

  }

  hideLoader() {
    $('#preloader').css('height', 0);
    $('#preloader img').hide();
  }


  switchLang(e: any) {
    this.translateService.use(e.target.value);
    localStorage.setItem('lang', e.target.value);
    this.currentLang = e.target.value;
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
