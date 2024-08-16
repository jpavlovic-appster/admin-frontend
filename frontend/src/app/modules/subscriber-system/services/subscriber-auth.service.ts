import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Admin, User } from '../../../models';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { AlertService } from 'src/app/services/alert.service';

// declare const toastr: any;

@Injectable({ providedIn: 'root' })

export class SubscriberAuthService {

  private subscriberAdminUserSubject!: BehaviorSubject<Admin>;
  public subscriberAdminUser = new BehaviorSubject({});

  private subscriberAdminTokenSubject!: BehaviorSubject<String>;
  private subscriberAdminRoleSubject!: BehaviorSubject<String>;
  private subscriberAdminPermissionsSubject!: BehaviorSubject<String>;

  constructor(
    private AlertService: AlertService,
    private http: HttpClient) {
    this.subscriberAdminTokenSubject = new BehaviorSubject<String>(localStorage.getItem('SubscriberAdminAuthToken') || '');
    this.subscriberAdminRoleSubject = new BehaviorSubject<String>(localStorage.getItem('role') || '');
    this.subscriberAdminPermissionsSubject = new BehaviorSubject<String>(localStorage.getItem('permissions') || '');
  }

  public get subscriberAdminTokenValue(): String {
    return this.subscriberAdminTokenSubject.value;
  }

  public get subscriberAdminRoleValue(): String {
    return this.subscriberAdminRoleSubject.value;
  }

  public get subscriberAdminPermissionsValue(): String {
    return this.subscriberAdminPermissionsSubject.value;
  }

  public get subscriberAdminUserValue(): Admin {
    return this.subscriberAdminUserSubject?.value;
  }

  login(userParams: User): Observable<any> {
    return this.http.post<any>(`login/subscriber`, userParams)
      .pipe(map(userData => {

        localStorage.setItem('SubscriberAdminAuthToken', userData?.record?.token || '');
        localStorage.setItem('role', userData?.record?.user.roles);
        localStorage.setItem('permissions', btoa(btoa(JSON.stringify(userData?.record?.user.permissions))));

        this.subscriberAdminTokenSubject.next(userData?.record?.token || null);
        this.subscriberAdminRoleSubject.next(userData?.record?.user.roles || null);
        let permissions: any = localStorage.getItem('permissions');
        this.subscriberAdminPermissionsSubject.next(permissions || null);

        this.subscriberAdminUserSubject = new BehaviorSubject<Admin>(userData?.record?.user);
        this.updateUser(userData?.record?.user);

        if (userData?.message) {
          this.AlertService.success(userData.message);
        }

        // toastr.success(userData?.message || 'Login Successfull');

        return userData;
      }));
  }

  logout() {
    return this.http.post(`logout/subscriber`, {})
      .pipe(map((user: any) => {
        if (user?.message) {
          this.AlertService.success(user.message);
        }
        // toastr.success('Logout Successfully');
        this.navigateToLogin();
        return user;
      }));
  }

  navigateToLogin(message?: string) {
    // this.route.navigate(['/login']);

    localStorage.removeItem('SubscriberAdminAuthToken');
    localStorage.removeItem('role');
    localStorage.removeItem('permissions');

    this.subscriberAdminTokenSubject.next('');
    this.subscriberAdminRoleSubject.next('');
    this.subscriberAdminPermissionsSubject.next('');

    if (message) {
      this.AlertService.error(message);
      // toastr.error(message);
    }

    document.location.href = '/subscriber/login';
  }

  getPersonalDetails(requestPermissions: any) {
    return this.http.get('subscriber/admin/user', { headers: { 'CP': requestPermissions } }).pipe(map((res: any) => {
      this.subscriberAdminUserSubject = new BehaviorSubject<Admin>(res.record);
      this.updateUser(res.record);
    }));
  }

  updateUser(admin: Admin) {
    this.subscriberAdminUser.next(admin);
  }

  forgotPassword(userParams: User): Observable<any> {
    return this.http.post('subscriber/forgot-password',userParams);
  }

  checkResetPasswordToken(token: any) {
    return this.http.get(`subscriber/check-token/${token}`);
  }

  resetPassword(data: any) {
    return this.http.post('subscriber/reset-password',data);  }

}
