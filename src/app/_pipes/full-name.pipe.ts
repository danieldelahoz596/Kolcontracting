import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'fullName' })
export class FullNamePipe implements PipeTransform {
  transform(input: any): string {
    if (!input) {
      return input;
    }
    let name = '';
    if (input.first_name) {
      name = input.first_name;
    }
    if (input.last_name) {
      name += ' ' + input.last_name;
    }
    return name;
  }
}
