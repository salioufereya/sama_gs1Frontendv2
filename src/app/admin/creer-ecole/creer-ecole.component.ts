import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import {
  Observable,
  Subscribable,
  Subscription,
  debounceTime,
  switchMap,
} from 'rxjs';
import { AngularMaterialModule } from 'src/app/angular-material/angular-material.module';
import { Ecole, Root, RootLogin, User } from 'src/app/models/Root';
import { EcoleService } from 'src/app/services/ecole.service';
import { dateRangeValidator } from 'src/app/shared/dateValidator';
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
export class CreerEcoleComponent implements OnInit {
  modalTrue: boolean = false;
  defaultPdfSrc: string = '';
  private subscription: Subscription = new Subscription();
  constructor(
    private fb: FormBuilder,
    private suggestionService: SuggestionService,
    private ecoleService: EcoleService
  ) {
    this.suggestions$ = this.type_ecole!.valueChanges.pipe(
      debounceTime(200),
      switchMap((query) => this.suggestionService.getTypeEcoles(query))
    );
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
  }
  updateForm1($event: Event) {
    throw new Error('Method not implemented.');
  }
  updateFormWithSelectedOption1($event: MatAutocompleteSelectedEvent) {
    throw new Error('Method not implemented.');
  }
  close() {
    this.modalTrue = !this.modalTrue;
  }
  ajout() {
    console.log(this.formValue.value);
    this.subscription.add(
      this.ecoleService
        .add<RootLogin<Ecole>>('ecoles', this.formValue.value)
        .subscribe((ecole: RootLogin<Ecole>) => {
          console.log(ecole);
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
      [Validators.required, Validators.maxLength(50), Validators.minLength(5)],
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
      console.log(this.ecoles);
    });
  }
}