import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
//import { NavComponent } from './nav/nav.component';
import { EnterEmailComponent } from './recup_password/enter-email/enter-email.component';
import { EnterNewPasswordComponent } from './recup_password/enter-new-password/enter-new-password.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { VerifyComponent } from './verify/verify.component';
import { ChoiceProfilComponent } from './choice-profil/choice-profil.component';
import { HomeComponent } from './home/home.component';
import { StudentComponent } from './student/student.component';
//import { ListStudentsComponent } from './list-students/list-students.component';
import { ListStudentsComponent } from './student/list-students/list-students.component';
import { GestionProfilComponent } from './gestion-profil/gestion-profil.component';
import { GestionEcoleComponent } from './gestion-ecole/gestion-ecole.component';
import { AuthGuard } from './guards/auth-guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'enter_email', component: EnterEmailComponent },
  { path: 'enter_password', component: EnterNewPasswordComponent },
  { path: 'sidebar', component: SidebarComponent, canActivate: [AuthGuard] },
  { path: 'verify', component: VerifyComponent, canActivate: [AuthGuard] },
  { path: 'choice_profil', component: ChoiceProfilComponent },
  { path: 'home', component: HomeComponent },
  { path: 'students', component: StudentComponent, canActivate: [AuthGuard] },
  {
    path: 'listStudents',
    component: ListStudentsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'gestion_profil',
    component: GestionProfilComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'gestion_ecole',
    component: GestionEcoleComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
