import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'svgIdPath'
})
export class SvgIdPathPipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): string {
    return `url(${window.location.href}#${value})`;
  }
}
