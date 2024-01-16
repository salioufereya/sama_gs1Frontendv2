import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';
@Injectable({
  providedIn: 'root',
})
export class hasRoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    let roles = next.data['role'];

    let isAuthorized = roles.some(
      (role: string) => role == this.authService.getUser()
    );

    if (!isAuthorized) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: "Vous n'êtes pas autorisé à consulter cette page",
      });
      return false;
    }

    return true;
  }
}
