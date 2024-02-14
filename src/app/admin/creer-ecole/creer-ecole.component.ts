import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Router } from '@angular/router';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import {
  Observable,
  Subscribable,
  Subscription,
  debounceTime,
  switchMap,
} from 'rxjs';
import { AngularMaterialModule } from 'src/app/angular-material/angular-material.module';
import {
  ChekExistGtin,
  Ecole,
  Login,
  Root,
  RootLogin,
} from 'src/app/models/Root';
import { EcoleService } from 'src/app/services/ecole.service';
import { UserService } from 'src/app/services/user.service';
import { validatePhoneNumberSn } from 'src/app/shared/numberSn';
import { validatephoneNumberFixeSn } from 'src/app/shared/numeroBureau';
import { SuggestionService } from 'src/app/suggestion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-creer-ecole',
  standalone: true,
  imports: [
    AngularMaterialModule,
    CommonModule,
    ReactiveFormsModule,
    PdfViewerModule,
  ],
  templateUrl: './creer-ecole.component.html',
  styleUrl: './creer-ecole.component.css',
})
export class CreerEcoleComponent implements OnInit, OnDestroy {
  emailExist: boolean = false;
  open(item: Ecole) {
    console.log(item);
    this.addOrUpdate = true;
    this.photo = item.logo;
    this.formValue.patchValue(item);
    this.telephone_bureau?.setValue(item.numero_bureau);
    this.telephone_personnel?.setValue(item.numero_personnel);
    this.formValue.get('id')?.setValue(item.id);
    this.formValue.get('type_ecole')?.setValue(item.type_ecole);
    this.formValue.get('photo')?.setValue(item.logo);
    this.formValue
      .get('numero_autorisation')
      ?.setValue(item.numero_autorisation);
    this.pdfSelected = true;
    this.modalTrue = true;
    this.text=true;
  }
  modalTrue: boolean = false;
  defaultPdfSrc: string = '';
  private subscription: Subscription = new Subscription();
  constructor(
    private fb: FormBuilder,
    private suggestionService: SuggestionService,
    private ecoleService: EcoleService,
    private router: Router,
    private userService: UserService,

  ) {
    this.suggestions$ = this.type_ecole!.valueChanges.pipe(
      debounceTime(200),
      switchMap((query) => this.suggestionService.getTypeEcoles(query))
    );
  }
  ngOnDestroy(): void {
    this.souscription.unsubscribe();
  }
  ngOnInit(): void {
    this.all();
  }
  suggestions$!: Observable<string[]>;
  suggestionNiveau$!:
    | Promise<undefined>
    | Observable<undefined>
    | Subscribable<undefined>;
  openModal() {
    this.modalTrue = !this.modalTrue;
    this.text=false;
  }
  close() {
    this.modalTrue = !this.modalTrue;
  }
  load:boolean = false;
  ajout() {
    console.log(this.formValue.value);
    this.load=true;
    this.subscription.add(
      this.ecoleService
        .add<RootLogin<Ecole>>('ecoles', this.formValue.value)
        .subscribe((ecole: RootLogin<Ecole>) => {
          console.log(ecole);
          this.load=false;
          if (ecole.code === 200) {
            this.ecoles.unshift(ecole.data!);
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
  text:boolean = false
  modifie() {
    this.load=true;
    this.subscription.add(
      this.ecoleService
        .add<RootLogin<Ecole>>('ecoles/modifierEcole', this.formValue.value)
        .subscribe((ecole: RootLogin<Ecole>) => {
          console.log(ecole);
          this.load=false;
          if (ecole.code === 200) {
            const ecoleModifie = this.ecoles.find(
              (ecole) => ecole.id === this.formValue.value.id
            );
            const index = this.ecoles.indexOf(ecoleModifie!);
            this.ecoles[index] = ecole.data!;
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
  loading:boolean = true;
  photo_diplome: any;
  photo: any;
  handleFileInput1($event: Event) {
    throw new Error('Method not implemented.');
  }
  updateForm(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;
    this.formValue.patchValue({
      type_ecole: inputValue,
    });
  }
  updateFormWithSelectedOption(event: MatAutocompleteSelectedEvent) {
    this.formValue.patchValue({
      type_ecole: event.option.value,
    });
  }
  anneeMinimale = 1900;
  dateMaximale = 4000;
  formValue: FormGroup = this.fb.group({
    id: [''],
    type_ecole: [
      '',
      [Validators.required, Validators.minLength(5), Validators.maxLength(35)],
    ],
    date_creation: ['', [Validators.required]],
    numero_autorisation: ['', Validators.required],
    photo: ['', [Validators.required]],
    adresse: [
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(35)],
    ],

    email: ['', [Validators.required, Validators.email]],
    telephone_personnel: ['', [Validators.required, validatePhoneNumberSn()]],
    libelle: [
      '',
      [Validators.required, Validators.maxLength(50), Validators.minLength(3)],
    ],
    telephone_bureau: ['', [Validators.required, validatephoneNumberFixeSn()]],
  });

  get date_creation() {
    return this.formValue.get('date_creation');
  }

  get libelle() {
    return this.formValue.get('libelle');
  }
  get numero_autorisation() {
    return this.formValue.get('numero_autorisation');
  }
  get telephone_personnel() {
    return this.formValue.get('telephone_personnel');
  }
  get email() {
    return this.formValue.get('email');
  }
  get type_ecole() {
    return this.formValue.get('type_ecole');
  }
  get telephone_bureau() {
    return this.formValue.get('telephone_bureau');
  }
  get adresse() {
    return this.formValue.get('adresse');
  }
  pdfSelected: boolean = false;
  pdfSrc = 'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf';
  prevusialiser: boolean = false;
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
  setPrev() {
    this.prevusialiser = true;
  }
  desactive() {
    this.prevusialiser = false;
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
  ecoles: Ecole[] = [];
  all() {
    return this.ecoleService.all<Root<Ecole>>('ecoles').subscribe((data) => {
      this.ecoles = data.data;
      this.loading = false;
    });
  }
  add(arg0: number,nom: string) {
    this.userService.setIdEcole(arg0);
    this.userService.setNomEcole(nom)
    sessionStorage.setItem('ecole', '' + arg0);
    this.router.navigate(['detail_school']);
  }
  delete(id: number) {
    Swal.fire({
      title: 'êtes-vous sûrs?',
      text: 'Voulez vous vraiment supprimé cet école!',
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
            .delete<RootLogin<Login>>(id, 'ecoles/supprimer')
            .subscribe((resulat) => {
              console.log(resulat);
              if (resulat.code == 200) {
                this.ecoles = this.ecoles.filter(
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
  textverif: string = '';
  emailIsExist(event: Event) {
    let evnt = event.target as HTMLInputElement;
    if (this.formValue.get('email')?.valid) {
      this.souscription.add(
        this.ecoleService
          .isExiste<ChekExistGtin>(
            {
              email: evnt.value
            },
            'ecoles/checkEmail'
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
