import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { SideBarAdminComponent } from '../admin/side-bar-admin/side-bar-admin.component';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { Root, Student, User } from '../models/Root';
import { LocalService } from '../services/local.service';
import { LoginService } from '../services/login.service';
import { StudentService } from '../services/student.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
  imports: [
    CommonModule,
    RouterModule,
    AngularMaterialModule,
    SideBarAdminComponent,
  ],
})
export class SidebarComponent implements OnInit, OnDestroy {
  isSidebarOpen = false;
  private subscription: Subscription = new Subscription();
  cartItm!: number;
  open: boolean = false;
  currentYear: number = new Date().getFullYear();
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
          this.cartItm = 0;
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
      title: 'Voulez-vous vraiment vous deconnecter?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non, annuler',
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
        sessionStorage.clear();
        this.router.navigate(['/login']);
      }
    });
  }

  openModal() {
    this.open = !this.open;
  }

  view() {
    this.router.navigate(['/liste_etudiant']);
    this.open = !this.open;
  }
}
