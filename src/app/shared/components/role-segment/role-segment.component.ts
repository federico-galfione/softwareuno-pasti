import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Roles } from '../../services/auth.service';

@Component({
  selector: 'app-role-segment',
  templateUrl: './role-segment.component.html',
  styleUrls: ['./role-segment.component.scss'],
  providers: [
    {
       provide: NG_VALUE_ACCESSOR,
       useExisting: forwardRef(() => RoleSegmentComponent),
       multi: true
    }
  ],
  animations: [
    trigger('selectDeselect', [
      state('select', style({
        backgroundColor: 'var(--ion-color-tertiary)',
        color: 'var(--ion-color-tertiary-contrast)'
      })),
      state('deselect', style({
        backgroundColor: 'var(--ion-color-tertiary-contrast)',
        color: 'var(--ion-color-tertiary)'
      })),
      transition('* => select', [
        animate('0.2s ease-out')
      ]),
      transition('* => deselect', [
        animate('0.2s ease-in')
      ]),
    ])
  ]
})
export class RoleSegmentComponent implements ControlValueAccessor {

  @Input() 
  multipleValues: boolean = true;
  value: Array<Roles> | Roles = [];
  onChange: any = () => {};
  onTouched: any = () => {};
  disabled = false; 
  selectedRoles = {
    admin: false,
    employee: false,
    restaurant: false
  }

  constructor() { }

  writeValue(value: Array<Roles>){
    this.value = value;
  }

  registerOnChange(fn: any){
    this.onChange = fn;
    this.showSelection();
  }   

  registerOnTouched(fn: any){
    this.onTouched = fn;
  } 

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  toggleRole(role: Roles){
    if(this.multipleValues && this.value){
      let currentValue = this.value as Array<Roles>;
      currentValue = (Array.isArray(currentValue)) ? currentValue : [currentValue];
      this.value = (currentValue.includes(role)) ? currentValue.filter(x => x !== role) : [...currentValue, role];
    } else {
      this.value = role;
    }
    this.showSelection();
    this.onChange(this.value);
  }

  showSelection(){
    if(this.multipleValues && this.value){
      for (const [key, value] of Object.entries(this.selectedRoles))
        this.selectedRoles[key] = this.value.includes(key.toUpperCase() as Roles);
    }else{
      for (const [key, value] of Object.entries(this.selectedRoles))
        this.selectedRoles[key] = this.value === key.toUpperCase();
    }
  }
}
