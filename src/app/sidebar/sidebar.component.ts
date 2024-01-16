import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { Root, Student, User } from '../models/Root';
import { UserService } from '../services/user.service';
import { Subscription } from 'rxjs';
import { LoginService } from '../services/login.service';
import { LocalService } from '../services/local.service';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { StudentService } from '../services/student.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, AngularMaterialModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent implements OnInit, OnDestroy {
  isSidebarOpen = false;
  private subscription: Subscription = new Subscription();
  cartItm!: number;
  open: boolean = false;
  constructor(
    private router: Router,
    private userService: UserService,
    private logoutService: LoginService,
    private localStore: LocalService,
    private studentService: StudentService
  ) {}
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
  id_ecole!: number;
  val: boolean = true;
  user!: User;
  role!: string | string[];
  ecole!: string;
  ngOnInit() {
    this.subscription.add(
      this.userService.getUser.subscribe((users) => {
        this.user = users!;
      })
    );

    if (this.localStore.getDataJson('user1')) {
      console.log('userA', this.localStore.getDataJson('user1'));
      this.user = this.localStore.getDataJson('user1')!;
      this.role = this.user.role;
      this.id_ecole = this.user?.ecole_id!;
    }
    this.userService.getItemNumer.subscribe((item) => {
      this.cartItm = item;
    });
    this.all();
  }
  all() {
    this.subscription.add(
      this.studentService
        .byId<Root<Student>>(this.id_ecole, 'etudiants/ecole')
        .subscribe((student) => {
          console.log(student);
          this.cartItm=0
          student.data.forEach((element) => {
            if (element.etat == 'enAttente') {
              this.cartItm = this.cartItm + 1;
            }
            this.userService.setItemNumber(this.cartItm);
          });
        })
    );
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
        sessionStorage.removeItem('user1');
        sessionStorage.removeItem('token1');
        this.router.navigate(['/login']);
      }
    });
  }

  openModal() {
    this.open = !this.open;
  }

  view() {
    this.router.navigate(['/listStudents']);
    this.open = !this.open;
  }
}
