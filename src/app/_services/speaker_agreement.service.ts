import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { sprintf } from 'sprintf-js';

import { environment } from '../../environments/environment';
import { BaseService } from './base.service';

@Injectable()
export class SpeakerAgreementService extends BaseService {

  constructor(
    protected http: HttpClient,
  ) {
    super(http, `${environment.apiBaseUrl}/companies/%(company_id)s/speakers/%(speaker_id)s/agreements`);
  }

  generate(model: any, urlParams: any = {}, apiParams: any = {}): Observable<any> {
    const url = sprintf(this.baseUrl, urlParams) + '/generate';
    return this.http.put<any>(url, model, {
      params: this.toHttpParams(apiParams),
      responseType: 'blob' as 'json'
    });
  }

  downloadDocx(agreementId: number, urlParams: any = {}): Observable<any> {
    const url = sprintf(this.baseUrl, urlParams) + `/${agreementId}/download_docx`;
    return this.http.put<any>(url, {}, {
      responseType: 'blob' as 'json'
    });
  }
}
