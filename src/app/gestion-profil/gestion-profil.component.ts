import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { validatePhoneNumberSn } from '../shared/numberSn';
import { CommonModule } from '@angular/common';
//import { validatephoneNumberFixeSn } from '../shared/numeroBureau';
import { ProfilService } from '../services/profil.service';
import { Civility, RootLogin, User } from '../models/Root';
import Swal from 'sweetalert2';
import { UserService } from '../services/user.service';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { Subscription } from 'rxjs';
import { LocalService } from '../services/local.service';

@Component({
  selector: 'app-gestion-profil',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, AngularMaterialModule],
  templateUrl: './gestion-profil.component.html',
  styleUrl: './gestion-profil.component.css',
})
export class GestionProfilComponent implements OnInit, OnDestroy {
  [x: string]: any;
  constructor(
    private fb: FormBuilder,
    private profileService: ProfilService,
    private userService: UserService,
    private localStore: LocalService
  ) {}
  private subscription: Subscription = new Subscription();

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  formTouched: boolean = false;
  user!: User;

  ngOnInit() {
    if (this.localStore.getDataJson('user1')) {
      let ue = this.localStore.getDataJson('user1');
      this.user = ue!;
      this.id_system?.setValue(this.user.id);
      this.formValue.patchValue(this.user);
      this.photo = this.user.photo;
      this.formValue.get('civilite')?.patchValue(this.user.civilite);
    }
    this.subscription.add(
      this.formValue.valueChanges.subscribe((val) => {
        console.log(val);
        this.formTouched = true;
      })
    );
  }
  photo!: any;
  photo_diplome!: any;
  formValue: FormGroup = this.fb.group({
    id_system: ['', [Validators.required]],
    civilite: ['', [Validators.required, Validators.minLength(2)]],
    nom: ['', [Validators.required, Validators.minLength(2)]],
    prenom: ['', [Validators.required, Validators.minLength(2)]],
    photo: ['', [Validators.required]],
    adresse: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    telephone: ['', [Validators.required, validatePhoneNumberSn()]],
  });
  civility: Civility[] = [
    { id: 1, libelle: 'Monsieur' },
    { id: 2, libelle: 'Madame' },
  ];
  get id_system() {
    return this.formValue.get('id_system');
  }
  get prenom() {
    return this.formValue.get('prenom');
  }
  get nom() {
    return this.formValue.get('nom');
  }
  get email() {
    return this.formValue.get('email');
  }
  get civilite() {
    return this.formValue.get('civilite');
  }
  get ecole() {
    return this.formValue.get('ecole');
  }
  get role() {
    return this.formValue.get('role');
  }
  get telephone() {
    return this.formValue.get('telephone');
  }
  get telephone_bureau() {
    return this.formValue.get('telephone_bureau');
  }
  get adresse() {
    return this.formValue.get('adresse');
  }
  public file!: File;
  handleFileInput(event: any) {
    this.photo = event.target.files[0];
    let fileReader = new FileReader();
    fileReader.readAsDataURL(this.photo);
    fileReader.addEventListener('load', (e) => {
      this.photo = e.target?.result;
      this.formValue.get('photo')?.setValue(this.photo);
      this.exisToff = true;
    });
  }
  modify() {
    console.log(this.formValue.value);
    this.subscription.add(
      this.profileService
        .update<RootLogin<User>, User>('users/modifier', this.formValue.value)
        .subscribe((student: RootLogin<User>) => {
          this.formValue.patchValue(student.data!);
          this.userService.setUser(student.data!);
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: `${student.message}`,
          });
        })
    );
  }

  exisToff: boolean = true;
  deletePhoto() {
    this.photo = '';
    this.exisToff = false;
  }
}
