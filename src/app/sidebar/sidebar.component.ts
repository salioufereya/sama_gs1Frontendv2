import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { User } from '../models/Data';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  isSidebarOpen = false;
  constructor(private router: Router) {}
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
  val: boolean = true;
  user!: User;
  role!: string | string[];
  ngOnInit() {
    if (localStorage.getItem('user')) {
      let ue = localStorage.getItem('user');
      this.user = JSON.parse(ue!);
      this.role = this.user.role;
      console.log(this.role);
      console.log(this.user);
    }
  }

  loggout() {
    Swal.fire({
      title: 'Voulez vous vraiment se déconnecter?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui!! !',
      cancelButtonText: 'Non, annuler!',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('user');
        localStorage.removeItem('tkn');
        this.router.navigate(['/login']);
        Swal.fire('déconnecté!', 'Déconnecté', 'success');
      }
    });
  }
}
