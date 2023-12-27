import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { User } from '../models/Root';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  isSidebarOpen = false;
  constructor(private router: Router, private userService: UserService) {}
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
  val: boolean = true;
  user!: User;
  role!: string | string[];
  ngOnInit() {
    this.userService.getUser.subscribe((users) => {
      this.user = users!;
    });
    if (localStorage.getItem('user')) {
      let ue = localStorage.getItem('user');
      this.user = JSON.parse(ue!);
      this.role = this.user.role;
    }
  }

  loggout() {
    Swal.fire({
      title: 'Voulez vous vraiment se déconnecter?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui!! !',
      cancelButtonText: 'Non, annuler!',
      confirmButtonColor: '#002C6c',
      cancelButtonColor: '#d33',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('user');
        localStorage.removeItem('tkn');
        this.router.navigate(['/login']);
      }
    });
  }
}
