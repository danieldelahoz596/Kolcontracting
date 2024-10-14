import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { BaseService } from './base.service';

@Injectable()
export class ListService extends BaseService {
  public lists: any;

  constructor(
    http: HttpClient,
  ) {
    super(http, `${environment.apiBaseUrl}/lists`);
    this.lists = {};
  }

  getLists(names: string, apiParams: any = {}, options: any = {}): Observable<any> {
    const url = `${environment.apiBaseUrl}/lists`;
    return this.http.get<any>(url, {
      params: this.toHttpParams({ names, ...apiParams }),
      ...options,
    });
  }

  // load common if company version is blank
  getListsForCompany(company_id: number, names: string, apiParams: any = {}, options: any = {}): Observable<any> {
    const url = `${environment.apiBaseUrl}/companies/${company_id}/lists`;
    return this.http.get<any>(url, {
      params: this.toHttpParams({ names, ...apiParams }),
      ...options
    });
  }
}
