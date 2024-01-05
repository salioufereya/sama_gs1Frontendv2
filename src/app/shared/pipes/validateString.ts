import { FormControl } from '@angular/forms';

export function ValidateString(control: FormControl) {
  let pattern = /[^a-zA-ZÀ-ÖØ-öø-ÿ0-9 -]/g;
  if (pattern.test(control.value)) {
    return { validString: true };
  }
  return null;
}
