import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import {
  AuthenticationService,
  ProfileService,
} from '../../_services';

import { BaseComponent } from '../../_components/base.component';

@Component({
  selector: 'app-site-header',
  templateUrl: './site-header.component.html',
})
export class SiteHeaderComponent extends BaseComponent implements OnInit {
  user: any = {};
  @Input() company: any;
  @Input() showLogout: boolean;
  @Input() heightAuto: boolean;

  constructor(
    authenticationService: AuthenticationService,
    private profileService: ProfileService,
    private router: Router,
    private location: Location,
  ) {
    super(authenticationService);
  }

  ngOnInit() {
    this.profileService.getProfile()
      .subscribe(user => {
        this.user = user;
      });
  }

  logout() {
    this.authenticationService.logout();
    this.location.replaceState('/');
    this.router.navigate(['/login']);
  }
}
