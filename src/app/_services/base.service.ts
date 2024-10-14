import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';
import { sprintf } from 'sprintf-js';

export class BaseService {
  constructor(
    protected http: HttpClient,
    protected baseUrl: string,
  ) { }

  toHttpParams(obj: Object): HttpParams {
    let params = new HttpParams();
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const val = obj[key];
        if (val !== null && val !== undefined) {
          params = params.append(key, val.toString());
        }
      }
    }
    return params;
  }

  list(urlParams: any = {}, apiParams: any = {}): Observable<any> {
    const url = sprintf(this.baseUrl, urlParams);
    return this.http.get<any>(url, {
      params: this.toHttpParams(apiParams)
    });
  }

  get(id: any, urlParams: any = {}, apiParams: any = {}): Observable<any> {
    const url = sprintf(this.baseUrl, urlParams) + `/${id}`;
    return this.http.get<any>(url, { params: this.toHttpParams(apiParams) });
  }

  create(model: any, urlParams: any = {}, apiParams: any = {}): Observable<any> {
    const url = sprintf(this.baseUrl, urlParams);
    return this.http.post<any>(url, model, {
      params: this.toHttpParams(apiParams),
    });
  }

  update(model: any, urlParams: any = {}, apiParams: any = {}): Observable<any> {
    const id = model instanceof FormData ? model.get('id') : model.id;
    const url = sprintf(this.baseUrl, urlParams) + `/${id}`;
    return this.http.put<any>(url, model, {
      params: this.toHttpParams(apiParams),
    });
  }

  delete(model: any, urlParams: any = {}): Observable<any> {
    const url = sprintf(this.baseUrl, urlParams) + `/${model.id}`;
    return this.http.delete<any>(url, model);
  }

  downloadFile(url, apiParams: any = {}): Observable<Blob> {
    return this.http.get<Blob>(url, {
      params: this.toHttpParams(apiParams),
      responseType: 'blob' as 'json'
    });
  }
}
