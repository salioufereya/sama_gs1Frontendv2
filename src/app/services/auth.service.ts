import { Injectable, inject } from '@angular/core';
import { RootService } from './root.service';
import { User } from '../models/Root';
import { LoginService } from './login.service';
import { Router } from '@angular/router';
import { LocalService } from './local.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends RootService {
  private logoutService = inject(LoginService);
  private localStore = inject(LocalService);

  private router = inject(Router);

  logout() {
    this.logoutService.logout(1).subscribe((result) => {
      console.log(result);
    });
    this.localStore.removeData('user1');
    this.localStore.removeData('token1');
    this.router.navigate(['/login']);
  }
  isAuthenticated() {
    return this.localStore.getData('token1');
  }
  user!: User;
  public getUser() {
    this.user = this.localStore.decryptObject('user1')!;
    return this.user.role;
  }
}
