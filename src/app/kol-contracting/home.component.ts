import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';

import { BaseComponent } from 'app/_components/base.component';
import { AuthenticationService, ContactSubmissionService, ListService, CompanyService, SpeakerAgreementService } from '../_services';
import { DatatablesUtils } from 'app/_utils/datatables';
import { NewNominationModalComponent } from './new-nomination-modal.component';
import { BulkSubmissionModalComponent } from './bulk-submission-modal.component';
import { KOLContractingEditModalComponent } from './kol-contracting-edit-modal.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent extends BaseComponent implements OnInit, OnDestroy {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  bsBulkSubmissionsModalRef: BsModalRef;
  bsEditModalRef: BsModalRef;

  company: any;
  productMap: any;
  divisionId: number;
  productId: number;
  nominationType: string;
  contractStatus: string;

  contacts: any[];
  checkedContacts: any;
  speakerLevels: any[];
  products: any[];

  approving: boolean;
  constructor(
    authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private companyService: CompanyService,
    private contactSubmissionService: ContactSubmissionService,
    private listService: ListService,
    private agreementService: SpeakerAgreementService,
  ) {
    super(authenticationService);
    this.company = {};
    this.productMap = {};
    this.checkedContacts = {};
  }

  ngOnInit() {
    this.listService.getListsForCompany(this.getCurrentCompanyId(), 'SpeakerLevel,Product')
      .subscribe((lists) => {
        this.speakerLevels = lists.SpeakerLevel;
        this.products = lists.Product;
        lists.Product.forEach(p => {
          this.productMap[p.id] = p;
        });
      });
    this.companyService.list().subscribe((companies) => {
      this.company = companies.find(c => c.id === this.getCurrentCompanyId());
    });
    this.dtOptions = DatatablesUtils.buildDatatablesSettings({
      columnDefs: [
        { targets: [0], orderable: false },
        { targets: [-2], orderable: false },
        { targets: [-1], orderable: false }
      ],
      paging: true,
      searching: true,
      order: [1, 'asc'],
      language: {},
    });
    this.route.queryParams.subscribe(params => {
      const managableContractStatuses = this.authenticationService.managableContractStatuses();
      this.divisionId = params.division_id || '';
      this.productId = params.product_id || '';
      this.nominationType = params.nomination_type || '';
      if ('contract_status' in params) {
        this.contractStatus = params.contract_status || '';
      } else {
        this.contractStatus = managableContractStatuses.length ? managableContractStatuses[0] : '';
      }
      this.contactSubmissionService.list({
        company_id: this.getCurrentCompanyId(),
      }, this.buildQueryParams({}))
        .subscribe(contacts => {
          this.contacts = contacts;
          this.dtOptions.language.lengthMenu = `Show _MENU_ entries of ${this.contacts.length} search results`;
          if (this.dtElement.dtInstance) {
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
              dtInstance.destroy();
              this.dtTrigger.next();
            });
          } else {
            this.dtTrigger.next();
          }
        });
    });
  }

  buildQueryParams(params) {
    return {
      division_id: this.divisionId,
      product_id: this.productId,
      nomination_type: this.nominationType,
      contract_status: this.contractStatus,
      ...params,
    };
  }

  divisionSelected(value) {
    this.refresh(this.router, this.buildQueryParams({ division_id: value }));
  }

  productSelected(value) {
    this.refresh(this.router, this.buildQueryParams({ product_id: value }));
  }

  nominationTypeSelected(value) {
    this.refresh(this.router, this.buildQueryParams({ nomination_type: value }));
  }

  contractStatusSelected(value) {
    this.refresh(this.router, this.buildQueryParams({ contract_status: value }));
  }

  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
  }

  onNominateSpeaker() {
    this.modalService.show(NewNominationModalComponent, { class: 'modal-sm' });
  }

  updateContact(contact, contact1) {
    contact.contract_status_id = contact1.contract_status_id;
    if (contact1.agreements) {
      contact.agreements = contact1.agreements;
    }
  }

  approveSubmission(contact) {
    this.contactSubmissionService.approve([contact], {
      company_id: this.getCurrentCompanyId()
    }).subscribe(contacts => {
      contact.clicked = true;
      this.toastr.success('Approved!');
      this.updateContact(contact, contacts[0]);
    });
  }

  declineSubmission(contact) {
    this.contactSubmissionService.decline([contact], {
      company_id: this.getCurrentCompanyId()
    }).subscribe(contacts => {
      contact.clicked = true;
      this.toastr.success('Declined!');
      this.updateContact(contact, contacts[0]);
    });
  }

  checkAll(value) {
    this.contacts.forEach(c => {
      this.checkedContacts[c.id] = value;
    });
  }

  editSubmission(i) {
    this.bsEditModalRef = this.modalService.show(KOLContractingEditModalComponent, {
      initialState: {
        contact: this.contacts[i],
      },
      class: 'modal-xl',
    });
    this.bsEditModalRef.content.event.subscribe(contactId => {
      this.contactSubmissionService.get(contactId, {
        company_id: this.getCurrentCompanyId(),
      }).subscribe((res) => {
        Object.assign(this.contacts[i], res);
      });
    });
  }

  getSelectedContacts(data) {
    const contacts = [];
    this.contacts.forEach(c => {
      if (this.checkedContacts[c.id]) {
        contacts.push({
          id: c.id,
          speaker_level_id: data.speaker_level_id,
        });
      }
    });
    return contacts;
  }

  setChecked() {
    this.bsBulkSubmissionsModalRef = this.modalService.show(BulkSubmissionModalComponent, {
      initialState: {
        speakerLevels: this.speakerLevels,
      },
    });
    this.bsBulkSubmissionsModalRef.content.event.subscribe(data => {
      const contacts = this.getSelectedContacts(data);
      if (contacts.length) {
        const action = (data.action === 'approve' ? this.contactSubmissionService.approve : this.contactSubmissionService.decline);
        action.bind(this.contactSubmissionService)(contacts, {
          company_id: this.getCurrentCompanyId()
        }).subscribe(res => {
          this.toastr.success('Approved!');
          const contactMap = {};
          res.forEach(contact => {
            contactMap[contact.id] = contact;
          });
          this.contacts.forEach(contact => {
            if (contactMap[contact.id]) {
              this.updateContact(contact, contactMap[contact.id]);
            }
          });
        });
      }
    });
  }

  setCheckedToApproved() {
    const contacts = this.getSelectedContacts({});
    this.approving = true;
    if (contacts.length) {
      this.contactSubmissionService.approve(contacts, {
        company_id: this.getCurrentCompanyId()
      }).subscribe(res => {
        this.toastr.success('Approved!');
        const contactMap = {};
        res.forEach(contact => {
          contactMap[contact.id] = contact;
        });
        this.contacts.forEach(contact => {
          if (contactMap[contact.id]) {
            this.updateContact(contact, contactMap[contact.id]);
          }
        });
        this.approving = false;
      }, err => {
        this.toastr.error(this.getErrorMessage(err));
        this.approving = false;
      });
    }
  }

  onExport() {
    this.contactSubmissionService.export({
      company_id: this.getCurrentCompanyId(),
    }, {
      division_id: this.divisionId,
      product_id: this.productId,
      nomination_type: this.nominationType,
      contract_status: this.contractStatus,
      csv: true,
    }).subscribe(data => {
      const downloadURL = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = downloadURL;
      link.download = `Speaker Contracting Report_${moment().format('MMDDYYYY')}.csv`;
      link.click();
    });
  }

  generateAgreement(contact) {
    contact.generatingAgreement = true;
    this.agreementService.generate({}, {
      company_id: this.getCurrentCompanyId(),
      speaker_id: contact.id,
    }).subscribe(data => {
      const downloadURL = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = downloadURL;
      link.download = 'Speaker Agreement.docx';
      link.click();
    }, err => {
      this.toastr.error(this.getErrorMessage(err));
      contact.generatingAgreement = false;
    });
  }

  isManagable(v) {
    return this.authenticationService.managableContractStatuses().includes(v);
  }
}
