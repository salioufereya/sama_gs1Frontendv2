import { Injectable, inject } from '@angular/core';
import { RootService } from './root.service';
import { User } from '../models/Root';
import { LoginService } from './login.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends RootService {
  private logoutService = inject(LoginService);
  private router = inject(Router);

  logout() {
    this.logoutService.logout(1).subscribe((result) => {
      console.log(result);
    });
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
  isAuthenticated() {
    return localStorage.getItem('token');
  }
  user!: User;
  public getUser() {
    this.user = JSON.parse(localStorage.getItem('user')!);
    return this.user.role;
  }
}
