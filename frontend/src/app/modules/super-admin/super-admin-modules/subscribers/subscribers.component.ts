import { Component, OnInit } from '@angular/core';
import { Subscriber } from 'src/app/models';
import { PageSizes } from 'src/app/shared/constants';
import { SubscriberService } from '../../../subscriber-system/services/subscriber.service';

import Swal from 'sweetalert2';
import { AlertService } from 'src/app/services/alert.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { TenantService } from 'src/app/modules/tenant/tenant.service';

declare const toastr: any;

@Component({
  templateUrl: './subscribers.component.html',
  styleUrls: ['./subscribers.component.scss']
})

export class SubscribersComponent implements OnInit {

  pageSizes: any[] = PageSizes;

  params: any = {
    size: 10,
    page: 1,
    search: '',
    organization: '',
    status: '',
    org: '',
    order: 'desc',
    sort_by: 'created_at'
  };

  order= 'asc';
  p: number = 1;
  total: number = 0;
  subscribers: Subscriber[] = [];
  revenueData: any;
  winning_amount = 0;
  bet_amount = 0;
  revenue = 0;

  translations = {
    "HOME": "",
    "SUBSCRIBERS": "",
    "SENTENCES.CONFIRM_ARE_YOU_SURE": "",
    "SENTENCES.CONFIRM_ACTIVE": "",
    "SENTENCES.CONFIRM_IN_ACTIVE": "",
    "SENTENCES.CONFIRM_YES": "",
    "ACTION_BUTTON.CANCEL": "",
    "ORGANIZATIONS": ""
  };

  breadcrumbs: Array<any> = [];

  // Permissions variables
  requestReadPermissions = btoa(btoa('subscribers|:|R'));
  requestDisablePermissions = btoa(btoa('subscribers|:|disable'));
  canCreate: boolean = false;
  canEdit: boolean = false;
  canDisable: boolean = false;
  id: any;
  org: any;
  organizations: any;

  constructor(private subscriberService: SubscriberService,
    private AlertService: AlertService,
    private route: ActivatedRoute,
    private tenantService: TenantService,
    private translateService: TranslateService) {
    // this.id = this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.route.params.subscribe((data: any) => {
      this.id = data['id'] ?? '0';
      if (this.id > 0)
        this.getOrganization();
      else
        this.getOrganizations();
      this.getSubscribers();
    })

    this.setPermissions();
    this.doTranslation();
    this.translateService.onLangChange.subscribe(event => {
      this.doTranslation();
    });
  }

  setPermissions() {
    let loggedInUserPermissions: any = localStorage.getItem('permissions');
    loggedInUserPermissions = JSON.parse(atob(atob(loggedInUserPermissions)));

    let subscribersPermissions = loggedInUserPermissions.subscribers;

    // console.log(subscribersPermissions);

    this.canCreate = subscribersPermissions.includes('C');
    this.canEdit = subscribersPermissions.includes('U');
    this.canDisable = subscribersPermissions.includes('disable');
  }

  getOrganization() {
    this.tenantService.getOrganization(this.id).subscribe((res: any) => {
      this.org = res.record;
    });
  }

  pageChanged(page: number) {
    this.params = { ...this.params, page };
    this.getSubscribers();
  }

  getOrganizations() {
    this.tenantService.getOrganizations().subscribe((res: any) => {
      this.organizations = res.record;
    });
  }

  getSubscribers() {
    if (this.id > 0)
      this.params = { ...this.params, organization: this.id };
    else
      this.params = { ...this.params, organization: '' };

    this.subscriberService.getSubscribers(this.params, this.requestReadPermissions).subscribe((res: any) => {
      this.subscribers = res.record.data;
      this.total = res.record.total;

      // this.revenueData = res.record.data;
      //   this.winning_amount = 0;
      //   this.bet_amount = 0;
      //   if(res.record.data)
      //   {
      //     for(let i of this.revenueData){
      //       console.log(i);
      //        for(let j of i.users){


      //         this.winning_amount = parseFloat(j.winning_amount) + this.winning_amount;
      //         this.bet_amount = parseFloat(j.bet_amount) + this.bet_amount;
      //       }
      //     }
      //     this.revenueData = this.bet_amount - this.winning_amount;
      //     this.revenueData = this.revenueData.toFixed(4)

      // }
    });
  }

  filter(event: any) {
    this.p = 1;
    this.params = { ...this.params, page: this.p };
    this.getSubscribers();
  }

  resetFilter() {
    this.p = 1;
    this.params = {
      size: 10,
      page: 1,
      search: '',
      status: '',
      org: '',
      order: 'desc',
      sort_by: 'created_at'
    }
    this.getSubscribers();
  }


  async changeStatus(subscriber: Subscriber) {

    if (await this.AlertService.swalConfirm((subscriber.status == 1 || subscriber.status == 2) ? this.translations['SENTENCES.CONFIRM_IN_ACTIVE'] : this.translations['SENTENCES.CONFIRM_ACTIVE'])) {

      this.subscriberService.updateSubscriberStatus({ id: subscriber.id, status: (subscriber.status == 1 || subscriber.status == 2) ? 0 : 1 }, this.requestDisablePermissions).subscribe((res: any) => {

        if (res?.message) {
          this.AlertService.success(res.message);
          // toastr.success(res.message || 'Subscriber updated successfully');
        }
        this.subscribers = this.subscribers.map((s: Subscriber) => {
          if (s.id == subscriber.id) {
            s.status = (subscriber.status == 1 || subscriber.status == 2) ? 0 : 1;
          }
          return s;
        });
      });

    }

    // Swal.fire({
    //   title: 'Are you sure?',
    //   text: (subscriber.status == 1 || subscriber.status == 2) ? this.translations['SENTENCES.CONFIRM_IN_ACTIVE'] : this.translations['SENTENCES.CONFIRM_ACTIVE'],
    //   icon: 'warning',
    //   showCancelButton: true,
    //   confirmButtonColor: '#3085d6',
    //   cancelButtonColor: '#d33',
    //   confirmButtonText: this.translations['SENTENCES.CONFIRM_YES'],
    //   cancelButtonText: this.translations['ACTION_BUTTON.CANCEL']
    // }).then((result) => {
    //   if (result.isConfirmed) {

    //     this.subscriberService.updateSubscriberStatus({ id: subscriber.id, status: (subscriber.status == 1 || subscriber.status == 2) ? 0 : 1 }, this.requestDisablePermissions).subscribe((res: any) => {

    //       if (res?.message) {
    //         this.AlertService.success(res.message);
    //         // toastr.success(res.message || 'Subscriber updated successfully');
    //       }
    //       this.subscribers = this.subscribers.map((s: Subscriber) => {
    //         if (s.id == subscriber.id) {
    //           s.status = (subscriber.status == 1 || subscriber.status == 2) ? 0 : 1;
    //         }
    //         return s;
    //       });
    //     });

    //   }
    // });

  }

  doTranslation() {
    this.translateService.get(Object.keys(this.translations)).subscribe(res => {
      this.translations = res;
      if (this.id == 0)
        this.breadcrumbs = [

          { title: this.translations['SUBSCRIBERS'], path: '/super-admin/subscribers/list/0' },
        ];
      else {
        this.breadcrumbs = [
          { title: this.translations['ORGANIZATIONS'], path: '/super-admin/organizations' },
          { title: this.translations['SUBSCRIBERS'], path: '/super-admin/subscribers/list/0' },
        ];
      }
    });
  }

  setOrder(column: any) {
    this.p = 1;
    this.order = (this.order == 'asc' ? 'desc' : 'asc')

    this.params = { ...this.params, page: this.p, order: this.order, sort_by: column };
    this.getSubscribers();
  }

}
