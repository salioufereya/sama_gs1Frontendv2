import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-choice-profil',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './choice-profil.component.html',
  styleUrl: './choice-profil.component.css'
})
export class ChoiceProfilComponent {
  currentYear: number = new Date().getFullYear();
}
