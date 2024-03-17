import { AbstractControl, ValidatorFn } from '@angular/forms';

export function maxParoleValidator(numeroParoleConsentito:number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const valore: string = control.value;

    const totParole = valore ? valore.trim().split(/\s+/).length : 0;
    if (totParole > numeroParoleConsentito) {
      return { 'maxParoleError': { numeroParoleConsentito } };
    }

    return null;
  };
}
