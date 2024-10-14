import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { BaseService } from './base.service';

@Injectable()
export class SpeakerRateDefaultService extends BaseService {

  constructor(
    protected http: HttpClient,
  ) {
    super(http, `${environment.apiBaseUrl}/companies/%(company_id)s/speaker_rate_defaults`);
  }
}
