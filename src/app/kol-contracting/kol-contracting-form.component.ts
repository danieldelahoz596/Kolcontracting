import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-kol-contracting-form',
  templateUrl: './kol-contracting-form.component.html',
  styleUrls: ['./kol-contracting-form.component.css'],
})
export class KOLContractingFormComponent implements OnInit {
  @Input() contact: any;
  @Input() salutations: any[];
  @Input() speakerLevels: any[];
  @Input() speakerSpecialties: any[];
  @Input() states: any[];
  @Input() files: any;
  @Input() divisions: any[];
  @Input() products: any[];

  constructor() {}

  ngOnInit() {
  }

  onFileRemove(file) {
    this.contact[file] = null;
  }

  onCVChange(event) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.files.cv = reader.result;
      };
    }
  }
}
