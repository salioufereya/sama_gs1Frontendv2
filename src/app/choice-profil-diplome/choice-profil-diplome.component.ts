import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-choice-profil-diplome',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './choice-profil-diplome.component.html',
  styleUrl: './choice-profil-diplome.component.css'
})
export class ChoiceProfilDiplomeComponent {
  currentYear: number = new Date().getFullYear();
}
