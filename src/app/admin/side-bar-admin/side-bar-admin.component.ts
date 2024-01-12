import { Component } from '@angular/core';
import { CreerEcoleComponent } from '../creer-ecole/creer-ecole.component';
import { User } from 'src/app/models/Root';
import { Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-side-bar-admin',
  standalone: true,
  imports: [
    CreerEcoleComponent,
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
  ],
  templateUrl: './side-bar-admin.component.html',
  styleUrl: './side-bar-admin.component.css',
})
export class SideBarAdminComponent {
  isSidebarOpen = false;
  constructor(private router: Router) {}
  ngOnDestroy(): void {}
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
  val: boolean = true;
  user!: User;
  role!: string | string[];
  ngOnInit() {}
  isZ50 = false;
  toggleZ50() {
    this.isZ50 = !this.isZ50;
  }
}
