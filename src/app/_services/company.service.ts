import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { BaseService } from './base.service';

@Injectable()
export class CompanyService extends BaseService {
  public companies: any[];

  constructor(
    protected http: HttpClient,
  ) {
    super(http, `${environment.apiBaseUrl}/companies`);
  }

  list(apiParams: any = {}, apiCall: boolean = false): Observable<any[]> {
    if (this.companies && !apiCall) {
      return new Observable((observer) => {
        observer.next(this.companies);
      });
    }
    return super.list({}, apiParams)
      .pipe(
        tap(companies => this.companies = companies),
      );
  }
}
