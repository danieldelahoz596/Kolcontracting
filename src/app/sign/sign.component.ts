import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { environment } from '../../environments/environment';
import { SpeakerSignService } from '../_services';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sign',
  templateUrl: './sign.component.html',
  styleUrls: ['./sign.component.css'],
})
export class SignComponent implements OnInit {
  @ViewChild(SignaturePad) public signaturePad: SignaturePad;
  options: any;
  signaturePadOptions = {
    minWidth: 2,
    canvasWidth: 400,
    canvasHeight: 80
  };

  status: string;

  token: string;
  company: any;
  speaker: any;
  agreementUrl: SafeHtml;
  constructor(
    private route: ActivatedRoute,
    private domSanitizer: DomSanitizer,
    private toastr: ToastrService,
    private speakerSignService: SpeakerSignService,
  ) {
    this.options = {
      floatLabel: 'always',
    };
  }

  ngOnInit() {
    this.status = '';
    this.route.queryParams.subscribe(({ token }) => {
      if (token) {
        this.token = token;
        this.speakerSignService.list({}, {
          token: encodeURIComponent(token)
        }).subscribe(res => {
          if (res.decline) {
            this.status = 'decline';
          } else {
            let agreementUrl = res.agreement_url;
            agreementUrl = encodeURIComponent(`${environment.apiBaseUrl}${agreementUrl}?token=${encodeURIComponent(token)}`);
            agreementUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${agreementUrl}`;
            this.agreementUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(agreementUrl);
            this.speaker = res.speaker;
            this.company = res.company;
          }
        }, err => {
          this.status = 'notAwaiting';
        });
      }
    });
  }

  onSubmit() {
    const signature = this.signaturePad.toDataURL();
    this.speakerSignService.create({
      token: this.token,
      signature,
    }).subscribe(res => {
      this.status = 'thankyou';
      this.toastr.success('Successfully Signed!');
    }, err => {
      this.toastr.error('Failed to Sign!');
    });
  }

  onDownload() {
    this.speakerSignService.get(this.speaker.id, {}, {
      token: encodeURIComponent(this.token)
    }).subscribe(data => {
      const downloadURL = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = downloadURL;
      link.download = 'Speaker Agreement.docx';
      link.click();
    });
  }

  onDecline() {
    this.speakerSignService.decline({}, {
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
