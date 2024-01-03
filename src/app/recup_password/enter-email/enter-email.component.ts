import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Reset } from 'src/app/models/Root';
import { RootService } from 'src/app/services/root.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-enter-email',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './enter-email.component.html',
  styleUrl: './enter-email.component.css',
})
export class EnterEmailComponent {
  resetForm: FormGroup;
  errors!: string;
  successMsg!: string;
  constructor(private fb: FormBuilder, private authService: RootService) {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }
  ngOnInit(): void {}
  onSubmit() {
    this.authService
      .sendResetPasswordLink<Reset>(this.resetForm.value)
      .subscribe(
        (result: Reset) => {
          this.successMsg = result.message;
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: `${result.message}`,
            confirmButtonColor: '#002C6c',
          });
          this.resetForm.reset();
        },
        (error) => {
          this.errors = error.error.message;
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `${error.error.message}`,
          });
        }
      );
  }
  get email() {
    return this.resetForm.get('email');
  }
}
