import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { AuthenticationService, CompanyService } from 'app/_services';
import { BaseComponent } from 'app/_components/base.component';

@Component({
  selector: 'app-site-layout',
  templateUrl: './site-layout.component.html',
})
export class SiteLayoutComponent extends BaseComponent implements OnInit {
  public company: any;
  constructor(
    authenticationService: AuthenticationService,
    private router: Router,
    private location: Location,
    private companyService: CompanyService,
  ) {
    super(authenticationService);
  }

  ngOnInit() {
    this.companyService.list().subscribe((companies) => {
      this.company = companies.find(c => c.id === this.getCurrentCompanyId());
    });
  }

  logout() {
    this.authenticationService.logout();
    this.location.replaceState('/');
    this.router.navigate(['/login']);
  }
}
