import { Component, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LoginService } from '../services/login.service';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { LoginData, RootLogin } from '../models/Root';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service';
import { Subscription } from 'rxjs';
import { LocalService } from '../services/local.service';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    AngularMaterialModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnDestroy {
  loginForm!: FormGroup;
  private suscription: Subscription = new Subscription();
  currentYear: number = new Date().getFullYear();
  constructor(
    private loginService: LoginService,
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private localStore: LocalService,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
    });
  }
  ngOnDestroy(): void {
    this.suscription.unsubscribe();
  }
  load: boolean = false;
  login() {
    console.log(this.loginForm.value);
    this.load = true;
    this.suscription.add(
      this.loginService
        .login<RootLogin<LoginData>>(this.loginForm.value)
        .subscribe((x: RootLogin<LoginData>) => {
          this.load = false;
          console.log(x);
          if (x.code === 200) {
           console.log(x.data);
           sessionStorage.clear();
            this.localStore.saveData('token1', x.data!.token);
            this.localStore.saveDataJson('user1', x.data!.user);
            this.userService.setUser(x.data!.user);
              if (x.data?.user.role == 'Super admin') {
                this.router.navigate(['/admin']);
              } else {
                this.router.navigate(['/verify']);
              }
          } else {
            console.log(x);
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'email ou mot de passe invalide',
              confirmButtonColor: '#002C6c',
            });
          }
        },
        (error) => {
          this.handleError(error);
        }
        )
    );
  }
  isActive: boolean = true;
  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }
  isFieldInvalid(field: string) {
    const control = this.loginForm.get(field);
    return control?.invalid && control?.touched;
  }

  handleError(error: any) {
    console.error('An error occurred:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Une erreur s\'est produite. Veuillez réessayer plus tard.',
      confirmButtonColor: '#002C6c',
    });
  }

}
