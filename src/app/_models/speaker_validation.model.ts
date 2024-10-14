import * as moment from 'moment';

export class SpeakerValidation {
  id: number;
  type_id: string;
  status_id: string;
  validated_at: Date;
  user_id: number;
  user: any;
  editing: boolean;
  files: any[];
  file: any;
  deserialize(obj: any) {
    Object.assign(this, obj);
    [
      'validated_at',
    ].forEach(field => {
      if (this[field]) {
        this[field] = moment(this[field]).toDate();
      }
    });
    return this;
  }
}
