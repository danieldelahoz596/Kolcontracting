import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { SpeakerEsifFormService, ListService } from '../_services';

declare var $: any;

@Component({
  selector: 'app-esif-form',
  templateUrl: './esif-form.component.html',
})
export class EsifFormComponent implements OnInit, AfterViewInit {
  status: string;

  token: string;
  company: any;
  esifForm: any;
  esifData: any;
  esifFormErrors: any;
  esifFormAdminFlags: any;
  speaker: any;
  office: any;
  mailing: any;
  states: any[];
  speakerSpecialties: any[];
  speakerSubSpecialties: any[];
  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private speakerEsifFormService: SpeakerEsifFormService,
    private listService: ListService,
  ) {
  }

  ngOnInit() {
    this.status = '';
    this.route.queryParams.subscribe(({ token }) => {
      if (token) {
        this.token = token;
        this.speakerEsifFormService.list({}, {
          token: encodeURIComponent(token)
        }).subscribe(res => {
          if (res.decline) {
            this.status = 'decline';
          } else {
            this.listService.getLists('CountryState', {}, {
              headers: {
                'Authorization': res.auth_token,
              }
            }).subscribe((lists) => {
              this.states = lists.CountryState;
            });
            this.listService.getListsForCompany(res.company.id,
              [
                'speaker_specialty',
                'speaker_subspecialty',
              ].join(','), {}, {
                headers: {
                  'Authorization': res.auth_token,
                }
              })
              .subscribe((lists) => {
                this.speakerSpecialties = lists.speaker_specialty;
                this.speakerSubSpecialties = lists.speaker_subspecialty;
              });
            this.speaker = res.speaker;
            this.office = this.speaker.addresses.find(a => a.address_type === 'office');
            this.mailing = this.speaker.addresses.find(a => a.address_type === 'mailing');
            this.company = res.company;
            this.esifForm = res.form;
            this.esifData = res.data || {
              first_name0: this.speaker.first_name,
              middle_name0: this.speaker.middle_name,
              last_name0: this.speaker.last_name,
              degree0: this.speaker.degrees && this.speaker.degrees.length ? this.speaker.degrees[0] : '',
              specialty0: this.speaker.specialties && this.speaker.specialties.length ? this.speaker.specialties[0] : '',
              npi_number0: this.speaker.npi_no,
              medical_license_no0: this.speaker.licenses && this.speaker.licenses.length ? this.speaker.licenses[0].license : '',
              medical_license_state0: this.speaker.licenses && this.speaker.licenses.length ? this.speaker.licenses[0].state : '',
              employment_affiliation_name0: this.office ? this.office.affiliation : '',
              employment_department0: this.office ? this.office.department : '',
              employment_address10: this.office ? this.office.address1 : '',
              employment_address20: this.office ? this.office.address2 : '',
              employment_city0: this.office ? this.office.city : '',
              employment_state0: this.office ? this.office.state : '',
              employment_zip0: this.office ? this.office.zip : '',
              employment_telephone0: this.office ? this.office.phone : '',
              employment_fax_number0: this.office ? this.office.fax : '',
              employment_email0: this.office ? this.office.email : '',
              preferred_mailing_address_address10: this.mailing ? this.mailing.address1 : '',
              preferred_mailing_address_address20: this.mailing ? this.mailing.address2 : '',
              preferred_mailing_address_city0: this.mailing ? this.mailing.city : '',
              preferred_mailing_address_state0: this.mailing ? this.mailing.state : '',
              preferred_mailing_address_zip0: this.mailing ? this.mailing.zip : '',
              preferred_mailing_address_cell0: this.mailing ? this.mailing.phone : '',
              preferred_mailing_address_email0: this.mailing ? this.mailing.email : '',
            };
            this.esifData.w9_signed_at = res.w9_signed_at;
            this.esifFormErrors = {};
            this.esifFormAdminFlags = {};
          }
        }, err => {
          this.status = 'notPendingEsif';
        });
      }
    });
  }

  ngAfterViewInit() {
    window.onbeforeunload = function (event) {
      event.returnValue = 'You are about to lose all data that has not been saved.';
      return event.returnValue;
    };
  }

  hasErrors() {
    return Object.keys(this.esifFormErrors).length > 0;
  }

  onSubmit() {
    if (this.hasErrors()) {
      $('html,body').animate({
        scrollTop: $('.has-error').offset().top - 60,
      }, 'slow');
    } else {
      this.speakerEsifFormService.create({
        token: this.token,
        data: this.esifData,
        submitted_at: new Date(),
      }).subscribe(res => {
        this.status = 'thankyou';
        this.toastr.success('Successfully Submitted!');
      });
    }
  }

  saveForLater() {
    this.speakerEsifFormService.create({
      token: this.token,
      data: this.esifData,
    }).subscribe(res => {
      this.toastr.success('Successfully Saved!');
    });
  }

  onDecline() {
    this.speakerEsifFormService.decline({}, {
      token: encodeURIComponent(this.token)
    }).subscribe(res => {
      this.status = 'declined';
    });
  }

  onNoDecline() {
  }

  isStatus(value) {
    return this.status === value;
  }
}
