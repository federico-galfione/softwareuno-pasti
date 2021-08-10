import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const ordersValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {

    const primi = control.get('primi').value.filter(x => x.selected);
    const secondi = control.get('secondi').value.filter(x => x.selected);
    const contorni = control.get('contorni').value.filter(x => x.selected);
    const pizze = control.get('pizze').value.filter(x => x.selected);
    const all = [...primi, ...secondi, ...contorni, ...pizze];

    return !(
        (all.length === 1) || 
        (primi.length === 1 && secondi.length === 0 && contorni.length === 1 && pizze.length === 0) ||
        (primi.length === 0 && secondi.length === 1 && contorni.length === 1 && pizze.length === 0) ||
        (primi.length === 0 && secondi.length === 0 && contorni.length === 2 && pizze.length === 0) ||
        (primi.length === 0 && secondi.length === 0 && contorni.length === 0 && pizze.length === 1)
      ) ? {invalidOrder: all.length > 0, noElements: all.length <= 0} : null
  };