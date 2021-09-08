import { Pipe, PipeTransform } from '@angular/core';
import { Roles } from '../services/auth.service';

@Pipe({
  name: 'roleIcon'
})
export class RoleIconPipe implements PipeTransform {

  transform(value: Roles): string {
    switch (value) {
      case 'ADMIN':
        return 'shield-half-outline'
      case 'EMPLOYEE':
        return 'person-outline'
      case 'RESTAURANT':
        return 'restaurant-outline'
      default: 
        return 'person-outline'
    }
  }

}
