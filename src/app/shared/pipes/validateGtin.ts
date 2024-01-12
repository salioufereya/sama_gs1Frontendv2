
import { FormControl } from "@angular/forms";

export function ValidateGtin(control: FormControl) {
 
  let pattern = /^\d+$/;
  
  if (pattern.test(control.value)) {
    return null; 
  } else {
    return { validGtin: true };
  }
}
