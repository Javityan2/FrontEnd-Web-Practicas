import type { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function multiploDe(n: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valor = Number(control.value);
    // Vacío no es asunto de este validador: para eso está required.
    if (control.value === null || control.value === '') return null;
    return valor % n === 0 ? null : { multiploDe: { n, valor } };
  };
}
