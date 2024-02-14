import { Component, OnInit } from '@angular/core';
import { CreerEcoleComponent } from '../creer-ecole/creer-ecole.component';
import { User } from 'src/app/models/Root';
import { Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { LoginService } from 'src/app/services/login.service';
import { LocalService } from 'src/app/services/local.service';
import { initFlowbite } from 'flowbite';

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
export class SideBarAdminComponent implements OnInit {
  isSidebarOpen = false;
  constructor(
    private router: Router,
    private logoutService: LoginService,
    private localStore: LocalService
  ) {}
  ngOnDestroy(): void {}
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
  val: boolean = true;
  user!: User;
  role!: string | string[];
  ngOnInit() {
    if (this.localStore.getDataJson('user1')) {
      console.log('userA', this.localStore.getDataJson('user1'));
      this.user = this.localStore.getDataJson('user1')!;
    }
    initFlowbite();
  }
  isZ50 = false;
  toggleZ50() {
    this.isZ50 = !this.isZ50;
  }
  currentYear: number = new Date().getFullYear();
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
        this.logoutService.logout(this.user.id).subscribe((result) => {
          console.log(result);
        });
        sessionStorage.removeItem('user1');
        sessionStorage.removeItem('token1');
        this.router.navigate(['/login']);
      }
    });
  }
}
