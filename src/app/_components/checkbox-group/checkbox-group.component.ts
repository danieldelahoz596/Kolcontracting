import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-checkbox-group',
  templateUrl: './checkbox-group.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxGroupComponent),
      multi: true,
    },
  ],
})
export class CheckboxGroupComponent implements ControlValueAccessor {
  @Input() options = Array<any>();
  @Input() inline = false;

  private _model: any;
  private onChange: (m: any) => void;
  private onTouched: (m: any) => void;

  get model() {
    return this._model;
  }

  public writeValue(value: any): void {
    this._model = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  set(value: any) {
    this._model = value;
    this.onChange(this._model);
  }

  toggleCheck(value) {
    if (this.isChecked(value)) {
      const index = this._model.indexOf(value);
      if (!this._model || index < 0) {
        return;
      }
      this._model.splice(index, 1);
      this.onChange(this._model);
    } else {
      if (this._model instanceof Array) {
        this._model.push(value);
      } else {
        this._model = [value];
      }
      this.onChange(this._model);
    }
  }

  isChecked(value: string): boolean {
    if (this._model instanceof Array) {
      return this._model.indexOf(value) > -1;
    } else if (!!this._model) {
      return this._model === value;
    }
    return false;
  }

  getValue(option): string {
    if (option instanceof Object) {
      return option.id || option.value;
    }
    return option;
  }

  getLabel(option): string {
    if (option instanceof Object) {
      return option.label || option.text || option.name || option.value || option.id;
    }
    return option;
  }
}
