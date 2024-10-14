import { Component, OnInit, EventEmitter, ViewChild } from '@angular/core';

import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';

declare var $: any;

import { BaseComponent } from 'app/_components/base.component';
import {
  AuthenticationService,
  // CompanyService,
  ListService,
  ContactSubmissionService,
  SpeakerEsifFormService,
  SpeakerValidationService,
  SpeakerRateDefaultService,
  SpeakerValidationNoteService,
  SpeakerValidationFileService,
  SpeakerService,
  SpeakerAgreementService,
} from 'app/_services';
import { SpeakerValidation } from 'app/_models/speaker_validation.model';
import { buildFormData } from 'app/_utils/helpers';

@Component({
  selector: 'app-kol-contracting-edit-modal',
  templateUrl: './kol-contracting-edit-modal.component.html',
})
export class KOLContractingEditModalComponent extends BaseComponent implements OnInit {
  public event: EventEmitter<any> = new EventEmitter();

  contact: any;
  salutations: any[];
  speakerLevels: any[];
  speakerSpecialties: any[];
  speakerSubSpecialties: any[];
  contractStatuses: any[];
  states: any[];
  agreementTemplates: any[];

  esifFormId: number;
  esifForm: any;
  esifFormAdminFlags: any;
  esifFormErrors: any;
  esifData: any;
  esifDataPdf: string;

  validations: SpeakerValidation[];
  validationNotes: any[];
  newValidationNote: any;
  validationTypes: any[];
  validationStatuses: any[];
  @ViewChild('w9FileInput') w9FileInput;

  rateCols: any[];
  rateRows: any[];

  constructor(
    authenticationService: AuthenticationService,
    // companyService: CompanyService,
    public bsModalRef: BsModalRef,
    private toastr: ToastrService,
    private listService: ListService,
    private contactSubmissionService: ContactSubmissionService,
    private speakerService: SpeakerService,
    private speakerEsifFormService: SpeakerEsifFormService,
    private speakerValidationService: SpeakerValidationService,
    private speakerRateDefaultService: SpeakerRateDefaultService,
    private speakerValidationNoteService: SpeakerValidationNoteService,
    private speakerValidationFileService: SpeakerValidationFileService,
    private speakerAgreementService: SpeakerAgreementService,
  ) {
    super(authenticationService);
  }

  ngOnInit() {
    $(document).ready(function () {
      $('.dropify').dropify();
    });
    this.newValidationNote = {};
    if (!this.contact.office) {
      this.contact.office = { address_type: 'office' };
    }
    this.contact.npi_registry = this.contact.npi_registry || {};
    this.contact.rates = this.contact.rates || {};
    this.contact.degrees = this.contact.degrees || [];
    this.contact.specialties = this.contact.specialties || [];
    this.listService.getLists('CountryState,SpeakerContractStatus,SpeakerValidationType,SpeakerValidationStatus').subscribe((lists) => {
      this.states = lists.CountryState;
      this.contractStatuses = lists.SpeakerContractStatus;
      this.validationTypes = lists.SpeakerValidationType;
      this.validationStatuses = lists.SpeakerValidationStatus;
      this.validations = this.validationTypes.map(t => (new SpeakerValidation().deserialize({
        type_id: t.id,
        validated_at: new Date(),
        status_id: 'pending',
      })));
      this.speakerValidationService.list({
        company_id: this.getCurrentCompanyId(),
        speaker_id: this.contact.id,
      }).subscribe((validations) => {
        validations.forEach((validation) => {
          const i = this.validations.findIndex(v => v.type_id === validation.type_id);
          this.validations[i] = new SpeakerValidation().deserialize(validation);
        });
      });
    });
    this.listService.getListsForCompany(this.getCurrentCompanyId(),
      [
        'salutation',
        'SpeakerLevel',
        'speaker_specialty',
        'speaker_subspecialty',
        'SpeakerRateCol',
        'SpeakerRateRow',
        'speaker_agreement_template',
      ].join(','))
      .subscribe((lists) => {
        this.salutations = lists.salutation;
        this.speakerLevels = lists.SpeakerLevel;
        this.speakerSpecialties = lists.speaker_specialty;
        this.speakerSubSpecialties = lists.speaker_subspecialty;
        this.rateCols = lists.SpeakerRateCol;
        this.rateRows = lists.SpeakerRateRow;
        this.agreementTemplates = lists.speaker_agreement_template;
      });
    this.speakerEsifFormService.get('', {
      company_id: this.getCurrentCompanyId(),
      speaker_id: this.contact.id,
    }).subscribe((res) => {
      this.esifFormId = res.id;
      this.esifForm = res.form;
      this.esifData = res.data || {};
      this.esifDataPdf = res.data_pdf;
      this.esifFormErrors = {};
      this.esifFormAdminFlags = {};
      this.esifData.w9_signed_at = res.w9_signed_at;
      this.esifData.w9 = res.w9;
      const fullName = [
        'first_name', 'middle_name', 'last_name'
      ].filter(x => this.contact[x]).map(x => this.contact[x]).join(' ');
      if (this.esifData.payment_name0 !== fullName) {
        this.esifFormAdminFlags.payment_name0 = true;
      }
      if (this.esifData.payment_city0 !== this.contact.office.city) {
        this.esifFormAdminFlags.payment_city0 = true;
      }
      if (this.esifData.payment_state0 !== this.contact.office.state) {
        this.esifFormAdminFlags.payment_state0 = true;
      }
    });
    this.speakerValidationNoteService.list({
      company_id: this.getCurrentCompanyId(),
      speaker_id: this.contact.id,
    }).subscribe((notes) => {
      this.validationNotes = notes;
    });
  }

  isStaffCanAccount(): boolean {
    return false; // this.authenticationService.is_staff_can_account();
  }

  onSubmit() {
    this.contactSubmissionService.update([this.contact], {
      company_id: this.getCurrentCompanyId()
    }).subscribe(res => {
      this.bsModalRef.hide();
      this.event.emit(this.contact.id);
      this.toastr.success('Updated!');
    });
  }

  onUpdateEsif() {
    this.speakerEsifFormService.update({
      id: this.esifFormId,
      data: this.esifData,
    }, {
        company_id: this.getCurrentCompanyId(),
        speaker_id: this.contact.id
      }).subscribe(res => {
        this.bsModalRef.hide();
        this.event.emit(this.contact.id);
        this.toastr.success('Updated!');
      });
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

  isEditableValidation(type) {
    if (type.id !== 'contract') {
      return true;
    }
    const v = this.validations.filter(i => i.type_id !== 'contract' && i.type_id !== 'exceptions').find(i => i.status_id !== 'approved');
    if (!v) {
      return true;
    }
    return false;
  }

  onEditValidation(i) {
    this.validations[i].editing = true;
  }

  onSaveValidation(i) {
    if (this.validations[i].type_id === 'background') {
      if ((!this.validations[i].files || !this.validations[i].files.length) && !this.validations[i].file) {
        return;
      }
    }
    this.speakerValidationService.create(this.validations[i], {
      company_id: this.getCurrentCompanyId(),
      speaker_id: this.contact.id,
    }).subscribe((validation) => {
      this.validations[i] = new SpeakerValidation().deserialize(validation);
    });
  }

  onUpdateW9() {
    const formData = buildFormData();
    const file = this.w9FileInput.nativeElement;
    if (file.files && file.files[0]) {
      formData.append('file', file.files[0]);
    }
    this.speakerEsifFormService.updateW9({
      company_id: this.getCurrentCompanyId(),
      speaker_id: this.contact.id,
      esif_form_id: this.esifFormId,
    }, formData).subscribe((res) => {
      $('.dropify-clear').click();
      this.esifData.w9 = res.w9;
      this.toastr.success('Updated!');
    });
  }

  onFileChange(i, event) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.validations[i].file = {
          name: file.name,
          type: file.type,
          size: file.size,
          data: reader.result
        };
      };
    }
  }

  downloadValidationFile(file) {
    this.speakerValidationFileService.get(file.id, {
      company_id: this.getCurrentCompanyId(),
      speaker_id: this.contact.id,
    }).subscribe((res) => {
      const downloadURL = window.URL.createObjectURL(res);
      const link = document.createElement('a');
      link.href = downloadURL;
      link.download = file.filename;
      link.click();
    });
  }

  deleteValidationFile(validation, i) {
    this.speakerValidationFileService.delete(validation.files[i], {
      company_id: this.getCurrentCompanyId(),
      speaker_id: this.contact.id,
    }).subscribe((res) => {
      validation.files.splice(i);
    });
  }

  onAddNote() {
    this.speakerValidationNoteService.create(this.newValidationNote, {
      company_id: this.getCurrentCompanyId(),
      speaker_id: this.contact.id
    }).subscribe((notes) => {
      this.validationNotes = notes;
      this.newValidationNote = {};
    });
  }

  resetContractStatus(validation) {
    if (validation.type_id === 'esif_validation' && validation.status_id === 'approved') {
      this.contact.contract_status_id = 'pending_debarment_review';
    }
    if (validation.type_id === 'state_license' && validation.status_id === 'approved') {
      this.contact.contract_status_id = 'pending_debarment_review';
    }
    if (validation.type_id === 'npi' && validation.status_id === 'approved') {
      this.contact.contract_status_id = 'pending_debarment_review';
    }
    if (validation.type_id === 'background' && validation.status_id === 'approved') {
      this.contact.contract_status_id = 'awaiting_medical';
    }
    if (validation.type_id === 'contract' && validation.status_id === 'approved') {
      this.contact.contract_status_id = 'awaiting_legal';
    }
  }

  onSubmitRates() {
    this.speakerService.update({
      id: this.contact.id,
      specialties: this.contact.specialties,
      speaker_level_id: this.contact.speaker_level_id,
      rates: this.contact.rates,
    }, {
        company_id: this.getCurrentCompanyId()
      }).subscribe(res => {
        this.bsModalRef.hide();
        this.event.emit(this.contact.id);
        this.toastr.success('Updated!');
      });
  }

  generateAgreement() {
    this.speakerAgreementService.generate({}, {
      company_id: this.getCurrentCompanyId(),
      speaker_id: this.contact.id,
    }).subscribe(data => {
      const downloadURL = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = downloadURL;
      link.download = 'Speaker Agreement.docx';
      link.click();
    });
  }

  downloadAgreement(agreement) {
    const downloadContract = (data, extension) => {
      const downloadURL = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = downloadURL;
      link.download = `Contract - ${this.contact.last_name} ${this.contact.first_name}.${extension}`;
      link.click();
    };
    if (agreement.file.includes('.pdf')) {
      this.speakerAgreementService.downloadFile(agreement.file).subscribe((data) => {
        downloadContract(data, 'pdf');
      });
    } else {
      this.speakerAgreementService.downloadDocx(agreement.id, {
        company_id: this.getCurrentCompanyId(),
        speaker_id: this.contact.id,
      }).subscribe((data) => {
        downloadContract(data, 'docx');
      });
    }
  }
}
