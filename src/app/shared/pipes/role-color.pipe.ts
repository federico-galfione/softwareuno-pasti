import { Pipe, PipeTransform } from '@angular/core';
import { Roles } from '@shared/services';

@Pipe({
  name: 'roleColor'
})
export class RoleColorPipe implements PipeTransform {

  transform(value: Roles): 'primary' | 'secondary' | 'tertiary' {
    switch (value) {
      case 'ADMIN':
        return 'tertiary'
      case 'EMPLOYEE':
        return 'primary'
      case 'RESTAURANT':
        return 'secondary'
      default: 
        return 'primary'
    }
  }

}
