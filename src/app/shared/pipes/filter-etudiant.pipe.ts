import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterEtudiant',
  standalone: true,
})
export class FilterEtudiantPipe implements PipeTransform {
  transform(etudiants: any[], searchTerm: string, filterField: string): any[] {
    if (!searchTerm) {
      return etudiants;
    }
    searchTerm = searchTerm.toLowerCase();
    return etudiants.filter((etudiant) =>
      etudiant[filterField].toLowerCase().includes(searchTerm)
    );
  }
}
