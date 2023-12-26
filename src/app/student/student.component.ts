import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { StudentService } from '../services/student.service';
import { NiveauService } from '../niveau.service';
import { Civility, Filiere, Niveau, Root, Student } from '../models/Root';
import { CommonModule } from '@angular/common';
import { FiliereService } from '../filiere.service';
import {
  Observable,
  Subscription,
  catchError,
  debounceTime,
  map,
  of,
  switchMap,
  throwError,
} from 'rxjs';
import Swal from 'sweetalert2';
import { SuggestionService } from '../suggestion.service';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-student',
  standalone: true,
  imports: [
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    AngularMaterialModule,
    NgxPaginationModule,
  ],
  templateUrl: './student.component.html',
  styleUrl: './student.component.css',
})
export class StudentComponent implements OnInit, OnDestroy {
  toggleDropdown() {
    throw new Error('Method not implemented.');
  }
  // myControl = new FormControl();
  suggestions$!: Observable<string[]>;
  isDropdownOpen: any;
  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private niveauService: NiveauService,
    private filiereService: FiliereService,
    private suggestionService: SuggestionService
  ) {
    this.suggestions$ = this.departement!.valueChanges.pipe(
      debounceTime(200),
      switchMap((query) => this.suggestionService.getSuggestions(query))
    );
  }
  ngOnDestroy(): void {
    this.souscription.unsubscribe();
  }
  ngOnInit(): void {
    if (localStorage.getItem('user')) {
      let user = localStorage.getItem('user');
      this.id = JSON.parse(user!).ecole_id;
    }
    this.getFiliere();
    this.getNiveau();
    this.formStudent.get('ecole_id')!.setValue(this.id);
  }
  civility: Civility[] = [
    { id: 1, libelle: 'Monsieur' },
    { id: 2, libelle: 'Madame' },
  ];

  add(event: Event) {
    let add = event.target as HTMLInputElement;
    return this.suggestionService
      .getSuggestions(add.value)
      .subscribe((suggestions) => {
        console.log(suggestions);
      });
  }
  photo!: any;
  photo_diplome!: any;
  filieres: Filiere[] = [];
  filieres$!: Observable<Filiere[]>;
  niveaux$!: Observable<Niveau[]>;
  niveaux: Niveau[] = [];
  id!: number;
  private souscription: Subscription = new Subscription();
  getNiveau() {
    this.niveaux$ = this.niveauService
      .byId<Root<Niveau>>(this.id, 'niveaux/ecole')
      .pipe(
        map((response: Root<Niveau>) => response.data),
        catchError((error) => {
          console.error('Error fetching niveau data:', error);
          return of([]);
        })
      );
  }
  formStudent: FormGroup = this.fb.group({
    civilite: ['', [Validators.required, Validators.minLength(2)]],
    nom: ['', [Validators.required, Validators.minLength(2)]],
    prenom: ['', [Validators.required, Validators.minLength(2)]],
    ecole_id: ['', [Validators.required]],
    departement: ['', [Validators.required, Validators.minLength(2)]],
    filiere_id: ['', [Validators.required]],
    niveau_id: ['', [Validators.required]],
    numero_gtin: ['', [Validators.required, Validators.minLength(8)]],
    photo: ['', [Validators.required]],
    matricule: ['', [Validators.required]],
    date_obtention: ['', [Validators.required]],
    photo_diplome: ['', [Validators.required]],
  });

  get civilite() {
    return this.formStudent.get('civilite');
  }

  get nom() {
    return this.formStudent.get('nom');
  }

  get prenom() {
    return this.formStudent.get('prenom');
  }

  get departement() {
    return this.formStudent.get('departement');
  }

  get filiere_id() {
    return this.formStudent.get('filiere_id');
  }

  get niveau_id() {
    return this.formStudent.get('niveau_id');
  }

  get numero_gtin() {
    return this.formStudent.get('numero_gtin');
  }
  get matricule() {
    return this.formStudent.get('matricule');
  }
  get date_obtention() {
    return this.formStudent.get('date_obtention');
  }

  getFiliere() {
    this.filieres$ = this.filiereService
      .byId<Root<Filiere>>(this.id, 'filieres/ecole')
      .pipe(
        map((response: Root<Filiere>) => response.data),
        catchError((error) => {
          console.error('Error fetching filiere data:', error);
          return of([]);
        })
      );
  }

  public file!: File;
  handleFileInput(event: any) {
    this.photo = event.target.files[0];
    let fileReader = new FileReader();
    fileReader.readAsDataURL(this.photo);
    fileReader.addEventListener('load', (e) => {
      this.photo = e.target?.result;
      this.formStudent.get('photo')?.setValue(this.photo);
    });
  }

  handleFileInput1(event: any) {
    this.photo_diplome = event.target.files[0];
    let fileReader = new FileReader();
    fileReader.readAsDataURL(this.photo_diplome);
    fileReader.addEventListener('load', (e) => {
      this.photo_diplome = e.target?.result as string;
      this.formStudent.get('photo_diplome')?.setValue(this.photo_diplome);
      this.exisToff = true;
    });
  }
  addStudent() {
    console.log(this.formStudent.value);
    this.souscription.add(
      this.studentService
        .add<Root<Student>>('etudiants', this.formStudent.value)
        .subscribe(
          (student: Root<Student>) => {
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: `${student.message}`,
            });
            this.formStudent.reset();
            this.photo = '';
            console.log(student);
          },
          (error: any) => {
            this.handleError(error);
          }
        )
    );
  }

  handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.error.message}`;
    }
    console.log(errorMessage);
    return throwError(() => {
      errorMessage;
    });
  }

  exisToff: boolean = true;
  deletePhoto() {
    this.photo = '';
    this.exisToff = false;
  }

  updateForm(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;
    this.formStudent.patchValue({
      departement: inputValue,
    });
  }
  updateFormWithSelectedOption(event: MatAutocompleteSelectedEvent) {
    this.formStudent.patchValue({
      departement: event.option.value,
    });
  }
}
