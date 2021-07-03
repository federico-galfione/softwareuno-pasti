import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'firstCharUppercase'
})
export class FirstCharUppercasePipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    return value.firstCharUppercase();
  }

}
