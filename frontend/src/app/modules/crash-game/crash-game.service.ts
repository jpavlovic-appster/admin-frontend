import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SuperAdminAuthService } from '../super-admin/services/super-admin-auth.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { AdminType } from 'src/app/models';
import {Observable} from 'rxjs';

@Injectable({ providedIn: 'root' })

export class CrashGameService {
  
  constructor(private http: HttpClient, private superAdminAuthService: SuperAdminAuthService,
  private authService: AuthenticationService) { }

  getBets(params: any, requestPermissions: any) {
    if (
      this.superAdminAuthService &&
      this.superAdminAuthService.superAdminTokenValue
    ) {
      return this.http.get(`super/admin/bets?size=${params.size}&page=${params.page}&type=${params.type}&tenant_id=${params.tenant_id}&search=${params.search}&currency_code=${params.currency_code}`, { headers: { 'CP': requestPermissions } });
    } else {
      return this.http.get(
        `admin/bets?size=${params.size}&page=${params.page}&type=${params.type}&search=${params.search}&currency_code=${params.currency_code}`, { headers: { 'CP': requestPermissions } }
      );
    }
  }

  getBetHistories(params: any, requestPermissions: any) {
    if (this.authService.adminTypeValue === AdminType.Super) {
      return this.http.get(`super/admin/crash-game/bet-history?size=${params.size}&page=${params.page}&type=${params.type}&tenant_id=${params.tenant_id}&subscriber_id=${params.subscriber_id}&bet_type=${params.bet_type}&search=${params.search}&currency_code=${params.currency_code}&start_date=${params.start_date || ''}&end_date=${params.end_date || ''}`, { headers: { 'CP': requestPermissions } });
    } if (this.authService.adminTypeValue === AdminType.Subscriber) {
      return this.http.get(`subscriber/admin/crash-game/bet-history?size=${params.size}&page=${params.page}&type=${params.type}&subscriber_id=${params.subscriber_id}&bet_type=${params.bet_type}&start_date=${params.start_date || ''}&end_date=${params.end_date || ''}`, { headers: { 'CP': requestPermissions } });
    } else {
      return this.http.get(
        `admin/crash-game/bet-history?size=${params.size}&page=${params.page}&type=${params.type}&tenant_id=${params.tenant_id}&bet_type=${params.bet_type}&search=${params.search}&currency_code=${params.currency_code}&start_date=${params.start_date || ''}&end_date=${params.end_date || ''}`, { headers: { 'CP': requestPermissions } }
      );
    }
  }

  getBetHistoryById(params:any) {
    if (this.authService.adminTypeValue === AdminType.Super) {
      return this.http.post(`super/admin/crash-game/bet-history`,params);
    } else if (this.authService.adminTypeValue === AdminType.Subscriber) {
      return this.http.post(`subscriber/admin/crash-game/bet-history`,params);
    } else {
      return this.http.get(`admin/bets/bet-history`);
    }

  }
  grantFreeBet(subscriber: any,requestPermissions: any) {
      return this.http.post(`subscriber/admin/crash-game/free-bet/create`, subscriber,{ headers: { 'CP': requestPermissions } });
  }

  getFreeBets(params: any, requestPermissions: any){
      return this.http.post(`subscriber/admin/crash-game/free-bet/list`, params, { headers: { 'CP': requestPermissions } });
  }

  deleteFreeBet(id:any){
    return this.http.get(`subscriber/admin/crash-game/free-bet/delete/${id}`);
  }

  getFreeBet(id:any){
    return this.http.get<any>(`subscriber/admin/crash-game/free-bet/show/${id}`);
  }

  updateFreeBet(freebet: any) {   
      return this.http.post(`subscriber/admin/crash-game/free-bet/update`, freebet);   
  }

  upload(file):Observable<any> {
  
    // Create form data
    const formData = new FormData(); 
      
    // Store form name as "file" with file data
    formData.append("file", file, file.name);
      console.log(formData);
  
    // Make http post request over api
    // with formData as req
    return this.http.post(`subscriber/admin/crash-game/free-bet/bulk-upload`, formData);
}

createFreeBetRain(subscriber: any,requestPermissions: any) {
  return this.http.post(`subscriber/admin/crash-game/free-bet-rain/create`, subscriber,{ headers: { 'CP': requestPermissions } });
}

getFreeBetRains(params: any, requestPermissions: any){
  return this.http.post(`subscriber/admin/crash-game/free-bet-rain/list`, params, { headers: { 'CP': requestPermissions } });
}

getFreeBetRain(id:any){
  return this.http.get<any>(`subscriber/admin/crash-game/free-bet-rain/show/${id}`);
}

updateFreeBetRain(freebet: any) {   
  return this.http.post(`subscriber/admin/crash-game/free-bet-rain/update`, freebet);   
}

deleteFreeBetRain(id:any){
  return this.http.get(`subscriber/admin/crash-game/free-bet-rain/delete/${id}`);
}
}
