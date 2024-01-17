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
import { CreerEcoleComponent } from './admin/creer-ecole/creer-ecole.component';
import { VerifyProductComponent } from './verify-product/verify-product.component';
import { SideBarProductComponent } from './side-bar-product/side-bar-product.component';
import { SideBarAdminComponent } from './admin/side-bar-admin/side-bar-admin.component';
import { ChoiceProfilDiplomeComponent } from './choice-profil-diplome/choice-profil-diplome.component';
import { hasRoleGuard } from './guards/has-role.guard';
import { DetailEcoleComponent } from './admin/detail-ecole/detail-ecole.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'enter_email', component: EnterEmailComponent },
  { path: 'enter_password', component: EnterNewPasswordComponent },
  { path: 'sidebar', component: SidebarComponent, canActivate: [AuthGuard] },
  { path: 'verify', component: VerifyComponent, canActivate: [AuthGuard] },
  { path: 'choice_profil', component: ChoiceProfilComponent },
  { path: 'choice_profil_diplome', component: ChoiceProfilDiplomeComponent },
  { path: 'creer_ecole', component: CreerEcoleComponent },
  { path: 'home', component: HomeComponent },
  { path: 'verify_product', component: SideBarProductComponent },
  { path: 'students', component: StudentComponent, canActivate: [AuthGuard] },
  { path: 'detail_school', component: DetailEcoleComponent, canActivate: [AuthGuard] },

  {
    path: 'admin',
    component: CreerEcoleComponent,
    canActivate: [AuthGuard, hasRoleGuard],
    data: {
      role: ['Super admin'],
    },
  },
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
