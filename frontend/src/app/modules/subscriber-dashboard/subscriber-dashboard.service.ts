import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SuperAdminAuthService } from '../super-admin/services/super-admin-auth.service';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SubscriberDashboardService {
  constructor(
    private http: HttpClient,
    public superAdminAuthService: SuperAdminAuthService,
  ) {}

  getDashboard(params:any) {
    const totalPlayers = this.totalPlayers(params);
    const totalSubscribers = this.totalSubscribers(params);
    const betStats = this.betStats(params); 
    
    return forkJoin([
      totalPlayers,
      totalSubscribers,
      betStats
    ]);
  }
  getSubDashboard(params:any) {
    const totalPlayers = this.totalSubPlayers(params);
    const betStats = this.subBetStats(params); 
    
    return forkJoin([
      totalPlayers,
      betStats
    ]);
  }

  getOrgDashboard(params:any) {
    const totalOrgPlayers = this.totalOrgPlayers(params);
    const totalOrgSubscribers = this.totalOrgSubscribers(params);
    const betStats =  this.orgBetStats(params);

    
    return forkJoin([
      totalOrgPlayers,
      totalOrgSubscribers,
      betStats
    ]);
  }

  getAccountDetails(params:any){
    const totalPlayers = this.subPlayers(params);
    const betStats = this.accountSubBetStats(params); 

    return forkJoin([
      totalPlayers,
      betStats
    ]);
  }

  totalPlayers(params: any){
    return this.http.post(`super/admin/sub-dashboard/total-players`,params);
  }

  betStats(params: any){
    return this.http.post(`super/admin/sub-dashboard/bet-stats`,params);
  }

  subBetStats(params: any){
    return this.http.post(`subscriber/admin/subscriber-system/sub-dashboard/sub-bet-stats`,params);
  }

  accountSubBetStats(params: any){
    return this.http.post(`super/admin/sub-dashboard/account-bet-stats`,params);
  }

  totalOrgPlayers(params: any){
    return this.http.post(`super/admin/sub-dashboard/total-org-players`,params);
  }

  totalSubPlayers(params: any){
    return this.http.post(`subscriber/admin/subscriber-system/sub-dashboard/total-players`,params);
  }


  subPlayers(params: any){
    return this.http.post(`super/admin/sub-dashboard/account-total-players`,params);
  }

  totalSubscribers(params: any){
    return this.http.post(`super/admin/sub-dashboard/total-subscribers`,params);
  }

  totalOrgSubscribers(params: any){
    return this.http.post(`super/admin/sub-dashboard/total-org-subscribers`,params);
  }

  orgBetStats(params: any){
    return this.http.post(`super/admin/sub-dashboard/org-bet-stats`,params);
  }
  
}
