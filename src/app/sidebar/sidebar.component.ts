import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { User } from '../models/Root';
import { UserService } from '../services/user.service';
import { Subscription } from 'rxjs';
import { LoginService } from '../services/login.service';
import { LocalService } from '../services/local.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent implements OnInit, OnDestroy {
  isSidebarOpen = false;
  private subscription: Subscription = new Subscription();
  constructor(
    private router: Router,
    private userService: UserService,
    private logoutService: LoginService,
    private localStore: LocalService
  ) {}
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
  val: boolean = true;
  user!: User;
  role!: string | string[];
  ngOnInit() {
    this.subscription.add(
      this.userService.getUser.subscribe((users) => {
        this.user = users!;
      })
    );
    // if (localStorage.getItem('user')) {
    //   let ue = localStorage.getItem('user');
    //   this.user = JSON.parse(ue!);
    //   this.role = this.user.role;
    // }
    if (this.localStore.getDataJson('user1')) {
      console.log('userA', this.localStore.getDataJson('user1'));
      this.user = this.localStore.getDataJson('user1')!;
      this.role = this.user.role;
    }
  }
  isZ50 = false;
  toggleZ50() {
    this.isZ50 = !this.isZ50;
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
        this.logoutService.logout(this.user.id).subscribe((result) => {
          console.log(result);
        });
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('token');
        sessionStorage.clear();
        this.router.navigate(['/login']);
      }
    });
  }
}
