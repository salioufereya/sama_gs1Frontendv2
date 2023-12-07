import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { NavComponent } from './nav/nav.component';
import { EnterEmailComponent } from './recup_password/enter-email/enter-email.component';
import { EnterNewPasswordComponent } from './recup_password/enter-new-password/enter-new-password.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { VerifyComponent } from './verify/verify.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'nav', component: NavComponent },
  { path: 'enter_email', component: EnterEmailComponent },
  { path: 'enter_password', component: EnterNewPasswordComponent },
  { path: 'sidebar', component: SidebarComponent },
  { path: 'verify', component: VerifyComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
