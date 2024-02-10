import { Component } from '@angular/core';
import { User } from '../models/Root';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { VerifyProductComponent } from "../verify-product/verify-product.component";
import { initFlowbite } from 'flowbite';

@Component({
    selector: 'app-side-bar-product',
    standalone: true,
    templateUrl: './side-bar-product.component.html',
    styleUrl: './side-bar-product.component.css',
    imports: [RouterModule, CommonModule, VerifyProductComponent]
})
export class SideBarProductComponent {
  isSidebarOpen = false;
  constructor(private router: Router) {}
  ngOnDestroy(): void {}
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
  val: boolean = true;
  user!: User;
  role!: string | string[];
  ngOnInit() {
    initFlowbite();
  }
  isZ50 = false;
  toggleZ50() {
    this.isZ50 = !this.isZ50;
  }
}
