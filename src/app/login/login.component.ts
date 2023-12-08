import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LoginService } from '../services/login.service';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { LoginData, Root } from '../models/Root';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm!: FormGroup;
  constructor(
    private loginService: LoginService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
    });
  }
  login() {
    console.log(this.loginForm.value);
    return this.loginService
      .login<Root<LoginData>>(this.loginForm.value)
      .subscribe((x: Root<LoginData>) => {
        if (x.code === 200) {
          if (x.data.user.role == 'Responsable pédagogique') {
            this.router.navigate(['/verify']);
          }
          localStorage.setItem('user', JSON.stringify(x.data.user));
        } else {
          console.log(x);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'email ou mot de passe invalide',
          });
        }
      });
  }
  isActive: boolean = true;
  get telephone() {
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
