import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthenticationService } from '../_services';

import { getErrorMessage } from 'app/_utils/helpers';
import { DEFAULT_COMPANY_ID } from '../app.constants';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})

export class LoginComponent implements OnInit {
  model: any = {};
  loading = false;
  error = '';
  returnUrl: string;

  companyId: number;

  constructor(
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe(({ company_id }) => {
      this.companyId = company_id || DEFAULT_COMPANY_ID;
    });
    if (this.authenticationService.id()) {
      this.router.navigate(['/']);
    } else {
      // get return url from route parameters or default to '/'
      this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }
  }

  login() {
    this.loading = true;
    this.authenticationService.login(this.model, this.companyId)
      .subscribe(result => {
        this.loading = false;
        this.error = '';
        this.router.navigateByUrl(this.returnUrl);
      }, err => {
        this.loading = false;
        this.error = err.error.error.message;
      });
  }

}
