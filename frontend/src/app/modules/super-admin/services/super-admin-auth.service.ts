import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/app/models';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
// declare const toastr: any;

@Injectable({ providedIn: 'root' })

export class SuperAdminAuthService {

  private superAdminTokenSubject!: BehaviorSubject<String>;
  private superAdminRoleSubject!: BehaviorSubject<String>;
  private superAdminPermissionsSubject!: BehaviorSubject<String>;

  private superAdminUserSubject!: BehaviorSubject<User>;
  public superAdminUser = new BehaviorSubject({});

  constructor(
    private AlertService: AlertService,
    private http: HttpClient,
    private route: Router) {
    this.superAdminTokenSubject = new BehaviorSubject<String>(localStorage.getItem('SuperAdminAuthToken') || '');
    this.superAdminRoleSubject = new BehaviorSubject<String>(localStorage.getItem('role') || '');
    this.superAdminPermissionsSubject = new BehaviorSubject<String>(localStorage.getItem('permissions') || '');
  }

  public get superAdminTokenValue(): String {
    return this.superAdminTokenSubject.value;
  }

  public get superAdminRoleValue(): String {
    return this.superAdminRoleSubject.value;
  }

  public get superAdminPermissionsValue(): String {
    return this.superAdminPermissionsSubject.value;
  }

  public get superAdminUserValue(): User {
    return this.superAdminUserSubject?.value;
  }

  login(userParams: User): Observable<any> {
    return this.http.post<any>(`login/super`, userParams)
      .pipe(map(userData => {

        localStorage.setItem('SuperAdminAuthToken', userData?.record?.token || '');
        localStorage.setItem('role', userData?.record?.user.roles);
        localStorage.setItem('permissions', btoa(btoa(JSON.stringify(userData?.record?.user.permissions))));

        this.superAdminTokenSubject.next(userData?.record?.token || null);
        this.superAdminRoleSubject.next(userData?.record?.user.roles || null);
        let permissions: any = localStorage.getItem('permissions');
        this.superAdminPermissionsSubject.next(permissions || null);
        // this.superAdminUserSubject = new BehaviorSubject<User>(userData?.record?.user);
        this.updateUser(userData?.record?.user);

        if (userData?.message) {
          this.AlertService.success(userData.message);
        }
        // toastr.success(userData?.message || 'Login Successfull');

        return userData;
      }));
  }

  logout() {
    return this.http.post(`logout/admin/super`, {})
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
    // this.route.navigate(['/super-admin/login']);

    localStorage.removeItem('SuperAdminAuthToken');
    localStorage.removeItem('role');
    localStorage.removeItem('permissions');
    this.superAdminTokenSubject.next('');
    this.superAdminRoleSubject.next('');
    this.superAdminPermissionsSubject.next('');

    if (message) {
       this.AlertService.error(message);
      // toastr.error(message);
    }

    document.location.href = '/super-admin/login';

  }

  getPersonalDetails() {
    return this.http.get('super/admin/user').pipe(map((res: any) => {
      this.superAdminUserSubject = new BehaviorSubject<User>(res.record);
      this.updateUser(res.record);
    }));
  }

  updateUser(admin) {
    this.superAdminUser.next(admin);
  }

}
