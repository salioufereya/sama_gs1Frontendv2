import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { Observable, Subscription } from 'rxjs';
import { AngularMaterialModule } from 'src/app/angular-material/angular-material.module';
import {
  Civility,
  Login,
  Root,
  RootLogin,
  Utilisateur,
} from 'src/app/models/Root';
import { EcoleService } from 'src/app/services/ecole.service';
import { LocalService } from 'src/app/services/local.service';
import { UserService } from 'src/app/services/user.service';
import { validatePhoneNumberSn } from 'src/app/shared/numberSn';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detail-ecole',
  standalone: true,
  imports: [
    AngularMaterialModule,
    ReactiveFormsModule,
    CommonModule,
    PdfViewerModule,
  ],
  templateUrl: './detail-ecole.component.html',
  styleUrl: './detail-ecole.component.css',
})
export class DetailEcoleComponent implements OnInit {
  open(item: Utilisateur) {
    this.formValue.patchValue(item);
    this.formValue.get('role_id')!.patchValue(item.role);
    this.photo = item.photo;
    this.formValue.get('id')?.patchValue(item.id);
    this.addOrUpdate = true;
    this.modalTrue = true;
  }

  idEcole!: number;

  
  suggestions$!: Observable<string[]>;
  ngOnInit() {
    this.userService.getIdEcole.subscribe((item) => {
      this.idEcole = item;
    });
    if (this.localService.getDataItem('idEcole')) {
      console.log(this.localService.getDataItem('idEcole'));
      this.idEcole = this.localService.getDataItem('idEcole')!;
    }
    this.formValue.get('ecole_id')?.setValue(this.idEcole);
    this.all();
  }
  constructor(
    private localService: LocalService,
    private fb: FormBuilder,
    private ecoleService: EcoleService,
    private router: Router,
    private userService: UserService,
    
  ) {}
  modalTrue: boolean = false;
  defaultPdfSrc: string = '';
  private subscription: Subscription = new Subscription();
  titre!: string;
  openModal() {

    this.modalTrue = !this.modalTrue;
    this.addOrUpdate = false;
  }
  close() {
    this.formValue.reset();
    this.photo = '';
    this.modalTrue = !this.modalTrue;
  }

  ajout() {
    console.log(this.formValue.value);
    this.subscription.add(
      this.ecoleService
        .add<RootLogin<Utilisateur>>('users', this.formValue.value)
        .subscribe((ecole: RootLogin<Utilisateur>) => {
          console.log(ecole);
          if (ecole.code === 200) {
            this.users.unshift(ecole.data!);
            this.formValue.reset();
            this.modalTrue = !this.modalTrue;
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: `${ecole.message}`,
              confirmButtonColor: '#002C6c',
            });
          }
        })
    );
  }

  // modifie() {
  //   console.log(this.formValue.value);
  //   this.subscription.add(
  //     this.ecoleService
  //       .add<RootLogin<Utilisateur>>('users/modifierUser', this.formValue.value)
  //       .subscribe((ecole: RootLogin<Utilisateur>) => {
  //         console.log(ecole);
  //         if (ecole.code === 200) {
  //           this.formValue.reset();
  //           this.modalTrue = !this.modalTrue;
  //           Swal.fire({
  //             icon: 'success',
  //             title: 'Success',
  //             text: `${ecole.message}`,
  //             confirmButtonColor: '#002C6c',
  //           });
  //         }
  //       })
  //   );
  // }
  modifie() {
    console.log(this.formValue.value);
    this.subscription.add(
      this.ecoleService
        .add<RootLogin<Utilisateur>>('users/modifierUser', this.formValue.value)
        .subscribe((ecole: RootLogin<Utilisateur>) => {
          console.log(ecole);
          if (ecole.code === 200) {
            const utilisateurModifie = this.users.find(
              (user) => user.id === this.formValue.value.id
            );
            const index = this.users.indexOf(utilisateurModifie!);
            this.users[index] = ecole.data!;
            this.formValue.reset();
            this.modalTrue = !this.modalTrue;
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: `${ecole.message}`,
              confirmButtonColor: '#002C6c',
            });
          }
        })
    );
  }

  addOrUpdate: boolean = false;
  click() {
    if (this.addOrUpdate) {
      return this.modifie();
    } else {
      return this.ajout();
    }
  }

  users: Utilisateur[] = [];
  photo: any;
  anneeMinimale = 1900;
  dateMaximale = 4000;
  civility: Civility[] = [
    { id: 1, libelle: 'Monsieur' },
    { id: 2, libelle: 'Madame' },
  ];
  role: Civility[] = [
    { id: 1, libelle: 'Admin' },
    { id: 2, libelle: 'Responsable pédagogique' },
  ];

  formValue: FormGroup = this.fb.group({
    id: [''],
    ecole_id: ['', [Validators.required]],
    password: [
      '',
      [Validators.required, Validators.minLength(5), Validators.maxLength(35)],
    ],
    nom: ['', [Validators.required]],
    civilite: ['', [Validators.required, Validators.minLength(2)]],
    photo: ['', [Validators.required]],
    adresse: [
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(35)],
    ],

    email: ['', [Validators.required, Validators.email]],
    telephone: ['', [Validators.required, validatePhoneNumberSn()]],
    prenom: [
      '',
      [Validators.required, Validators.maxLength(50), Validators.minLength(3)],
    ],
    role_id: ['', [Validators.required]],
  });

  get nom() {
    return this.formValue.get('nom');
  }

  get prenom() {
    return this.formValue.get('prenom');
  }
  get numero_autorisation() {
    return this.formValue.get('numero_autorisation');
  }
  get telephone() {
    return this.formValue.get('telephone');
  }
  get email() {
    return this.formValue.get('email');
  }
  get password() {
    return this.formValue.get('password');
  }
  get role_id() {
    return this.formValue.get('role_id');
  }
  get adresse() {
    return this.formValue.get('adresse');
  }
  get civilite() {
    return this.formValue.get('civilite');
  }

  handleFileInput(event: any) {
    this.photo = event.target.files[0];
    let fileReader = new FileReader();
    fileReader.readAsDataURL(this.photo);
    fileReader.addEventListener('load', (e) => {
      this.photo = e.target?.result;
      this.formValue.get('photo')?.setValue(this.photo);
    });
  }
  all() {
    return this.ecoleService
      .byId<Root<Utilisateur>>(this.idEcole, 'users/usersByEcole')
      .subscribe((data) => {
        this.users = data.data;
        console.log(data);
      });
  }

  delete(id: number) {
    Swal.fire({
      title: 'êtes-vous sûrs?',
      text: 'Voulez vous vraiment supprimé cet étudiant!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#002C6c',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Supprimer',
      cancelButtonText: 'Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        this.subscription.add(
          this.ecoleService
            .delete<RootLogin<Login>>(id, 'users/supprimer')
            .subscribe((resulat) => {
              console.log(resulat);
              if (resulat.code == 200) {
                this.users = this.users.filter(
                  (etudiant) => etudiant.id !== id
                );
                this.modalTrue = false;
                Swal.fire({
                  title: 'Supprimé!',
                  text: `${resulat.message}`,
                  icon: 'success',
                  confirmButtonColor: '#002C6c',
                });
              } else {
                Swal.fire({
                  icon: 'success',
                  title: 'Success',
                  text: `${resulat.message}`,
                  confirmButtonColor: '#002C6c',
                });
              }
            })
        );
      }
    });
  }
}
