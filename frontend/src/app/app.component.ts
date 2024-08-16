import { Component, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AdminType } from './models';
import { TenantService } from './modules/tenant/tenant.service';
import { AuthenticationService } from './services/authentication.service';



declare const $: any;
@Component({
  selector: 'app-root',
  template: `<ng-progress [spinner]="false"></ng-progress>
              <router-outlet></router-outlet>`,
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

  constructor(private router: Router,
    private authService: AuthenticationService,
    private tenantService: TenantService) { }

  ngOnInit(): void {
    this.router.events.subscribe(evt => {
      if (evt instanceof NavigationStart) {
        //  console.log(this.router.url);
      }

      if (evt instanceof NavigationEnd) {
        // console.log(this.router.url);
        // $("html, body").animate({ scrollTop: 0 }, "slow");
        $(window).scrollTop(0);
      }

    });

    console.log(location.host)
    console.log(environment.DEV_URL);

    if (localStorage.getItem('SuperAdminAuthToken') || localStorage.getItem('SubscriberAdminAuthToken')) {
      console.log('hi');
    }
  
    else if (location.host != environment.DEV_URL) {

      if (location.host === environment.SUPER_URL) {
        this.router.navigate(['/super-admin/login']);
      } else if (location.host === environment.SUB_URL) {
        if (location.pathname.includes('subscriber/reset-password'))
          console.log('hi')
        else
          this.router.navigate(['/subscriber/login']);

      } else {     
        this.router.navigate(['/404']);
      }

    }
    else{
    console.log('hi');
    }


  }

}
