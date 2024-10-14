import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'titlize' })
export class TitlizePipe implements PipeTransform {
  transform(input: string): string {
    if (!input) {
      return input;
    }
    return input.replace(/_/g, ' ').replace(/-/g, ' ').split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.substring(1).toLowerCase())
      .join(' ');
  }
}
