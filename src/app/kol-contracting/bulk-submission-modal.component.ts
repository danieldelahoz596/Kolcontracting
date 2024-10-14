import { Component, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';


@Component({
  selector: 'app-bulk-submission-modal',
  templateUrl: './bulk-submission-modal.component.html',
})
export class BulkSubmissionModalComponent {
  public event: EventEmitter<any> = new EventEmitter();

  action: string;
  speaker_level_id: string;
  speakerLevels: any[];
  constructor(
    public bsModalRef: BsModalRef,
  ) { }

  onSubmit() {
    this.bsModalRef.hide();
    this.event.emit({
      action: this.action,
      speaker_level_id: this.speaker_level_id,
    });
  }
}
