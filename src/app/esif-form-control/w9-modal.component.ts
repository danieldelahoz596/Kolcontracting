import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { ToastrService } from 'ngx-toastr';
import { BsModalRef } from 'ngx-bootstrap';

import { environment } from '../../environments/environment';

@Component({
  selector: 'app-w9-modal',
  templateUrl: 'w9-modal.component.html',
})
export class W9ModalComponent implements OnInit {
  @ViewChild(SignaturePad) public signaturePad: SignaturePad;
  token: string;
  signaturePadOptions = {
    minWidth: 2,
    canvasWidth: 400,
    canvasHeight: 80
  };
  values: any;
  speaker: any;
  submitDisabled = true;

  constructor(
    public bsModalRef: BsModalRef,
    private route: ActivatedRoute,
    private http: HttpClient,
    private toastr: ToastrService
  ) { }

  onClose(): void {
    this.bsModalRef.hide();
  }

  drawComplete(): void {
    this.submitDisabled = false;
  }

  onSubmit() {
    const signature = this.signaturePad.toDataURL();
    this.http.post<any>(`${environment.apiBaseUrl}/speaker_esif_forms/w9`, {
      token: this.token,
      values: this.values,
      signature,
    }, {
      responseType: 'blob' as 'json'
    }).subscribe(res => {
      const downloadURL = window.URL.createObjectURL(res);
      const link = document.createElement('a');
      link.href = downloadURL;
      link.download = `W9 - ${this.speaker.last_name} ${this.speaker.first_name}.pdf`;
      link.click();
      this.bsModalRef.hide();
      this.values.w9_signed_at = new Date();
      this.toastr.success('Successfully Signed!');
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(({ token }) => {
      if (token) {
        this.token = token;
        this.http.post<Blob>(`${environment.apiBaseUrl}/speaker_esif_forms/w9`, {
          token,
          values: this.values,
        }, {
          responseType: 'blob' as 'json'
        }).subscribe(res => {
          const file = window.URL.createObjectURL(res);
          document.querySelector('iframe').src = file;
        });
      }
    });
  }
}
