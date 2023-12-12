import { AbstractControl, ValidatorFn, Validators } from '@angular/forms';

export function phoneNumberFixeSnValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const phoneNumberFixe: string = control.value;

    if (!phoneNumberFixe) {
      return null;
    }

    const regex = /^(?:\+221(?:7[5678]|76|75|70|33)|7[5678]|76|75|70|33)\d{7}$/;

    return regex.test(phoneNumberFixe) ? null : { phoneNumberFixeSn: true };
  };
}

export function validatephoneNumberFixeSn() {
  return Validators.compose([
    Validators.required,
    phoneNumberFixeSnValidator(),
  ]);
}
