import { Component } from '@angular/core';

import { AuthenticationService } from '../_services';

import { getErrorMessage } from 'app/_utils/helpers';

@Component({
  selector: 'app-base',
  template: `<div></div>`,
})
export class BaseComponent {
  constructor(
    protected authenticationService: AuthenticationService,
  ) {
  }

  getTimezoneId() {
    return this.authenticationService.timezone_id();
  }

  getCurrentCompanyId() {
    return this.authenticationService.current_company_id();
  }

  refresh(router, queryParams: any = {}) {
    const url = decodeURIComponent(router.url.split('?')[0]);
    router.navigateByUrl('/dummy', { skipLocationChange: true }).then(() =>
      router.navigate([url], { queryParams })
    );
  }

  getErrorMessage(err, message = '') {
    return getErrorMessage(err, message);
  }

  navigate(router, url: string, params = {}) {
    router.navigate([url], params);
  }

  buildFormData(data = {}) {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key] instanceof Date) {
        formData.append(key, data[key].toISOString());
      } else if (data[key] instanceof Object) {
        formData.append(key, JSON.stringify(data[key]));
      } else if (data[key]) {
        formData.append(key, data[key]);
      }
    });
    return formData;
  }
}
