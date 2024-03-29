import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { throwError } from 'rxjs';
import { AngularMaterialModule } from 'src/app/angular-material/angular-material.module';
import { Reset } from 'src/app/models/Root';
import { RootService } from 'src/app/services/root.service';
import { confirmPasswordValidator } from 'src/app/shared/confirm-password.validator';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-enter-new-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule,AngularMaterialModule,RouterModule],
  templateUrl: './enter-new-password.component.html',
  styleUrl: './enter-new-password.component.css',
})
export class EnterNewPasswordComponent {
  newPasswordForm!: FormGroup;
  currentYear: number = new Date().getFullYear();
  errors = null;
  constructor(
    private fb: FormBuilder,
    route: ActivatedRoute,
    private router: Router,
    private resetService: RootService
  ) {
    this.newPasswordForm = this.fb.group(
      {
        password: ['', Validators.required, Validators.minLength(4)],
        password_confirmation: ['', Validators.required],
        token: ['', Validators.required],
      },
      { validators: confirmPasswordValidator }
    );
    route.queryParams.subscribe((params) => {
      this.newPasswordForm.get('token')?.setValue(params['token']);
    });
  }

  // newPassword() {
  //   this.resetService
  //     .resetPassword<Reset>(this.newPasswordForm.value)
  //     .subscribe(
  //       (data: Reset) => {
  //         console.log(data);
  //         Swal.fire({
  //           icon: 'success',
  //           title: 'Success',
  //           text: `${data.message}`,
  //           confirmButtonColor: '#002C6c',
  //         }).then((result) => {
  //           if (result.isConfirmed) {
  //             this.router.navigate(['/login']);
  //           }
  //         });
  //         this.newPasswordForm.reset();
  //       },
  //       (err) => {
  //         this.handleError(err);
  //       }
  //     );
  // }
  newPassword() {
    this.load = true;
    this.resetService.resetPassword<Reset>(this.newPasswordForm.value)
      .subscribe(
        (data: Reset) => {
          this.load=false;
          console.log(data);
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: `${data.message}`,
            confirmButtonColor: '#002C6c',
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['/']);
            }
          });
          this.newPasswordForm.reset();
        },
        (err) => {
          this.handleError(err);
        }
      );
  }

  load: boolean = false;
  handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(() => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
        confirmButtonColor: '#002C6c',
      });
    });
  }
  // handleError(error: any) {
  //   console.error('An error occurred:', error);
  //   console.log(error);
  //   Swal.fire({
  //     icon: 'error',
  //     title: 'Error',
  //     text: 'Une erreur s\'est produite ,Veillez réessayez ',
  //     confirmButtonColor: '#002C6c',
  //   });
  // }
  get password() {
    return this.newPasswordForm.get('password');
  }
  get password_confirmation() {
    return this.newPasswordForm.get('password_confirmation');
  }
}
