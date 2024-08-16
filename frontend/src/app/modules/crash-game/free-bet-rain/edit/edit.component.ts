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
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {


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
      currency: ['', Validators.required],
      bet_amount: ['', [Validators.required, Validators.min(1)]],
      num_free_bets: ['', [Validators.required, Validators.min(1)]],
      start_time: ['', [Validators.required]],
      end_time: ['', [Validators.required]],
      rain_start_time: ['', [Validators.required]],
      rain_end_time: ['', [Validators.required]],
      promotion_name: ['', [Validators.required]],
      minimum_multiplier: ['', [Validators.required, Validators.min(1.01)]],
      expiry_after_claim: ['', [Validators.required,  Validators.min(1)]],
      check_bet_time_before_claim: ['', [Validators.required]],
      check_bet_amount_before_claim: ['', [Validators.required]],
      sub_id: ['']
    }, { validators: [CustomValidators.dateLessThan('start_time', 'end_time'), this.dateInBetween('start_time', 'end_time', 'rain_start_time', 'rain_end_time')] });

    if (this.id > 0) {
      this.title = 'Edit';
      this.getFreeBetRain();
    }


  }
  dateInBetween(start_time: string, end_time: string, rain_start_time: string, rain_end_time: string) {
    return (group: FormGroup) => {
      let start = group.controls[start_time];
      let end = group.controls[end_time];
      let rain_start = group.controls[rain_start_time];
      let rain_end = group.controls[rain_end_time];
      if ((rain_start.errors && !rain_start.errors.inBetween) || (rain_end.errors && rain_end.errors.required)) {
        return;
      }
      if (start.value >= rain_start.value || end.value <= rain_start.value) {
        rain_start.setErrors({ inBetween: true });
      }
      if (end.value <= rain_end.value) {
        console.log('end value is less than rain end value');
        
        rain_end.setErrors({ lessThan: true });
      }
      else if (rain_start.value >= rain_end.value) {
        rain_end.setErrors({ inBetween: true });
      }
      else
        rain_end.setErrors(null);
    }
  }
  ngOnInit(): void {
    this.adminType = AdminType;
    this.getCurrencies();
    this.today = new Date().toISOString().slice(0, 16);
    console.log(this.today);

  }
  doTranslation() {
    if (this.authService.adminTypeValue === AdminType.Super) {
      this.breadcrumbs.push({ title: 'Subscribers', path: '/super-admin/subscribers/list/0' });
      this.breadcrumbs.push({ title: 'Subscribers Details', path: `/super-admin/subscribers/details/${this.subscriberId}` });
      this.breadcrumbs.push({ title: this.title, path: `/super-admin/subscribers/details/${this.subscriberId}` });
    } else {
      this.breadcrumbs.push({ title: 'Free Bet Rain', path: '/crash-game/free-bet-rain' });
      this.breadcrumbs.push({ title: 'Edit Free Bet Rain', path: '/crash-game/free-bet-rain/edit/0' });
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

  getFreeBetRain() {
    this.crashGameService.getFreeBetRain(this.id).subscribe((res: any) => {
      this.freeBet = res.record;
      console.log(res.record);
      this.freeBetFrom.patchValue({
        promotion_name: this.freeBet.promotion_name,
        currency: this.freeBet.currency_code,
        bet_amount: this.freeBet.bet_amount,
        num_free_bets: this.freeBet.num_of_free_bets,
        minimum_multiplier: this.freeBet.minimum_multiplier,
        expiry_after_claim: this.freeBet.expiry_after_claim,
        check_bet_amount_before_claim: this.freeBet.check_bet_amount_before_claim,
        check_bet_time_before_claim: this.freeBet.check_bet_time_before_claim_in_minutes,
        end_time: this.datepipe.transform(this.freeBet.end_time, 'yyyy-MM-ddTHH:MM','+0000'),
        start_time: this.datepipe.transform(this.freeBet.start_time, 'yyyy-MM-ddTHH:MM','+0000'),
        rain_end_time: this.datepipe.transform(this.freeBet.rain_end_time, 'yyyy-MM-ddTHH:MM','+0000'),
        rain_start_time: this.datepipe.transform(this.freeBet.rain_start_time, 'yyyy-MM-ddTHH:MM','+0000'),

      });
    });
  }

  onSubmit() {
    this.submitted = true;

    if (this.freeBetFrom.invalid) return;

    this.adminLoader = true;
    this.subscriberAuthService.subscriberAdminUser.subscribe((res: any) => {
      this.subscriberId = res.subscriber_id;

    });
    var start_date = new Date(this.freeBetFrom.controls.start_time.value);
    var end_date = new Date(this.freeBetFrom.controls.end_time.value);
    var rain_start_date = new Date(this.freeBetFrom.controls.rain_start_time.value);
    var rain_end_date = new Date(this.freeBetFrom.controls.rain_end_time.value);
    this.freeBetFrom.patchValue({
      start_time: start_date,
      end_time: end_date,
      rain_start_time: rain_start_date,
      rain_end_time: rain_end_date,
    });   
    const data = this.freeBetFrom.value;

    if (this.id > 0) {


      data.id = this.id;
      data.sub_id =  this.subscriberId;
      this.crashGameService.updateFreeBetRain(data)
        .subscribe((response: any) => {
          if (response?.message) {
            this.AlertService.success(response.message);
          }
          if (this.authService.adminTypeValue === AdminType.Super) {
            this.router.navigate(['/super-admin/subscribers/details', this.subscriberId]);
          } else {
            this.router.navigate(['/crash-game/free-bet-rain']);
          }
          this.adminLoader = false;
        }, (err: any) => {
          this.adminLoader = false;
        });

    } else {
      
      this.freeBetFrom.patchValue({
        sub_id: this.subscriberId
      });   

      this.crashGameService.createFreeBetRain(this.freeBetFrom.value, this.componentCreatePermissions)
        .subscribe((response: any) => {
          if (response?.message) {
            this.AlertService.success(response.message);
          }
          if (this.authService.adminTypeValue === AdminType.Super) {
            this.router.navigate(['/super-admin/subscribers/details', this.subscriberId]);
          } else {
            this.router.navigate(['/crash-game/free-bet-rain']);
          }
          this.adminLoader = false;
        }, (err: any) => {
          this.adminLoader = false;
        });

    }

  }

  checkDate(e) {
    var date = new Date(e.target.value);
  }
  selectCurrencies(currencies: any) {
    this.f.currency.setValue(currencies);
  }
}
