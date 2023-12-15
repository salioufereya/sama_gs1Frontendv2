import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { validatePhoneNumberSn } from '../shared/numberSn';
import { CommonModule } from '@angular/common';
import { validatephoneNumberFixeSn } from '../shared/numeroBureau';
import { ProfilService } from '../services/profil.service';
import { Root, RootLogin, User } from '../models/Root';
import Swal from 'sweetalert2';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-gestion-profil',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './gestion-profil.component.html',
  styleUrl: './gestion-profil.component.css',
})
export class GestionProfilComponent implements OnInit {
  [x: string]: any;
  constructor(
    private fb: FormBuilder,
    private profileService: ProfilService,
    private userService: UserService
  ) {}
  formTouched: boolean = false;
  user!: User;
  ngOnInit() {
    if (localStorage.getItem('user')) {
      let ue = localStorage.getItem('user');
      this.user = JSON.parse(ue!);
      console.log(this.user);
      this.id_system?.setValue(this.user.id);
      this.formValue.patchValue(this.user);
      this.photo = this.user.photo;
    }
    console.log(
      'Valeur du champ civilite après patchValue :',
      this.formValue.get('civilite')?.value
    );
    this.formValue.valueChanges.subscribe((val) => {
      console.log(val);
      this.formTouched = true;
    });
  }
  photo!: any;
  photo_diplome!: any;
  formValue: FormGroup = this.fb.group({
    id_system: ['', [Validators.required]],
    civilite: ['', [Validators.required, Validators.minLength(2)]],
    nom: ['', [Validators.required, Validators.minLength(2)]],
    prenom: ['', [Validators.required, Validators.minLength(2)]],
    ecole: ['', [Validators.required, Validators.minLength(2)]],
    role: ['', [Validators.required, Validators.minLength(2)]],
    photo: ['', [Validators.required]],
    adresse: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    telephone: ['', [Validators.required, validatePhoneNumberSn()]],
    telephone_bureau: ['', [Validators.required, validatephoneNumberFixeSn()]],
  });
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
    });
  }
  modify() {
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
      });
  }
}
