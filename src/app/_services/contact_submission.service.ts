import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { sprintf } from 'sprintf-js';

import { environment } from '../../environments/environment';
import { BaseService } from './base.service';

@Injectable()
export class ContactSubmissionService extends BaseService {

  constructor(
    protected http: HttpClient,
  ) {
    super(http, `${environment.apiBaseUrl}/companies/%(company_id)s/contact_submissions`);
  }

  update(contacts, urlParams: any): Observable<any> {
    const url = sprintf(this.baseUrl, urlParams);
    return this.http.put<any>(url, contacts);
  }

  approve(contacts, urlParams: any): Observable<any> {
    const url = sprintf(this.baseUrl, urlParams) + `/bulk-approve`;
    return this.http.put<any>(url, contacts);
  }

  decline(contacts, urlParams: any): Observable<any> {
    const url = sprintf(this.baseUrl, urlParams) + `/bulk-decline`;
    return this.http.put<any>(url, contacts);
  }

  export(urlParams: any = {}, apiParams: any = {}): Observable<Blob> {
    const url = sprintf(this.baseUrl, urlParams);
    return this.downloadFile(url, apiParams);
  }
}
