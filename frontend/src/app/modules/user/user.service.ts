import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SuperAdminAuthService } from '../super-admin/services/super-admin-auth.service';
import { SubscriberAuthService } from '../subscriber-system/services/subscriber-auth.service';

@Injectable({ providedIn: 'root' })

export class PlayerService {

  constructor(private http: HttpClient, public superAdminAuthService: SuperAdminAuthService, public subscriberAuthService: SubscriberAuthService) { }

  getPlayer(id: number) {
    if (this.superAdminAuthService.superAdminTokenValue && this.superAdminAuthService.superAdminTokenValue.length > 0) {
      return this.http.get(`super/admin/usersadmin/player/${id}`);
    } else {
      return this.http.get(`subscriber/admin/subscriber-system/usersadmin/player/${id}`);
    }
  }

  getAdminPlayer(params: any, requestPermissions: any) {
    if (this.superAdminAuthService.superAdminTokenValue && this.superAdminAuthService.superAdminTokenValue.length > 0) {
      return this.http.post(`super/admin/usersadmin/player`, params, { headers: { 'CP': requestPermissions } });
    } else if (this.subscriberAuthService.subscriberAdminTokenValue && this.subscriberAuthService.subscriberAdminTokenValue.length > 0) {
      return this.http.post(`subscriber/admin/subscriber-system/usersadmin/player`, params, { headers: { 'CP': requestPermissions } });
    } else {
      return this.http.post(`admin/usersadmin/player`, params, { headers: { 'CP': requestPermissions } });
    }
  }

  updateAdminPlayerStatus(id: number, status: number, requestPermissions: any) {
    return this.http.put(`subscriber/admin/subscriber-system/usersadmin/player-status/${id}/${status}`, {}, { headers: { 'CP': requestPermissions } });
  }




  getSuperAdminPlayer(params: any, requestPermissions: any) {
    return this.http.post(`super/admin/usersadmin/player`, params, { headers: { 'CP': requestPermissions } });
  }

  getPlayerStatus(sub_id: number, user_id: number) {
    return this.http.get(`super/admin/usersadmin/player/status/${sub_id}/${user_id}`);
  }

}
