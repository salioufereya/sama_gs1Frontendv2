import { AbstractControl, ValidationErrors } from '@angular/forms';
import * as moment from 'moment';

export function dateRangeValidator(year: number, maxDate: any) {
  return (control: AbstractControl): ValidationErrors | null => {
    const dateValue = moment(control.value);

    if (!dateValue.isValid()) {
      return { ValidateDate: { invalid: true } };
    }
    const validationString = dateValue.format('YYYY');

    if (Number(validationString) < year || dateValue.isAfter(maxDate)) {
      return { ValidateDateRange: { invalid: true } };
    }
    return null;
  };
}
