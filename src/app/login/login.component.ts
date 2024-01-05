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
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnDestroy {
  loginForm!: FormGroup;
  private suscription: Subscription = new Subscription();
  constructor(
    private loginService: LoginService,
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private localStore: LocalService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
    });
  }
  ngOnDestroy(): void {
    this.suscription.unsubscribe();
  }
  login() {
    console.log(this.loginForm.value);
    this.suscription.add(
      this.loginService
        .login<RootLogin<LoginData>>(this.loginForm.value)
        .subscribe((x: RootLogin<LoginData>) => {
          if (x.code === 200) {
            this.localStore.saveData('token1', x.data!.token);
            this.localStore.saveDataJson('user1', x.data!.user);
            this.userService.setUser(x.data!.user);
            this.router.navigate(['/verify']);
            console.log(x.data);
          } else {
            console.log(x);
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'email ou mot de passe invalide',
              confirmButtonColor: '#002C6c',
            });
          }
        })
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
}
