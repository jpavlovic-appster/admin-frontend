import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AdminType, Subscriber, Tenant } from 'src/app/models';
import { SubscriberService } from 'src/app/modules/subscriber-system/services/subscriber.service';
import { TenantService } from 'src/app/modules/tenant/tenant.service';

declare const $;

@Component({
  selector: 'app-admin-type-filter',
  templateUrl: './admin-type-filter.component.html',
  styles: [` .mgl-10 { margin-left: 10px; } `]
})

export class AdminTypeFilterComponent implements OnInit {

  @Input() type: string = '';
  @Input() headerTitle: string = '';
  @Input() permission: any;

  @Output() typeHandler: EventEmitter<any> = new EventEmitter();
  @Output() tenantHandler: EventEmitter<any> = new EventEmitter();
  @Output() subscriberHandler: EventEmitter<any> = new EventEmitter();


  adminType = AdminType;
  tenants: Tenant[] = [];
  subscribers: Subscriber[] = [];

  translations = {
    "PLACEHOLDERS.SELECT_TENANT": "",
    "PLACEHOLDERS.SELECT_SUBSCRIBER": ""
  };

  constructor(private tenantService: TenantService,
    private subscriberService: SubscriberService,
    private translateService: TranslateService) { }

  ngOnInit(): void {
    this.getTenantsAll();
    this.getAllSubscribers();

    this.doTranslation();
    this.translateService.onLangChange.subscribe(event => {
      this.doTranslation();
    });
  }



  getTenantsAll() {
    this.tenantService.getTenantsAll(this.permission).subscribe((res: any) => {
      this.tenants = res.record;
      if (this.tenants.length > 0) {
        this.changeTenant(this.tenants[0].id);
      }
    });
  }

  getAllSubscribers() {
    this.subscriberService.getAllSubscribers(this.permission).subscribe((res: any) => {
      this.subscribers = res.record;
    });
  }

  setAdminType(type: string) {
    this.typeHandler.emit(type);

    if (type === AdminType.Tenant && this.tenants.length > 0) {
      this.changeTenant(this.tenants[0].id);
    } else if (type === AdminType.Subscriber && this.subscribers.length > 0) {
      this.changeSubscriber(this.subscribers[0].id);
    }

  }

  changeTenant(tenant_id: any) {
    this.tenantHandler.emit(tenant_id);
  }

  changeSubscriber(subscriber_id: any) {
    this.subscriberHandler.emit(subscriber_id);
  }


  doTranslation() {
    this.translateService.get(Object.keys(this.translations)).subscribe(res => {
      this.translations = res;

      $("#tenant_id").select2({
        placeholder: this.translations['PLACEHOLDERS.SELECT_TENANT'],
      });

      $("#subscriber_id").select2({
        placeholder: this.translations['PLACEHOLDERS.SELECT_SUBSCRIBER'],
      });

    });
  }

}
