import { Component} from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { SideBarProductComponent } from '../side-bar-product/side-bar-product.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ValidateGtin } from '../shared/pipes/validateGtin';

@Component({
  selector: 'app-verify-product',
  standalone: true,
  imports: [SidebarComponent, ReactiveFormsModule,CommonModule],
  templateUrl: './verify-product.component.html',
  styleUrl: './verify-product.component.css',
})
export class VerifyProductComponent {
  constructor(private fb: FormBuilder) {}
  formStudent: FormGroup = this.fb.group({
    numero_gtin: [
      '',
      [Validators.required, Validators.minLength(8),Validators.maxLength(20),ValidateGtin],
    ],
  });
  url!: string;
  get numero_gtin() {
    return this.formStudent.get('numero_gtin');
  }
  redirectToExternalUrl() {
    this.url = `https://www.gs1.org/services/verified-by-gs1/results?gtin=${this.numero_gtin?.value}`;
    window.open(this.url, '_blank');
  }
}
