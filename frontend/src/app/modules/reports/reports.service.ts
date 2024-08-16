import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SuperAdminAuthService } from '../super-admin/services/super-admin-auth.service';

@Injectable({ providedIn: 'root' })

export class ReportService {

  constructor(private http: HttpClient,
    public superAdminAuthService: SuperAdminAuthService) { }

  getBetReports(params: any) {
    // ====================== Super Admin url ==============================
    if (this.superAdminAuthService && this.superAdminAuthService.superAdminTokenValue) {
      return this.http.get(`super/admin/bet-reports`, { params });
    } else {
      // ====================== Admin url ==============================
      return this.http.get(`subscriber/admin/bet-reports`, { params });
    }

  }

  excelExportRports(params: any) {
   
      return this.http.get(`report/export?size=${params.size}&page=${params.page}&search=${params.search}&start_date=${params.start_date}&end_date=${params.end_date}&sport_id=${params.sport_id}&winning_min_amt=${params.winning_min_amt}&winning_max_amt=${params.winning_max_amt}&tenant_id=${params.tenant_id}&result=${params.result}&sort_by=created_at&order=${params.order}&organization=${params.organization}&sport=${params.sport}
      `,{responseType: 'blob' as 'json' } );
  
  }

}
