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
import { SuperAdminAuthService } from '../../../super-admin/services/super-admin-auth.service';
import { CurrenciesService } from '../../../super-admin/super-admin-modules/currencies/currencies.service';
import { CrashGameService } from '../../crash-game.service';
import { SubscriberAuthService } from 'src/app/modules/subscriber-system/services/subscriber-auth.service';
import { DatePipe } from '@angular/common'
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-grant-free-bet',
  templateUrl: './grant-free-bet.component.html',
  styleUrls: ['./grant-free-bet.component.scss']
})
export class GrantFreeBetComponent implements OnInit {

  subscriberId: number = 0;
  id: number = 0;
  currencies: any;
  freeBet: any;

  phoneMinLen: number = 5;

  freeBetFrom: FormGroup | any;
  submitted: boolean = false;
  adminLoader: boolean = false;

  title: string = 'Create';

  adminType: any;

  breadcrumbs: Array<any> = [
    // { title: 'Home', path: '/crash-game/free-bets' },
    // { title: 'Admins', path: '/super-admin/subscribers' }
  ];

  requestReadPermissions = btoa(btoa('admins|:|R'));
  componentCreatePermissions = btoa(btoa('admins|:|C'));
  requestUpdatePermissions = btoa(btoa('admins|:|U'));
  requestSubscriberReadPermissions = btoa(
    btoa('subscriber_configurations|:|R')
  );
  today: any;
  startDate: any;

  constructor(
    public datepipe: DatePipe,
    private AlertService: AlertService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    public superAdminAuthService: SuperAdminAuthService,
    public adminAuthService: AdminAuthService,
    public authService: AuthenticationService,
    private currenciesService: CurrenciesService,
    private crashGameService: CrashGameService,
    public subscriberAuthService: SubscriberAuthService,
    private translate: TranslateService
  ) {
    this.subscriberId = this.route.snapshot.params['subscriberId'];
    this.id = this.route.snapshot.params['id'];
    this.doTranslation();

    this.translate.onLangChange.subscribe(event => {
      this.doTranslation();
    });
    this.freeBetFrom = this.formBuilder.group({
      user_id: ['', Validators.required],
      currency: ['', Validators.required],
      bet_amount: ['', [Validators.required ,  Validators.min(1)]],
      num_free_bets: ['', [Validators.required ,  Validators.min(1)]],
      end_date: ['', [Validators.required]],
      sub_id : ['']
    });

    if (this.id > 0) {
      this.title = 'Edit';

      this.getFreeBet();
    }


  }

  ngOnInit(): void {
    this.adminType = AdminType;
    this.getCurrencies();
    this.today = new Date().toISOString().slice(0, 10);
    console.log(this.today);
    
  }
  doTranslation() {
    if (this.authService.adminTypeValue === AdminType.Super) {
      this.breadcrumbs.push({ title: 'Subscribers', path: '/super-admin/subscribers/list/0' });
      this.breadcrumbs.push({ title: 'Subscribers Details', path: `/super-admin/subscribers/details/${this.subscriberId}` });
      this.breadcrumbs.push({ title: this.title, path: `/super-admin/subscribers/details/${this.subscriberId}` });
    } else {
      this.breadcrumbs.push({ title: this.translate.instant('FREE_BETS'), path: '/crash-game/free-bets' });
      this.breadcrumbs.push({ title:this.translate.instant('GRANT_FREE_BET'), path: '/crash-game/free-bets/create/0' });
    }
  }

  getCurrencies() {
    this.currenciesService
      .getAdminCurrencies(
        this.authService.adminTypeValue === AdminType.Subscriber
          ? this.requestSubscriberReadPermissions
          : this.requestReadPermissions
      )
      .subscribe((res: any) => {
        this.currencies = res.record;
      });
  }


  get f() {
    return this.freeBetFrom.controls;
  }

  getFreeBet() {
    this.crashGameService.getFreeBet(this.id).subscribe((res: any) => {
      this.freeBet = res.record;
       console.log(res.record);

      this.freeBetFrom.patchValue({
        user_id: this.freeBet.user_id,
        currency: this.freeBet.currency_code,
        bet_amount: this.freeBet.bet_amount,
        num_free_bets: this.freeBet.num_of_free_bets,
        end_date: this. datepipe. transform(this.freeBet.end_date, 'yyyy-MM-dd'),
      });
    });
  }

  onSubmit() {
    this.submitted = true;

    if (this.freeBetFrom.invalid) return;

    this.adminLoader = true;
    this.subscriberAuthService.subscriberAdminUser.subscribe((res: any) => {
     this.subscriberId= res.subscriber_id;

    });
   
    console.log(this.freeBetFrom.value);

    const data = this.freeBetFrom.value;


    if (this.id > 0) {
      data.id = this.id;

      this.crashGameService.updateFreeBet(data)
        .subscribe((response: any) => {
          if (response?.message) {
            this.AlertService.success(response.message);

            // toastr.success(response?.message || 'Subscriber Admin has been Updated Successfully!');
          }
        if (this.authService.adminTypeValue === AdminType.Super) {
          this.router.navigate(['/super-admin/subscribers/details', this.subscriberId]);
        } else {
          this.router.navigate(['/crash-game/free-bets']);
        }
        this.adminLoader = false;
      }, (err: any) => {
        this.adminLoader = false;
      });

    } else {
 this.freeBetFrom.patchValue({
      sub_id: this.subscriberId
    });
    console.log(this.freeBetFrom.value);
    
    this.crashGameService.grantFreeBet(this.freeBetFrom.value, this.componentCreatePermissions)
      .subscribe((response: any) => {
        if (response?.message) {
          this.AlertService.success(response.message);
          // toastr.success(response?.message || 'Subscriber Admin has been Created Successfully!');
        }
        if (this.authService.adminTypeValue === AdminType.Super) {
          this.router.navigate(['/super-admin/subscribers/details', this.subscriberId]);
        } else {
          this.router.navigate(['/crash-game/free-bets']);
        }
        this.adminLoader = false;
      }, (err: any) => {
        this.adminLoader = false;
      });

    }

  }

  checkDate(e) {
    var date = new Date(e.target.value);
    this.f.contest_live_date.setValue(e.target.value);
  } 
  selectCurrencies(currencies: any) {
    this.f.currency.setValue(currencies);
  }
}
