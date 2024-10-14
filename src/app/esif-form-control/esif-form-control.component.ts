import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment';

import { SpeakerEsifFormService } from 'app/_services';

import { W9ModalComponent } from './w9-modal.component';
import { BsModalService } from 'ngx-bootstrap';

@Component({
  selector: 'app-esif-form-control',
  templateUrl: './esif-form-control.component.html',
})
export class EsifFormControlComponent implements OnInit {
  @Input() component: any;
  @Input() values: any;
  @Input() errors: any;
  @Input() adminFlags: any;
  @Input() index: number;
  @Input() speaker: any;
  @Input() office: any;
  @Input() states: any;
  @Input() speakerSpecialties: any;
  @Input() speakerSubSpecialties: any;
  objects: any[];
  errorMessage: string;

  constructor(
    private modalService: BsModalService,
    private speakerEsifFormService: SpeakerEsifFormService,
  ) { }

  ngOnInit() {
    this.objects = [''];
    if (this.component.multiple && this.values[this.key]) {
      for (let i = 0; i < this.values[this.key]; i++) {
        this.objects.push('');
      }
    }
    if (this.component.type === 'DATE' && this.values[this.key]) {
      this.values[this.key] = moment(this.values[this.key]).toDate();
    }
  }

  addObject() {
    this.objects.push('');
    if (!this.values[this.key]) {
      this.values[this.key] = 0;
    }
    this.values[this.key] += 1;
  }

  removeObject(i) {
    this.objects.splice(i, 1);
    this.values[this.key] -= 1;
  }

  get key() {
    return `${this.component.key}${this.index}`;
  }

  get na_key() {
    return `na_${this.component.key}${this.index}`;
  }

  isVisible() {
    if (this.component.showIf) {
      for (let i = 0; i < this.component.showIf.length; i++) {
        const k = this.component.showIf[i].key + this.index;
        const v = this.component.showIf[i].value;
        if (this.values[k] !== v) {
          return false;
        }
      }
    }
    return true;
  }

  onFileChange(event) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.values[this.key] = {
          name: file.name,
          type: file.type,
          size: file.size,
          data: reader.result
        };
      };
    }
  }

  hasErrors(count) {
    let required = this.component.required;
    if (this.component.requiredIf) {
      required = true;
      this.component.requiredIf.forEach((c) => {
        if ((c.length === 1 && this.values[c[0] + this.index]) || (c.length === 2 && this.values[c[0] + this.index] === c[1])) {
          // ignore
        } else {
          required = false;
        }
      });
    }
    let error = false;
    if (required) {
      for (let i = 0; i < count; i++) {
        if (!this.values[this.key + i]) {
          error = true;
        }
      }
    }
    this.errorMessage = null;
    if (required && !error) {
      if (this.component.type === 'SSN_CONFIRM' || this.component.type === 'EIN_CONFIRM') {
        for (let i = 0; i < count; i++) {
          const k = this.key.replace('_confirm', '') + i;
          if (this.values[k] !== this.values[this.key + i]) {
            this.errorMessage = this.component.type.replace('_CONFIRM', '') + ' doesn\'t match. Please enter again.';
            error = true;
          }
        }
      }
    }
    if (error) {
      this.errors[this.key] = true;
    } else {
      delete this.errors[this.key];
    }
    return error;
  }

  hasError() {
    let error = false;
    if (this.component.required && !this.values[this.key] && !this.values[this.na_key]) {
      error = true;
    }
    if (this.component.requiredIf && !this.values[this.key]) {
      error = true;
      this.component.requiredIf.forEach((c) => {
        if ((c.length === 1 && this.values[c[0] + this.index]) || (c.length === 2 && this.values[c[0] + this.index] === c[1])) {
          // ignore
        } else {
          error = false;
        }
      });
    }
    if (error) {
      this.errors[this.key] = true;
    } else {
      delete this.errors[this.key];
    }
    return error;
  }

  selectionChanged(value) {
    if (this.component.changes) {
      this.component.changes.forEach((change) => {
        if (change.value[value]) {
          const k = change.key + this.index;
          this.values[k] = change.value[value];
        }
      });
    }
  }

  radioSelected(value) {
    const speaker = this.speaker;
    const office = this.office || {};
    let k = null;
    if (this.component.changes) {
      this.component.changes.forEach((change) => {
        k = change.key + this.index;
        if ('value' in change) {
          this.values[k] = change.value;
        } else if ('eval' in change) {
          if (eval(change.eval) !== 'null') {
            this.values[k] = eval(change.eval);
          }
        }
      });
    }
  }

  generateW9() {
    this.modalService.show(W9ModalComponent, {
      initialState: {
        values: this.values,
        speaker: this.speaker,
      }
    });
  }

  downloadW9(w9) {
    this.speakerEsifFormService.downloadFile(w9).subscribe(data => {
      const downloadURL = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = downloadURL;
      link.download = `W9 - ${this.speaker.last_name} ${this.speaker.first_name}.pdf`;
      link.click();
    });
  }

  download(file) {
    const link = document.createElement('a');
    link.href = file.data;
    link.download = file.name;
    link.click();
  }

  isAdminFlags() {
    return this.adminFlags[this.key];
  }

  selectValues() {
    if (this.component.type === 'SPECIALTY') {
      return this.speakerSpecialties ? this.speakerSpecialties.map(s => s.value) : [];
    }
    if (this.component.type === 'SUBSPECIALTY') {
      return this.speakerSubSpecialties ? [''].concat(this.speakerSubSpecialties.map(s => s.value)) : [];
    }
    return this.component.values;
  }

  isSelect() {
    return ['SELECT', 'SPECIALTY', 'SUBSPECIALTY'].includes(this.component.type);
  }

  einSelected() {
    return this.key === 'payment_name0' && this.values['payment_ssn0'] && this.values['payment_ssn0'].includes('EIN');
  }
}
