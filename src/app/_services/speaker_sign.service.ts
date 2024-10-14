import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { sprintf } from 'sprintf-js';

import { environment } from '../../environments/environment';
import { BaseService } from './base.service';

@Injectable()
export class SpeakerSignService extends BaseService {

  constructor(
    protected http: HttpClient,
  ) {
    super(http, `${environment.apiBaseUrl}/speaker_agreements`);
  }

  get(id: any, urlParams: any = {}, apiParams: any = {}): Observable<any> {
    const url = sprintf(this.baseUrl, urlParams) + `/${id}`;
    return this.downloadFile(url, apiParams);
  }

  decline(urlParams: any = {}, apiParams: any = {}): Observable<any> {
    const url = sprintf(this.baseUrl, urlParams);
    return this.http.delete<any>(url, {
      params: this.toHttpParams(apiParams),
    });
  }
}
