import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AdminType, Currency } from 'src/app/models';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Injectable({ providedIn: 'root' })

export class CurrenciesService {

  constructor(private http: HttpClient,
  private authService: AuthenticationService) { }

  // Admin ===================================

  getAdminCurrencies(requestPermissions: any) {
    if (this.authService.adminTypeValue === AdminType.Subscriber) {
      return this.http.get(`subscriber/admin/subscriber-system/currencies`, { headers: { 'CP': requestPermissions } });
    } else {
      return this.http.get(`admin/tenants/currencies`, { headers: { 'CP': requestPermissions } });
    }
  }

  // Super Admin ===================================

  getCurrencies(requestPermissions: any) {
    return this.http.get(`super/admin/currencies`, { headers: { 'CP': requestPermissions } });
  }

  getPrimaryCurrency(requestPermissions: any) {
    return this.http.get(`super/admin/primary-currency`, { headers: { 'CP': requestPermissions } });
  }

  getCurrenciesAll(data: any) {
    return this.http.post(`super/admin/currency/list`, data);
  }

  markPrimary(id: number, requestPermissions: any) {
    return this.http.get(`super/admin/mark-primary/${id}`, { headers: { 'CP': requestPermissions } });
  }

  getCurrencyById(id: number, requestPermissions: any) {
    return this.http.get(`super/admin/currencies/${id}`, { headers: { 'CP': requestPermissions } });
  }

  createCurrency(currency: Currency, requestPermissions: any) {
    return this.http.post(`super/admin/currency`, currency, { headers: { 'CP': requestPermissions } });
  }

  updateCurrency(currency: Currency, requestPermissions: any) {
    return this.http.post(`super/admin/currency/${currency.id}`, currency, { headers: { 'CP': requestPermissions } });
  }

  deleteCurrency(currency: Currency, requestPermissions: any) {
    return this.http.delete(`super/admin/currency/${currency.id}`, { headers: { 'CP': requestPermissions } });
  }

}
