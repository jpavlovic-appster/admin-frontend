import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SuperAdminAuthService } from '../super-admin/services/super-admin-auth.service';

@Injectable({ providedIn: 'root' })

export class AgentService {

  constructor(private http: HttpClient, private superAdminAuthService: SuperAdminAuthService) { }

  // ====================== Admin url ==============================
  getAdminAgents(params: any, requestPermissions: any) {
    return this.http.post(`admin/usersadmin/agent`, params, { headers: { 'CP': requestPermissions } });
  }

  addAdminAgent(data: any, requestPermissions) {
    return this.http.post(`admin/usersadmin/add`, data, { headers: { 'CP': requestPermissions } });
  }

  getAdminAgent(id: number, type = '', requestPermissions: any) {
    return this.http.get(`admin/users/${id}?type=${type}`, { headers: { 'CP': requestPermissions } });
  }

  updateAdminAgent(data: any, requestPermissions) {
    return this.http.post(`admin/usersadmin/edit/${data.id}`, data, { headers: { 'CP': requestPermissions } });
  }

  updateAdminAgentSetting(data: any, requestPermissions: any) {
    return this.http.post(`admin/users/setting`, data, { headers: { 'CP': requestPermissions } });
  }

  deleteAdminAgentSetting(id: number, requestPermissions: any) {
    return this.http.delete(`admin/users/setting/${id}`, { headers: { 'CP': requestPermissions } });
  }

  // getAdminTenant(requestPermissions: any) {
  //   return this.http.get(`admin/tenants`, { headers: { 'CP': requestPermissions } });
  // }

  activeAdminAgentStatus(id: number, requestPermissions: any) {
    return this.http.post(`admin/users/active/${id}`, {}, { headers: { 'CP': requestPermissions } });
  }

  deactiveAdminAgentStatus(id: number, requestPermissions) {
    return this.http.post(`admin/users/deactive/${id}`, {}, { headers: { 'CP': requestPermissions } });
  }

  // player report using
  getAdminUserList() {
    return this.http.get(`admin/users-hierarchy`);
  }

  // ====================== Super Admin url ==============================

  addSuperAdminAgent(data: any, requestPermissions) {
    return this.http.post(`super/admin/usersadmin/add`, data, { headers: { 'CP': requestPermissions } });
  }

  getSuperAdminAgent(id: number, type = '', requestPermissions) {
    return this.http.get(`super/admin/users/${id}?type=${type}`, { headers: { 'CP': requestPermissions } });
  }

  updateSuperAdminAgent(data: any, requestPermissions) {
    return this.http.post(`super/admin/usersadmin/edit/${data.id}`, data, { headers: { 'CP': requestPermissions } });
  }

  getSuperSubAdmins(requestPermissions: any, params: any) {
    return this.http.post(`super/admin/usersadmin/agent`, params, { headers: { 'CP': requestPermissions } });
  }

  // getSuperAdminPlayer(params: any) {
  //   return this.http.post(`super/admin/usersadmin/player`, params);
  // }

  getRoles(requestPermissions: any, type: string) {
    if (this.superAdminAuthService.superAdminTokenValue && this.superAdminAuthService.superAdminTokenValue.length > 0) {
      return this.http.get(`super/admin/get-roles/${type}`, { headers: { 'CP': requestPermissions } });
    } else {
      return this.http.get(`admin/get-roles/${type}`, { headers: { 'CP': requestPermissions } });
    }
  }

  getPermissions(type: string, roleId: number, requestPermissions) {
    if (type === 'super') {
      return this.http.get(`super/admin/get-permissions`, { headers: { 'CP': requestPermissions } });
    } else {
      return this.http.get(`admin/get-permissions`, { headers: { 'CP': requestPermissions } });
    }
  }

  addSuperTenantAgent(data: any, requestPermissions) {
    return this.http.post(`super/admin/tenants/agents/create`, data, { headers: { 'CP': requestPermissions } });
  }

  getSuperAgentById(id: number, type = '', requestPermissions) {
    return this.http.get(`super/admin/tenants/agents/${id}?type=${type}`, { headers: { 'CP': requestPermissions } });
  }

  updateSuperTenantAgent(data: any, requestPermissions) {
    return this.http.post(`super/admin/tenants/agents/update`, data, { headers: { 'CP': requestPermissions } });
  }


  // Subscriber
  getSubscriberAdmins(params: any, requestPermissions: any) {
    return this.http.post(`subscriber/admin/admins`, params, { headers: { 'CP': requestPermissions } });
  }

  getAllAdmins(type: string, roleId: number, level: number, role, requestPermissions) {
    if (type === 'super') {
      return this.http.get(`super/admin/users/all?id=${roleId}&admin_type=${type}&level=${level}&role=${role}`, { headers: { 'CP': requestPermissions } });
    } else {
      return this.http.get(`admin/users/all?id=${roleId}&admin_type=${type}&level=${level}&role=${role}`, { headers: { 'CP': requestPermissions } });
    }
  }

}
