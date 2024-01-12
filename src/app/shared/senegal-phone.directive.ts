import { Directive } from '@angular/core';
import {
  NG_VALIDATORS,
  Validator,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';

@Directive({
  selector: '[appSenegalPhone]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: SenegalPhoneDirective, multi: true },
  ],
  standalone: true,
})
export class SenegalPhoneDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }
    const regex = /^(\+221)?[78]\d{7}$/;
    const isValid = regex.test(control.value);
    return isValid ? null : { senegalPhone: true };
  }
}
