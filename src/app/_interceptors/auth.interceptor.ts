import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { AuthenticationService } from '../_services';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private inj: Injector, private router: Router) {
  }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authenticationService = this.inj.get(AuthenticationService);
    const token = authenticationService.token();
    if (token && !req.headers.get('Authorization') && !req.url.toLowerCase().includes('amazonaws.com')) {
      const authReq = req.clone({ headers: req.headers.set('Authorization', token) });
      return next
        .handle(authReq)
        .pipe(
          tap(event => {}, err => {
            if (err.status === 401) {
              authenticationService.logout();
              this.router.navigate(['/login']);
            }
          })
        );
    } else {
      return next.handle(req);
    }
  }
}
