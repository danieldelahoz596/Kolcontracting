import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

@Injectable()
export class ProfileService {
  constructor(
    private http: HttpClient,
  ) { }

  getProfile(): Observable<any> {
    const url = `${environment.apiBaseUrl}/profile`;
    return this.http.get<any>(url);
  }

  updateProfile(user): Observable<any> {
    const url = `${environment.apiBaseUrl}/profile`;
    return this.http.put<any>(url, user);
  }

  updatePassword(data): Observable<any> {
    const url = `${environment.apiBaseUrl}/profile/password`;
    return this.http.put<any>(url, data);
  }
}
