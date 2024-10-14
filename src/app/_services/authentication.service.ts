import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { environment } from '../../environments/environment';

@Injectable()
export class AuthenticationService {
  private currentUser: any;

  constructor(private http: HttpClient) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  login(model, companyId): Observable<boolean> {
    return this.http.post(`${environment.apiBaseUrl}/companies/${companyId}/auth/signin`, model, {
      params: {
        kol_contracting: '1',
      }
    })
      .pipe(
        map((user) => {
          this.currentUser = user;
          this.saveToLocalStorage();
          return true;
        }),
        catchError(res => throwError(res))
      );
  }

  token(): string {
    return this.currentUser && this.currentUser.token;
  }

  role(): string {
    return this.currentUser && this.currentUser.role;
  }

  id(): number {
    return this.currentUser && this.currentUser.id;
  }

  staff_id(): number {
    return this.currentUser && this.currentUser.staff_id;
  }

  client_id(): number {
    return this.currentUser && this.currentUser.client_id;
  }

  current_company_id(): number {
    return this.currentUser && this.currentUser.current_company_id;
  }

  current_salesforce_id(): number {
    return this.currentUser && this.currentUser.current_salesforce_id;
  }

  current_company_name(): string {
    return this.currentUser && this.currentUser.current_company_name;
  }

  current_salesforce_name(): string {
    return this.currentUser && this.currentUser.current_salesforce_name;
  }

  timezone_id(): string {
    return (this.currentUser && this.currentUser.timezone_id) || 'America/New_York';
  }

  setCurrentSalesforce(company_id: number, company_name: string, salesforce_id: number, salesforce_name: string) {
    if (this.currentUser) {
      this.currentUser.current_company_id = company_id;
      this.currentUser.current_company_name = company_name;
      this.currentUser.current_salesforce_id = salesforce_id;
      this.currentUser.current_salesforce_name = salesforce_name;
      this.saveToLocalStorage();
    }
  }

  saveToLocalStorage() {
    localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
  }

  is_in(roles): boolean {
    return roles.includes(this.role());
  }

  logout(): void {
    this.http.post(`${environment.apiBaseUrl}/profile/signout`, {}, {
      headers: {
        'Authorization': this.token(),
      }
    }).subscribe();
    this.currentUser = null;
    localStorage.removeItem('currentUser');
  }

  managableContractStatuses(): any[] {
    const statusIds = this.currentUser.permissions.filter(p => p.contract_status_id).map(p => p.contract_status_id);
    return statusIds;
  }
}
