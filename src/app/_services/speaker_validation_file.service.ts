import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { sprintf } from 'sprintf-js';

import { environment } from '../../environments/environment';
import { BaseService } from './base.service';

@Injectable()
export class SpeakerValidationFileService extends BaseService {

  constructor(
    protected http: HttpClient,
  ) {
    super(http, `${environment.apiBaseUrl}/companies/%(company_id)s/speakers/%(speaker_id)s/validation_files`);
  }

  get(id: any, urlParams: any = {}, apiParams: any = {}): Observable<Blob> {
    const url = sprintf(this.baseUrl, urlParams) + `/${id}`;
    return this.downloadFile(url, apiParams);
  }

  delete(model: any, urlParams: any = {}): Observable<any> {
    const url = sprintf(this.baseUrl, urlParams) + `/${model.id}`;
    return this.http.delete<any>(url, model);
  }
}
