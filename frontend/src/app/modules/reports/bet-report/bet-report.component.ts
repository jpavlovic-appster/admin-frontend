import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { SuperAdminAuthService } from '../../super-admin/services/super-admin-auth.service';
import { ReportService } from '../reports.service';
import { PageSizes } from 'src/app/shared/constants';
import { TenantService } from '../../tenant/tenant.service';
import { environment } from 'src/environments/environment';
import { SubscriberService } from '../../subscriber-system/services/subscriber.service';
import { formatDate } from '@angular/common';
import { ExcelService } from 'src/app/services/excel.service';
import { TranslateService } from '@ngx-translate/core';
import { AlertService } from 'src/app/services/alert.service';
import { SubscriberAuthService } from '../../subscriber-system/services/subscriber-auth.service';

declare const $: any;

@Component({
  selector: 'app-bet-report',
  templateUrl: './bet-report.component.html',
  styleUrls: ['./bet-report.component.scss']
})

export class BetReportComponent implements OnInit, AfterViewInit {

  @ViewChild('f') form!: any;

  searchLeaguesUrl: string = '';
  selectedTenants: any[] = [];
  selectedCoulumn: any;
  organizations: any;
  sports: any[] = [];
  countries: any[] = [];
  leagues: any[] = [];
  matches: any[] = [];

  allTenants: any[] = [];

  pageSizes = PageSizes;

  reports: any[] = [];

  report: any;


  p: number = 1;

  format: string = "YYYY-MM-DD HH:mm";

  total: number = 0;
  pageNextTotal: number = 0;
  pageCurrentTotal: number = 0;
  params: any = {
    size: PageSizes[0].name,
    page: 1,
    organization: '',
    search: '',
    start_date: '',
    end_date: '',
    sport_id: '',
    winning_min_amt: '',
    winning_max_amt: '',
    tenant_id: '',
    result: '',
    sort_by: 'created_at',
    order: 'desc',
    sport: '0',
  };

  breadcrumbs: Array<any> = [
    // { title: 'Home', path: '/super-admin' },
    { title: 'Bet Report', path: '/reports/bet-report' },
  ];
  blob: any;
  current_date: any;
  start_date: any;
  end_date: any;
  order = 'asc';
  subscriberId: any;

  constructor(public reportService: ReportService,
    private AlertService: AlertService,
    // private excelService: ExcelService
    private tenantService: TenantService,
    public superAdminAuthService: SuperAdminAuthService,
    public excelService: ExcelService,
    private subscriberService: SubscriberService,
    public subscriberAuthService: SubscriberAuthService,
    private translateService: TranslateService) { }

  requestReadPermissions = btoa(btoa('bet_report|:|R'));

  ngOnInit(): void {
    this.current_date = new Date();
    this.end_date = formatDate(this.current_date, 'yyyy-MM-dd 23:59', 'en-US');
    this.start_date = this.current_date.setDate(this.current_date.getDate() - 7);
    this.start_date = formatDate(this.start_date, 'yyyy-MM-dd 00:00', 'en-US');
    this.params = { ...this.params, start_date: this.start_date, end_date: this.end_date };
    this.pageNextTotal = this.params.size;
    this.pageCurrentTotal = this.p;
    if (this.superAdminAuthService.superAdminTokenValue && this.superAdminAuthService.superAdminTokenValue.length > 0) {
      this.getOrganizations()
      // this.getSubscribersAll();
    } else {
      if (this.subscriberAuthService.subscriberAdminTokenValue && this.subscriberAuthService.subscriberAdminTokenValue.length > 0) {
        this.subscriberAuthService.subscriberAdminUser.subscribe((res: any) => {
          if (Object.keys(res).length) {
            this.subscriberId = res.subscriber_id;
            console.log(res.subscriber_id);
            this.params.tenant_id = this.subscriberId;
            this.getReport();
          }
        });
      }
      this.searchLeaguesUrl = environment.API_URL + `admin/sports/leagues/search`;
    }
  }

  ngAfterViewInit(): void {
    const that = this;

    setTimeout(() => {

      if (this.params.start_date && this.params.end_date) {
        $('#filter_date').daterangepicker({
          startDate: new Date(this.params.start_date),
          endDate: new Date(this.params.end_date),
          locale: {
            format: this.format
          }
        }, function (start: any, end: any) {
          const start_date = start.format(that.format);
          const end_date = end.format(that.format);
          that.selectDateRange({ start_date, end_date });
        });
      } else {
        $('#filter_date').val('');
      }
    }, 50);
  }

  getOrganizations() {
    this.tenantService.getOrganizations().subscribe((res: any) => {
      this.organizations = res.record;
      if (this.organizations && this.organizations.length > 0) {
        this.orgFilter(this.organizations[0].id);
      }
    });
  }

  getTenantsAll() {
    this.tenantService.getTenantsAll().subscribe((res: any) => {
      this.allTenants = res.record;
      if (this.allTenants && this.allTenants.length > 0) {
        this.tenantFilter(this.allTenants[0].id);
        this.searchLeaguesUrl = environment.API_URL + `super/admin/sports/leagues/search?tenant_id=${this.allTenants[0].id}`;
      }
    });
  }

  selectReport(report: any) {
    this.report = report;
  }

  getReport() {
    const that = this;
    if (this.params.end_date <= '2000') {
      this.reports = [];
      this.total = 0;
    }
    else {
      this.reportService.getBetReports(this.params).subscribe((res: any) => {
        this.reports = res.record.data;
        this.total = res.record.total;

      });
    }

    let limit = this.params.size;
    let offset = 1;
    if (this.p > 1) {
      offset = limit * (this.p - 1);
    }
    this.pageCurrentTotal = offset;

    this.pageNextTotal = (offset > 1 ? offset : 0) + parseInt(limit);
    if (this.total < this.pageNextTotal) {
      this.pageNextTotal = this.total;
    }
  }

  setOrder(column: any) {
    this.p = 1;
    this.order = (this.order == 'asc' ? 'desc' : 'asc')

    this.params = { ...this.params, page: this.p, order: this.order, sort_by: column };
    this.getReport();
  }

  getAllSport() {
    // this.sportService.getAdminAllSports(this.requestReadPermissions).subscribe((res: any) => {
    //   this.sports = res.record;
    // });
  }

  getAllCountries() {
    // this.sportService.getAdminAllCountries(this.requestReadPermissions).subscribe((res: any) => {
    //   this.countries = res.record;
    // });
  }

  // getAllLeagues(tenant_id?: any) {
  //   this.sportService.getAdminAllLeagues({ tenant_id: tenant_id ? tenant_id : '' }).subscribe((res: any) => {
  //     this.leagues = res.record;
  //   });
  // }


  getSubscribersAll() {
    this.subscriberService.getAllSubscribers(this.requestReadPermissions).subscribe((res: any) => {
      this.allTenants = res.record;
      if (this.allTenants && this.allTenants.length > 0) {
        this.tenantFilter(this.allTenants[0].id);
      }
    });
  }

  getSubscribers() {
    this.subscriberService.getOrgSubscribers(this.params.organization).subscribe((res: any) => {
      this.allTenants = res.record;

      if (this.allTenants && this.allTenants.length > 0) {
        console.log(res.record);

        setTimeout(() => {
          $("#tenant_id").val(this.allTenants[0].id).trigger('change');
        }, 100);

        //   this.selectedTenants.push(`0 : `+this.allTenants[0].id)
        // this.tenantFilter(this.allTenants[0].id);

      }
      else {
        this.reports = [];
        this.total = 0;
      }

    });
  }

  // changeSubscriber(subscriber_id: any) {
  //   this.playerP = 1;
  //   this.playerParams = { ...this.playerParams, page: 1, subscriber_id };
  //   this.getPlayers();
  // }

  filter(evt: any) {
    this.p = 1;
    this.params = { ...this.params, page: this.p };
    this.getReport();
  }

  formValidFilter(evt: any) {
    if (this.form.valid) {
      this.getReport();
    }
  }

  tenantFilter(tenant_id: any) {
    tenant_id = tenant_id.map((el: any) => parseInt(el));
    if (tenant_id.length == 0) {
      this.AlertService.error("Can't remove all subscribers");
      setTimeout(() => {
        $("#tenant_id").val(this.allTenants[0].id).trigger('change');
      }, 100);
     return;
    }

    let selectedTenants = this.params.tenant_id.split(',').map((el: any) => parseInt(el));
    let oldContainAll =  selectedTenants.includes(-1);
    let newContainAll= tenant_id.includes(-1);
    if(oldContainAll && newContainAll && selectedTenants.length==1){
      let index= tenant_id.findIndex((el:any)=>el==-1);
      if(index>-1){
        tenant_id.splice(index,1);
      }
      setTimeout(() => {
        $("#tenant_id").val(tenant_id.join(',')).trigger('change');
      }, 100);
      return;
    }else if(!oldContainAll && newContainAll){
      setTimeout(() => {
        $("#tenant_id").val('-1').trigger('change');
      }, 100);
      this.params = { ...this.params, page: this.p, tenant_id: tenant_id.join(',') };
      return;
    }
  
    // else if(tenant_id.includes(-1) && tenant_id.length>1){
    //   setTimeout(() => {
    //     $("#tenant_id").val('-1').trigger('change');
    //   }, 100);
    //   this.p = 1;
    //   this.params = { ...this.params, page: this.p, tenant_id: -1 };
    //   console.log('hi');
      
    //   // this.getReport();
    // }

    // else {
      console.log(tenant_id,"lal")
      
      this.p = 1;
      this.params = { ...this.params, page: this.p, tenant_id: tenant_id.join(',') };
      // return;
      this.getReport();
    
    // }
  }


  orgFilter(organization: any) {
    this.p = 1;
    this.params = { ...this.params, page: this.p, organization };
    if (organization) {
      this.getSubscribers();
    }
  }

  sportFilter(sport_id: any) {
    this.p = 1;
    this.params = { ...this.params, page: this.p, sport_id };
    if (sport_id) {
      this.getReport();
    }
  }

  selectCountry(country: any) {
    this.p = 1;
    this.params = { ...this.params, page: this.p, country };
    if (country) {
      this.getReport();
    }
  }



  selectMatch(match_id: any) {
    this.p = 1;
    this.params = { ...this.params, page: this.p, match_id };
    if (match_id) {
      this.getReport();
    }
  }

  selectDateRange(dates: any) {
    this.p = 1;
    this.params = { ...this.params, page: this.p, start_date: dates.start_date, end_date: dates.end_date };
    this.getReport();
  }

  pageChanged(page: number) {
    this.params = { ...this.params, page };
    this.getReport();
  }

  resetFilter() {

    setTimeout(() => {
      $("#tenant_id").val(this.allTenants.length > 0 ? this.allTenants[0].id : '').trigger('change');
      $("#sport_id").val(0).trigger('change');
      $("#country").val("").trigger('change');
      $("#tournament_id").val("").trigger('change');
      $("#match_id").val("").trigger('change');
      $('#filter_date').val(this.start_date + ' - ' + this.end_date);
    }, 100);

    this.matches = [];

    this.p = 1;
    if (this.subscriberAuthService.subscriberAdminTokenValue && this.subscriberAuthService.subscriberAdminTokenValue.length > 0) {
      this.params = {
        size: 10,
        page: 1,
        search: '',
        start_date: this.start_date,
        end_date: this.end_date,
        sport_id: '',
        country: '',
        tournament_id: '',
        match_id: '',
        stake_min_amt: '',
        stake_max_amt: '',
        winning_min_amt: '',
        winning_max_amt: '',
        tenant_id: this.subscriberId,
        result: '',
        sort_by: 'created_at',
        order: 'desc'
      };

    }
    else {
      this.params = {
        size: 10,
        page: 1,
        search: '',
        start_date: this.start_date,
        end_date: this.end_date,
        sport_id: '',
        country: '',
        tournament_id: '',
        match_id: '',
        stake_min_amt: '',
        stake_max_amt: '',
        winning_min_amt: '',
        winning_max_amt: '',
        tenant_id: this.allTenants.length > 0 ? this.allTenants[0].id : '',
        result: '',
        sort_by: 'created_at',
        order: 'desc'
      };
    }

    this.getReport();
  }

  exportAsXLSX() {
    this.reportService.excelExportRports(this.params).subscribe(
      (res: any) => {
        this.blob = new Blob([res], { type: 'text/csv' });
        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(res);
        var today = formatDate(new Date(), 'yyyy/MM/dd', 'en');
        link.download = "Bet-report" + "-" + today+ ".csv";
        link.click();

        // window.location.href = res.record.url;
        // this.excelService.exportAsExcelFile(res.record, 'report');
      });
  }

  winningPrice(price: string, stake: string) {
    if (price && stake) {
      return (parseFloat(price) * parseFloat(stake)).toFixed(2);
    } else {
      return 'NA';
    }
  }

 checkIfNumber(event:any,acceptDot=false){
  let isNumber =  (event.keyCode >= 48  && event.keyCode <=57 ) || event.keyCode==8;
  return acceptDot ? (isNumber || event.keyCode==190) : isNumber  ;
 }
}
