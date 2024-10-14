import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { BaseComponent } from '../_components/base.component';
import {
  CompanyService,
  AuthenticationService,
  ListService,
  ContactSubmissionService,
} from '../_services';
import { buildFormData } from 'app/_utils/helpers';

@Component({
  selector: 'app-kol-contracting-edit',
  templateUrl: './kol-contracting-edit.component.html',
  styleUrls: ['./kol-contracting-edit.component.css'],
})
export class KOLContractingEditComponent extends BaseComponent implements OnInit {
  contact: any;
  salutations: any[];
  speakerLevels: any[];
  speakerSpecialties: any[];
  speakerSubSpecialties: any[];
  salesforces: any[];
  products: any[];
  states: any[];
  files: any;
  divisions: any[];

  constructor(
    authenticationService: AuthenticationService,
    private companyService: CompanyService,
    private toastr: ToastrService,
    private router: Router,
    private listService: ListService,
    private contactSubmissionService: ContactSubmissionService,
  ) {
    super(authenticationService);
    this.contact = {};
    this.contact.degrees = [''];
    this.contact.specialties = [''];
    this.contact.office = {
      address_type: 'office',
    };
    this.contact.meta = {};
    this.files = {};
  }

  ngOnInit() {
    this.companyService.list().subscribe((companies) => {
      const company = companies.find(c => c.id === this.getCurrentCompanyId());
      this.divisions = company.divisions;
    });
    this.listService.getLists('CountryState').subscribe((lists) => {
      this.states = lists.CountryState;
    });
    this.listService.getListsForCompany(this.getCurrentCompanyId(),
      [
        'salutation',
        'SpeakerLevel',
        'speaker_specialty',
        'speaker_subspecialty',
        'Salesforce',
        'Product',
      ].join(','))
      .subscribe((lists) => {
        this.salutations = lists.salutation;
        this.speakerLevels = lists.SpeakerLevel;
        this.speakerSpecialties = lists.speaker_specialty;
        this.speakerSubSpecialties = lists.speaker_subspecialty;
        this.salesforces = lists.Salesforce;
        this.products = lists.Product;
      });
  }

  onFileRemove(file) {
    this.contact[file] = null;
  }

  onSubmit() {
    if (this.contact.id) {
      this.contactSubmissionService.update([{
        ...this.contact,
        cv: this.files.cv,
      }], {
        company_id: this.getCurrentCompanyId()
      }).subscribe(res => {
        this.toastr.success('Updated!');
        this.navigate(this.router, '/');
      });
    } else {
      this.contactSubmissionService.create({
        ...this.contact,
        cv: this.files.cv,
      }, {
        company_id: this.getCurrentCompanyId()
      }).subscribe(res => {
        this.toastr.success('Created!');
        this.navigate(this.router, '/');
      });
    }
  }
}
