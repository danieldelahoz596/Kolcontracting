import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { sprintf } from 'sprintf-js';

import { environment } from '../../environments/environment';
import { BaseService } from './base.service';

@Injectable()
export class SpeakerEsifFormService extends BaseService {

  constructor(
    protected http: HttpClient,
  ) {
    super(http, `${environment.apiBaseUrl}/speaker_esif_forms`);
  }

  decline(urlParams: any = {}, apiParams: any = {}): Observable<any> {
    const url = sprintf(this.baseUrl, urlParams);
    return this.http.delete<any>(url, {
      params: this.toHttpParams(apiParams),
    });
  }

  get(id: any, urlParams: any = {}, apiParams: any = {}): Observable<any> {
    const url = sprintf(`${environment.apiBaseUrl}/companies/%(company_id)s/speakers/%(speaker_id)s/esif_forms`, urlParams);
    return this.http.get<any>(url, { params: this.toHttpParams(apiParams) });
  }

  updateW9(urlParams: any, formData): Observable<any> {
    const url = sprintf(
      `${environment.apiBaseUrl}/companies/%(company_id)s/speakers/%(speaker_id)s/esif_forms/%(esif_form_id)s/w9`,
      urlParams
    );
    return this.http.put<any>(url, formData);
  }
}
