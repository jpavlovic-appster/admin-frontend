import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Admin, User } from 'src/app/models';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { AlertService } from 'src/app/services/alert.service';

// declare const toastr: any;

@Injectable({ providedIn: 'root' })

export class AdminAuthService {

  private adminUserSubject!: BehaviorSubject<Admin>;
  public adminUser = new BehaviorSubject({});


  public adminRole = new BehaviorSubject('');

  private adminTokenSubject!: BehaviorSubject<String>;
  private adminRoleSubject!: BehaviorSubject<String>;
  private adminPermissionsSubject!: BehaviorSubject<String>;

  constructor(
    private AlertService: AlertService,
    private http: HttpClient) {
    this.adminTokenSubject = new BehaviorSubject<String>(localStorage.getItem('AdminAuthToken') || '');
    this.adminRoleSubject = new BehaviorSubject<String>(localStorage.getItem('role') || '');
    this.adminPermissionsSubject = new BehaviorSubject<String>(localStorage.getItem('permissions') || '');
  }

  public get adminTokenValue(): String {
    return this.adminTokenSubject.value;
  }

  public get adminRoleValue(): String {
    return this.adminRoleSubject.value;
  }

  public get adminPermissionsValue(): String {
    return this.adminPermissionsSubject.value;
  }

  public get adminUserValue(): Admin {
    return this.adminUserSubject?.value;
  }

  login(userParams: User): Observable<any> {
    return this.http.post<any>(`login/admin`, userParams)
      .pipe(map(userData => {

        localStorage.setItem('AdminAuthToken', userData?.record?.token || '');
        localStorage.setItem('role', userData?.record?.user.roles);
        localStorage.setItem('permissions', btoa(btoa(JSON.stringify(userData?.record?.user.permissions))));

        this.adminTokenSubject.next(userData?.record?.token || null);
        this.adminRoleSubject.next(userData?.record?.user.roles || null);
        let permissions: any = localStorage.getItem('permissions');
        this.adminPermissionsSubject.next(permissions || null);

        this.adminUserSubject = new BehaviorSubject<Admin>(userData?.record?.user);
        this.updateUser(userData?.record?.user);

        if (userData?.message) {
          this.AlertService.success(userData.message);
        }

        // toastr.success(userData?.message || 'Login Successfull');

        return userData;
      }));
  }

  logout() {
    return this.http.post(`logout/admin`, {})
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

    localStorage.removeItem('AdminAuthToken');
    localStorage.removeItem('role');
    localStorage.removeItem('permissions');

    this.adminTokenSubject.next('');
    this.adminRoleSubject.next('');
    this.adminPermissionsSubject.next('');

    this.adminRole.next('');

    if (message) {
      this.AlertService.error(message);
      // toastr.error(message);
    }

    document.location.href = '/login';
  }

  getPersonalDetails() {
    return this.http.get('admin/user').pipe(map((res: any) => {
      this.adminUserSubject = new BehaviorSubject<Admin>(res.record);
      this.updateUser(res.record);
    }));
  }

  updateUser(admin: Admin) {
    this.adminUser.next(admin);
  }

}
