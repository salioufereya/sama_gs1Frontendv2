import { AbstractControl, ValidatorFn, Validators } from '@angular/forms';

export function phoneNumberSnValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const phoneNumber: string = control.value;

    if (!phoneNumber) {
      return null;
    }

    const regex = /^(?:\+221(?:7[5678]|76|75|70)|7[5678]|76|75|70)\d{7}$/;

    return regex.test(phoneNumber) ? null : { phoneNumberSn: true };
  };
}

export function validatePhoneNumberSn() {
  return Validators.compose([Validators.required, phoneNumberSnValidator()]);
}
