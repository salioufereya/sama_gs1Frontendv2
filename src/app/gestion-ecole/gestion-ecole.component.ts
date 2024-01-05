import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { validatePhoneNumberSn } from '../shared/numberSn';
import { CommonModule } from '@angular/common';
import { validatephoneNumberFixeSn } from '../shared/numeroBureau';
import { RootLogin, User } from '../models/Root';
import Swal from 'sweetalert2';
import { UserService } from '../services/user.service';
import { EcoleService } from '../services/ecole.service';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { LocalService } from '../services/local.service';

@Component({
  selector: 'app-gestion-ecole',
  standalone: true,
  templateUrl: './gestion-ecole.component.html',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    AngularMaterialModule,
    PdfViewerModule,
    FormsModule,
  ],
  styleUrl: './gestion-ecole.component.css',
})
export class GestionEcoleComponent implements OnInit, OnDestroy {
  [x: string]: any;
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private ecoleService: EcoleService,
    private router: Router,
    private localStore: LocalService
  ) {}
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  formTouched: boolean = false;
  prevusialiser: boolean = false;
  user!: User;
  defaultPdfSrc: string = '';
  private subscription: Subscription = new Subscription();
  ngOnInit() {
    if (this.localStore.getDataJson('user1')) {
      let ue = this.localStore.getDataJson('user1');
      this.user = ue!;
      console.log(this.user);
      this.id_system?.setValue(this.user.ecole.id);
      this.formValue.get('nom')!.patchValue(this.user.ecole.libelle);
      this.formValue.get('adresse')!.patchValue(this.user.ecole.adresse);
      this.formValue.get('email')!.patchValue(this.user.ecole.email);
      this.formValue.get('id_user')!.patchValue(this.user.id);
      this.formValue
        .get('telephone')!
        .patchValue(this.user.ecole.numero_personnel);
      this.formValue
        .get('date_creation')!
        .patchValue(this.user.ecole.date_creation);
      this.telephone_bureau?.setValue(this.user.ecole.numero_bureau);
      this.photo = this.user.ecole.logo;
      this.formValue.get('photo')?.setValue(this.photo);
      this.formValue
        .get('numero_autorisation')
        ?.setValue(this.user.ecole.numero_autorisation);
    }
    this.subscription.add(
      this.formValue.valueChanges.subscribe((val) => {
        this.formTouched = true;
      })
    );
  }
  photo!: any;
  photo_diplome!: any;
  formValue: FormGroup = this.fb.group({
    id_user: ['', Validators.required],
    id_system: ['', [Validators.required]],
    nom: ['', [Validators.required, Validators.minLength(2)]],
    date_creation: ['', [Validators.required]],
    numero_autorisation: ['', Validators.required],
    photo: ['', [Validators.required]],
    adresse: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    telephone: ['', [Validators.required, validatePhoneNumberSn()]],
    telephone_bureau: ['', [Validators.required, validatephoneNumberFixeSn()]],
  });
  get id_system() {
    return this.formValue.get('id_system');
  }
  get date_creation() {
    return this.formValue.get('date_creation');
  }
  get nom() {
    return this.formValue.get('nom');
  }
  get email() {
    return this.formValue.get('email');
  }
  get numero_autorisation() {
    return this.formValue.get('numero_autorisation');
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
      this.existTof = true;
    });
  }
  modify() {
    console.log(this.formValue.value);
    this.subscription.add(
      this.ecoleService
        .update<RootLogin<User>, User>('ecoles/modifier', this.formValue.value)
        .subscribe((ecole: RootLogin<User>) => {
          this.userService.setUser(ecole.data!);
          console.log(ecole);
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: `${ecole.message}`,
            confirmButtonColor: '#002C6c',
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['/verify']);
            }
          });
        })
    );
  }

  existTof: boolean = true;
  pdfSelected: boolean = false;
  deletePhoto() {
    this.photo = '';
    this.existTof = false;
  }
  setPrev() {
    this.prevusialiser = true;
  }
  desactive() {
    this.prevusialiser = false;
  }
  pdfSrc = 'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf';
  handlePdf(event: any) {
    const fileInput = event.target;
    if (fileInput.files && fileInput.files.length > 0) {
      this.pdfSelected = true;
      const selectedFile = fileInput.files[0];
      let fileReader = new FileReader();
      fileReader.onload = (e) => {
        this.pdfSrc = e.target?.result as string;
        console.log(this.pdfSrc);
        this.formValue.get('numero_autorisation')?.setValue(this.pdfSrc);
      };
      fileReader.readAsDataURL(selectedFile);
    } else {
      this.pdfSelected = false;
    }
  }
}
