import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { NavComponent } from './nav/nav.component';
import { EnterEmailComponent } from './recup_password/enter-email/enter-email.component';
import { EnterNewPasswordComponent } from './recup_password/enter-new-password/enter-new-password.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { VerifyComponent } from './verify/verify.component';
import { ChoiceProfilComponent } from './choice-profil/choice-profil.component';
import { HomeComponent } from './home/home.component';
import { StudentComponent } from './student/student.component';
import { ListStudentsComponent } from './list-students/list-students.component';
import { ListDiplomesComponent } from './list-diplomes/list-diplomes.component';
import { GestionProfilComponent } from './gestion-profil/gestion-profil.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'nav', component: NavComponent },
  { path: 'enter_email', component: EnterEmailComponent },
  { path: 'enter_password', component: EnterNewPasswordComponent },
  { path: 'sidebar', component: SidebarComponent },
  { path: 'verify', component: VerifyComponent },
  { path: 'choice_profil', component: ChoiceProfilComponent },
  { path: 'home', component: HomeComponent },
  { path: 'students', component: StudentComponent },
  { path: 'listStudents', component: ListStudentsComponent },
  { path: 'listDiplomes', component: ListDiplomesComponent },
  { path: 'gestion_profil', component: GestionProfilComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
