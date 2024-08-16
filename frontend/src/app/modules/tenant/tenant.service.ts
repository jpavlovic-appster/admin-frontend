import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AdminType, Credentials } from 'src/app/models';
import { SuperAdminAuthService } from '../super-admin/services/super-admin-auth.service';
import { SubscriberAuthService } from '../subscriber-system/services/subscriber-auth.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class TenantService {

  public tenantDetials: any;
  public remCredentials: Credentials[] = [];
  public languageUpdateSubject = new BehaviorSubject(false);
  public remainingCredsBool: boolean = false;

  constructor(private http: HttpClient,
    private superAdminAuthService: SuperAdminAuthService,
    private subscriberAuthService: SubscriberAuthService,
    private authService: AuthenticationService
  ) { }

  // ====================== Admin url ==============================
  getAdminTenant(id: number, requestPermissions: any) {
    return this.http.get(`admin/tenants?id=${id}`, { headers: { 'CP': requestPermissions } }).pipe(map((m: any) => {
      this.tenantDetials = m.record;
      return m;
    }));
  }

  getAdminTenantRemCred(requestPermissions: any) {
    this.remainingCredsBool = true;

    if (this.authService.adminTypeValue === AdminType.Subscriber) {
      return this.http.get(`subscriber/admin/subscriber-system/credentials?type=${this.authService.adminTypeValue}`, { headers: { 'CP': requestPermissions } }).pipe(map((m: any) => {
        this.remCredentials = m.record;
        return m;
      }));
    } else {
      return this.http.get(`admin/tenants/credentials?type=${this.authService.adminTypeValue}`, { headers: { 'CP': requestPermissions } }).pipe(map((m: any) => {
        this.remCredentials = m.record;
        return m;
      }));
    }
  }

  getTenantSportSettings() {
    if (this.superAdminAuthService?.superAdminTokenValue?.length > 0) {
      return this.http.get(`super/admin/tenants/crash-game/setting`);
    } 
    return this.http.get(`subscriber/admin/subscriber-system/setting`);
  }

  setDefault(config_id: any ,id: number) {
    return this.http.get(`super/admin/subscribers/set-default?type=${id}&id=${config_id}`);
  }

  updateOrgStatus(org:any) {
    return this.http.post(`super/admin/organization/change-status`,org);
  }

  updateSuperAdmin(admin: any) {
    console.log(admin);
    return this.http.post(`super/admin/update-password`,admin);    
  }

  updateTenantSportSettings(data: any, requestPermissions: any) {
    if (this.superAdminAuthService?.superAdminTokenValue?.length > 0) {
      return this.http.post(`super/admin/tenants/crash-game-setting/update`, data, { headers: { 'CP': requestPermissions } });
    } else if (this.subscriberAuthService?.subscriberAdminTokenValue?.length > 0) {
      return this.http.post(`subscriber/admin/subscriber-system/sport-setting/update`, data, { headers: { 'CP': requestPermissions } });
    } else {
      return this.http.post(`admin/tenants/sport-setting/update`, data, { headers: { 'CP': requestPermissions } });
    }
  }

  updateCrashGameSettingsCurrency(type:any,uId:number,tab_name:any, data: any, requestPermissions: any) {
    if (this.superAdminAuthService?.superAdminTokenValue?.length > 0) {
      return this.http.post(`super/admin/tenants/crash-game-setting/updatecurrency/${type}/${uId}/${tab_name}`, data, { headers: { 'CP': requestPermissions } });
    } else if (this.subscriberAuthService?.subscriberAdminTokenValue?.length > 0) {
      return this.http.post(`subscriber/admin/subscriber-system/game-setting-currencies/updatecurrency/${type}/${uId}/${tab_name}`, data, { headers: { 'CP': requestPermissions } });
    } else {
      return this.http.post(`admin/tenants/sport-setting/updatecurrency/${type}/${uId}/${tab_name}`, data, { headers: { 'CP': requestPermissions } });
    }
  }

  // ====================== Super Admin url ==============================


  getTenant(id: number, requestPermissions: any) {
    return this.http.get(`super/admin/tenants/${id}`, { headers: { 'CP': requestPermissions } });
  }

  getLanguages(data: any) {
    return this.http.post(`super/admin/languages/list`, data);
  }

  getLang() {
    return this.http.get(`languages` );
  }

  getSingleLang(id: number) {
    return this.http.get(`super/admin/languages/${id}`);
  }

  addLanguage(data: any) {
    return this.http.post(`super/admin/languages`, data);
  }

  updateLanguage(data: any,id:any) {
    return this.http.post(`super/admin/languages/update/${id}`, data);
  }

  isLanguageUpdated(){
    return this.languageUpdateSubject.asObservable();
  }

  download(url: string): Observable<Blob> {
    return this.http.get(url, {
      responseType: 'blob'
    })
  }

  downloadConfig(url: string): Observable<Blob> {
    return this.http.get(url, {
      responseType: 'blob'
    })
  }

  downloadLangUserJson(id:any){
    return this.http.get(`super/admin/languages/download-user-json/${id}`);
  }

  updateHero(data: any,id:any) {
    return this.http.post(`super/admin/subscribers/hero/${id}`, data);
  }

  updateSound(data: any,id:any) {
    return this.http.post(`super/admin/subscribers/sound/${id}`, data);
  }

  getSound(id:any) {
    return this.http.get(`super/admin/subscribers/get-sound/${id}`);
  }

  createOrganization(data:any){
    return this.http.post(`super/admin/organizations`, data );
  }

  getOrganizations(){
    return this.http.get(`super/admin/organizations`);
  }

  getOrganizationsAll(data: any){
    return this.http.post(`super/admin/organizations/all`, data);
  }

  getOrganization(id: number) {
    return this.http.get(`super/admin/organization/${id}`);
  }

  updateOrganization(org:any, requestPermissions: any) {
    return this.http.post(`super/admin/organization`, org);
  }

  deleteOrg(id:number){
    return this.http.delete(`super/admin/organization/${id}`);
  }

  getTenantsAll(requestPermissions = '') {
    return this.http.get(`subscriber/admin/subscriber-system`, { headers: { 'CP': requestPermissions } });
  }

  getTenantCurrencies(id: number, type: string, requestPermissions = '') {
    if (this.superAdminAuthService?.superAdminTokenValue?.length > 0) {
      return this.http.get(`super/admin/tenants/currencies/${id}?type=${type}`, { headers: { 'CP': requestPermissions } });
    } else {
      return this.http.get(`admin/tenants/currencies/${id}?type=${type}`, { headers: { 'CP': requestPermissions } });
    }
  }

  checkTenSub() {
    return this.http.get(`login/check-tensub`);
  }

  getTenantCrashGameSettingsCurrency(type:any, id: number, requestPermissions: any) {
    if (this.superAdminAuthService?.superAdminTokenValue?.length > 0) {
      return this.http.get(`super/admin/tenants/sports/crash-game-setting-currencies?type=${type}`, { headers: { 'CP': requestPermissions } });
    } else if (this.subscriberAuthService?.subscriberAdminTokenValue?.length > 0) {
      return this.http.get(`subscriber/admin/subscriber-system/game-setting-currencies?id=${id}&type=${type}`,  { headers: { 'CP': requestPermissions } });
      // return this.http.get(`subscriber/admin/subscriber-system/sportset?id=${id}&type=${type}`,  { headers: { 'CP': requestPermissions } });
    } else {
      return this.http.get(`admin/tenants/sport-setting-currencies?id=${id}&type=${type}`,  { headers: { 'CP': requestPermissions } });
    }
  }

  getFreeBetSettings(id: number) {
    console.log(id);
    return this.http.get(`subscriber/admin/subscriber-system/free-bet-setting/${id}`);
  }

  updateFreeBetSetting(data:any){
    return this.http.post(`subscriber/admin/subscriber-system/free-bet-setting/update`, data);
  }

  

}
