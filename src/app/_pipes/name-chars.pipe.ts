import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'nameChars' })
export class NameCharsPipe implements PipeTransform {
  transform(input: any): string {
    if (!input) {
      return input;
    }
    let name = '';
    if (input.first_name) {
      name = input.first_name[0];
    }
    if (input.last_name) {
      name += input.last_name[0];
    }
    return name;
  }
}
