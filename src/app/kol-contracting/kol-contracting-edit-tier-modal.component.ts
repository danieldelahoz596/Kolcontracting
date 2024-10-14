import { Component, OnInit } from '@angular/core';

import { BsModalRef } from 'ngx-bootstrap/modal';
import { BaseComponent } from 'app/_components/base.component';
import { AuthenticationService, ListService, SpeakerRateDefaultService, ContactSubmissionService } from 'app/_services';

@Component({
  selector: 'app-kol-contracting-edit-tier-modal',
  templateUrl: './kol-contracting-edit-tier-modal.component.html',
})
export class KOLContractingEditTierModalComponent extends BaseComponent implements OnInit {
  contact: any;
  speakerLevels: any[];
  speakerSpecialties: any[];
  contractStatuses: any[];
  states: any[];
  rateCols: any[];
  rateRows: any[];

  constructor(
    authenticationService: AuthenticationService,
    public bsModalRef: BsModalRef,
    private listService: ListService,
    private contactSubmissionService: ContactSubmissionService,
    private speakerRateDefaultService: SpeakerRateDefaultService,
  ) {
    super(authenticationService);
  }

  ngOnInit() {
    if (!this.contact.rates) {
      this.contact.rates = {};
    }

    this.listService.getLists('SpeakerContractStatus').subscribe((lists) => {
      this.contractStatuses = lists.SpeakerContractStatus;
    });
    this.listService.getListsForCompany(this.getCurrentCompanyId(),
      [
        'SpeakerLevel',
        'speaker_specialty',
        'SpeakerRateCol',
        'SpeakerRateRow',
      ].join(','))
      .subscribe((lists) => {
        this.speakerLevels = lists.SpeakerLevel;
        this.speakerSpecialties = lists.speaker_specialty;
        this.rateCols = lists.SpeakerRateCol;
        this.rateRows = lists.SpeakerRateRow;
      });
  }

  onSubmit() {
    this.contactSubmissionService.update([this.contact], {
      company_id: this.getCurrentCompanyId()
    }).subscribe();
    this.bsModalRef.hide();
  }

  rateRow(row) {
    if (!this.contact.rates[row.id]) {
      this.contact.rates[row.id] = {};
    }
    return this.contact.rates[row.id];
  }

  resetRates() {
    this.speakerRateDefaultService.list({ company_id: this.getCurrentCompanyId() }, {
      speaker_level_id: this.contact.speaker_level_id,
      specialty: this.contact.specialties && this.contact.specialties.length ? this.contact.specialties[0] : null,
    }).subscribe(res => {
      this.contact.rates = res && res.data ? res.data : {};
    });
  }
}
