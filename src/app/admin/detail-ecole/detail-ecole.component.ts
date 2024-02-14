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
  ChekExistGtin,
  Civility,
  Login,
  Root,
  RootLogin,
  Utilisateur,
} from 'src/app/models/Root';
import { EcoleService } from 'src/app/services/ecole.service';
import { LoadingService } from 'src/app/services/loading.service';
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
    this.text=true;
    
  }

  idEcole!: number;
  nomEcole!: string;
  text:boolean = false;


  mode: string = "Ajouter";
  basculerMode(): void {
    this.mode = this.mode === "Ajouter" ? "Modifier" : "Ajouter";
  }
  suggestions$!: Observable<string[]>;
  ngOnInit() {
    this.userService.getIdEcole.subscribe((item) => {
     // sessionStorage.setItem('ecole', '' + item);
      this.idEcole = item;
    });
    this.userService.getnomEcole.subscribe((item) => {
       this.nomEcole = item;
     });
     if( this.localService.getData('nomEcole')){
      this.nomEcole= this.localService.getData('nomEcole');
     }
    if (sessionStorage.getItem('ecole')) {
      this.idEcole = parseInt(sessionStorage.getItem('ecole')!);
    }  
    console.log("idEcole: " + this.idEcole);
    console.log("nomEcole"+this.nomEcole);
    
    // if (this.localService.getDataItem('idEcole')) {
    //   console.log(this.localService.getDataItem('idEcole'));
    //   this.idEcole = this.localService.getDataItem('idEcole')!;
    // }
    this.formValue.get('ecole_id')?.setValue(this.idEcole);
    this.all();
   
    
  }
  constructor(
    private localService: LocalService,
    private fb: FormBuilder,
    private ecoleService: EcoleService,
    private userService: UserService,
    public loader: LoadingService,
    private router: Router,
  ) {}
  modalTrue: boolean = false;
  defaultPdfSrc: string = '';
  private subscription: Subscription = new Subscription();
  titre!: string;
  openModal() {
    this.modalTrue = !this.modalTrue;
    this.addOrUpdate = false;
    this.text=false;
  }
  close() {
    this.formValue.reset();
    this.photo = '';
   
    
    this.modalTrue = !this.modalTrue;
  }
  load:boolean = false;

  clicke(){
    this.userService.setIdEcole(0);
    this.router.navigate(['admin']);
  }

  ajout() {
    this.load=true;
    this.subscription.add(
      this.ecoleService
        .add<RootLogin<Utilisateur>>('users', this.formValue.value)
        .subscribe((ecole: RootLogin<Utilisateur>) => {
          this.load=false
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
  modifie() {
    console.log(this.formValue.value);
    this.load=true;
    this.subscription.add(
      this.ecoleService
        .add<RootLogin<Utilisateur>>('users/modifierUser', this.formValue.value)
        .subscribe((ecole: RootLogin<Utilisateur>) => {
          this.load=false;
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
    { id: 2, libelle: 'Super admin' },
    { id: 3, libelle: 'Responsable pédagogique' },
  ];


  formValue: FormGroup = this.fb.group({
    id: [''],
    ecole_id: ['', [Validators.required]],
    password: [
      '',
      [Validators.required, Validators.minLength(5), Validators.maxLength(50)],
    ],
    nom: ['', [Validators.required]],
    civilite: ['', [Validators.required, Validators.minLength(2)]],
    photo: ['', [Validators.required]],
    adresse: [
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(100)],
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
  loadingData: boolean = false;
  all() {
    this.loadingData = true;
    return this.ecoleService
      .byId<Root<Utilisateur>>(this.idEcole, 'users/usersByEcole')
      .subscribe((data) => {
        this.loadingData=false;
        this.users = data.data;
      });
     
  }

  delete(id: number) {
    Swal.fire({
      title: 'êtes-vous sûrs?',
      text: 'Voulez vous vraiment supprimé cet utilisateur!',
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
  private souscription: Subscription = new Subscription();
  emailExist: boolean = false;
  textverif: string = '';
  emailIsExist(event: Event) {
    let evnt = event.target as HTMLInputElement;
    if (this.formValue.get('email')?.valid) {
      this.souscription.add(
        this.ecoleService
          .isExiste<ChekExistGtin>(
            {
              email: evnt.value,
            },
            'user/checkEmail'
          )
          .subscribe((val: ChekExistGtin) => {
            console.log(val);
            if (val.code == 200) {
              this.emailExist = true;
              this.textverif = val.message;
            } else {
              this.emailExist = false;
            }
          })
      );
    } else {
      this.emailExist = false;
    }
  }
}
