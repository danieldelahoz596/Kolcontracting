import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { BsModalRef } from 'ngx-bootstrap/modal';
import { BaseComponent } from 'app/_components/base.component';
import { AuthenticationService } from 'app/_services';

@Component({
  selector: 'app-new-nomination-modal',
  templateUrl: './new-nomination-modal.component.html',
})
export class NewNominationModalComponent extends BaseComponent {
  constructor(
    authenticationService: AuthenticationService,
    public bsModalRef: BsModalRef,
    private router: Router,
  ) {
    super(authenticationService);
  }

  onCreateNew() {
    this.bsModalRef.hide();
    this.navigate(this.router, '/speaker/new');
  }

  onUseExisting() {
    this.bsModalRef.hide();
    this.navigate(this.router, '/select-kol');
  }
}
