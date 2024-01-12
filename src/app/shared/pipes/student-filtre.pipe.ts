import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'studentFiltre',
  standalone: true,
})
export class FiltreStudentPipe implements PipeTransform {
  transform(items: any[], selected: any): any[] {
    if (!items || !selected || selected == 'Filtrer') {
      return items;
    }
    return items.filter((item) => item.niveau == selected);
  }
}
