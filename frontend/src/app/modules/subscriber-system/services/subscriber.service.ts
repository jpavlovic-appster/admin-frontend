import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdminType, Subscriber } from 'src/app/models';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Injectable({ providedIn: 'root' })

export class SubscriberService {

  constructor(private http: HttpClient,
    private authService: AuthenticationService
  ) { }

  // Subscribers Routes for Super
  getSubscribers(params: any, requestPermissions: any): Observable<Subscriber> {  
    return this.http.get<Subscriber>(`super/admin/subscribers?page=${params.page}&size=${params.size}&search=${params.search}&organization=${params.organization}&status=${params.status}&org=${params.org}&order=${params.order}&sort_by=${params.sort_by}`, { headers: { 'CP': requestPermissions } });
  }

  getOrgSubscribers(org: any) {  
    return this.http.get(`super/admin/subscribers/org/${org}`);
  }

  getAllSubscribers(requestPermissions: any): Observable<any> {
    return this.http.get<any>(`super/admin/subscribers/all`, { headers: { 'CP': requestPermissions } });
  }

  getSubscriber(id: number, requestPermissions: any): Observable<any> {
    if (this.authService.adminTypeValue === AdminType.Super) {
      return this.http.get<any>(`super/admin/subscribers/${id}`, { headers: { 'CP': requestPermissions } });
    } else {
      return this.http.get<any>(`subscriber/admin/subscriber-system/${id}`, { headers: { 'CP': requestPermissions } });
    }
  }

  createSubscriber(subscriber: any, requestPermissions: any) {
    return this.http.post(`super/admin/subscribers/create`, subscriber, { headers: { 'CP': requestPermissions } });
  }

  updateSubscriber(subscriber: any, requestPermissions: any) {
    return this.http.post(`super/admin/subscribers/update`, subscriber, { headers: { 'CP': requestPermissions } });
  }

  updateSubscriberStatus(subscriber: any, requestPermissions: any) {
    return this.http.post(`super/admin/subscribers/update-status`, subscriber, { headers: { 'CP': requestPermissions } });
  }

  

  createSubscriberAdmin(subscriber: any, requestPermissions: any) {
    if (this.authService.adminTypeValue === AdminType.Super) {
      return this.http.post(`super/admin/subscribers/admins/create`, subscriber, { headers: { 'CP': requestPermissions } });
    } else {
      return this.http.post(`subscriber/admin/admins/create`, subscriber, { headers: { 'CP': requestPermissions } });
    }
  }

  updateSubscriberAdmin(subscriber: any, requestPermissions: any) {
    if (this.authService.adminTypeValue === AdminType.Super) {
      return this.http.post(`super/admin/subscribers/admins/update`, subscriber, { headers: { 'CP': requestPermissions } });
    } else {
      return this.http.post(`subscriber/admin/admins/update`, subscriber, { headers: { 'CP': requestPermissions } });
    }
  }

  // ======================================

  getSubscriberAdmins(params: any, requestPermissions: any): Observable<any> {
    return this.http.get<any>(`super/admin/subscribers/admins/data?page=${params.page}&size=${params.size}&search=${params.search}&subscriber_id=${params.subscriber_id}`, { headers: { 'CP': requestPermissions } });
  }

  getSubscriberAdmin(id: number, requestPermissions: any): Observable<any> {
    if (this.authService.adminTypeValue === AdminType.Super) {
      return this.http.get<any>(`super/admin/subscribers/admins/${id}`, { headers: { 'CP': requestPermissions } });
    } else {
      return this.http.get<any>(`subscriber/admin/admins/${id}`, { headers: { 'CP': requestPermissions } });
    }
  }



}
