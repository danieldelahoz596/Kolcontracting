import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { BaseComponent } from '../_components/base.component';

import { AuthenticationService, ContactService, ContactSubmissionService } from '../_services';

@Component({
  selector: 'app-select-kol',
  templateUrl: './select-kol.component.html',
})
export class SelectKOLComponent extends BaseComponent implements OnInit {
  contacts: any[];
  selectedContacts: any;

  constructor(
    authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router,
    private contactService: ContactService,
    private contactSubmissionService: ContactSubmissionService,
  ) {
    super(authenticationService);
    this.selectedContacts = {};
  }

  ngOnInit() {
    const that = this;
    this.route.queryParams.subscribe(params => {
      // that.contactService.getContacts({}, {
      //   ...params,
      // }, dataTablesParameters)
      //   .subscribe(res => {
      //     that.contacts = res.contacts;
      //     callback({
      //       draw: dataTablesParameters.draw,
      //       recordsTotal: res.total,
      //       recordsFiltered: res.total,
      //       data: []
      //     });
      //   });
    });
  }

  toggleContact(contactId) {
    this.selectedContacts[contactId] = !this.selectedContacts[contactId];
  }

  onSubmit() {
    const contacts = [];
    this.contacts.forEach(c => {
      if (this.selectedContacts[c.id]) {
        contacts.push({ id: c.id });
      }
    });
    this.contactSubmissionService.update(contacts, {
      company_id: this.getCurrentCompanyId()
    }).subscribe(res => {
      this.toastr.success('Submitted!');
      this.navigate(this.router, '/');
    });
  }
}
