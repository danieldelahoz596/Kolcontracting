import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthenticationService } from '../_services';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.authenticationService.id()) {
      if (route.data && route.data.roles &&
      !this.authenticationService.is_in(route.data.roles)) {
        this.router.navigate(['']);
        return false;
      }
      return true;
    }

    // not logged in so redirect to login page with the return url and return false
    this.router.navigate(['login'], { queryParams: { returnUrl: state.url }});
    return false;
  }
}
