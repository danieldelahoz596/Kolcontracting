import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { sprintf } from 'sprintf-js';

import { environment } from '../../environments/environment';
import { BaseService } from './base.service';

@Injectable()
export class ContactService extends BaseService {

  constructor(
    protected http: HttpClient,
  ) {
    super(http, `${environment.apiBaseUrl}/contacts`);
  }
}
