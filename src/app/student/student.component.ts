import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { StudentService } from '../services/student.service';
import { NiveauService } from '../niveau.service';
import {
  ChekExistGtin,
  Civility,
  Filiere,
  Niveau,
  Root,
  RootLogin,
  Student,
} from '../models/Root';
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
import { dateRangeValidator } from '../shared/dateValidator';
import { ListStudentsComponent } from './list-students/list-students.component';
import { ListStudentService } from '../services/list-student.service';
import { ValidateString } from '../shared/pipes/validateString';
import { LocalService } from '../services/local.service';
import { ValidateGtin } from '../shared/pipes/validateGtin';
import { UserService } from '../services/user.service';

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
  id_ecole!: number;
  setView() {
    this.previewdiplome = !this.previewdiplome;
    // console.log("test view");
  }
  previewdiplome: boolean = false;
  toggleDropdown() {
    throw new Error('Method not implemented.');
  }
  suggestions$!: Observable<string[]>;
  previ: boolean = false;
  suggestionFilieres$!: Observable<string[]>;

  suggestionNiveau$!: Observable<string[]>;

  @ViewChild(ListStudentsComponent) list!: ListStudentsComponent;

  isDropdownOpen: any;
  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private niveauService: NiveauService,
    private filiereService: FiliereService,
    private suggestionService: SuggestionService,
    private userService: UserService,
    private router: Router,
    private studentListService: ListStudentService,
    private localStore: LocalService
  ) {
    this.suggestions$ = this.departement!.valueChanges.pipe(
      debounceTime(200),
      switchMap((query) => this.suggestionService.getSuggestions(query))
    );
    this.suggestionFilieres$ = this.filiere!.valueChanges.pipe(
      debounceTime(200),
      switchMap((query) => this.suggestionService.getFilieres(query))
    );
    this.suggestionNiveau$ = this.niveau!.valueChanges.pipe(
      debounceTime(200),
      switchMap((query) => this.suggestionService.getNiveau(query))
    );
  }
  ngOnDestroy(): void {
    this.souscription.unsubscribe();
  }
  ecole!: string;
  ngOnInit(): void {
    if (this.localStore.getDataJson('user1')) {
      let user = this.localStore.getDataJson('user1');
      this.id = user?.ecole_id!;
      this.id_ecole = user?.ecole_id!;
      this.role = this.formStudent.get('role_user')!.setValue(user?.role)!;
      this.ecole = user?.ecole.libelle!;
    }

    this.getFiliere();
    this.getNiveau();
    this.formStudent.get('ecole_id')!.setValue(this.id);
    this.all();
  }
  civility: Civility[] = [
    { id: 1, libelle: 'Monsieur' },
    { id: 2, libelle: 'Madame' },
  ];
  anneeMinimale = 2000;
  dateMaximale = new Date();
  add(event: Event) {
    let add = event.target as HTMLInputElement;
    this.souscription.add(
      this.suggestionService
        .getSuggestions(add.value)
        .subscribe((suggestions) => {
          console.log(suggestions);
        })
    );
  }
  photo!: any;
  photo_diplome!: any;
  filieres: Filiere[] = [];
  filieres$!: Observable<Filiere[]>;
  niveaux$!: Observable<Niveau[]>;
  niveaux: Niveau[] = [];
  id!: number;
  role!: string;
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
    role_user: ['', Validators.required],
    nom: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
        ValidateString,
        Validators.maxLength(30),
      ],
    ],
    prenom: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
        ValidateString,
        Validators.maxLength(30),
      ],
    ],
    ecole_id: ['', [Validators.required]],
    departement: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
        ValidateString,
        Validators.maxLength(30),
      ],
    ],
    filiere: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
        ValidateString,
        Validators.maxLength(20),
      ],
    ],
    niveau: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
        ValidateString,
        Validators.maxLength(20),
      ],
    ],
    numero_gtin: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        ValidateGtin,
        Validators.maxLength(20),
      ],
    ],
    photo: ['', [Validators.required]],
    matricule: [
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(10)],
    ],
    date_obtention: [
      '',
      [
        Validators.required,
        dateRangeValidator(this.anneeMinimale, this.dateMaximale),
      ],
    ],
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

  get filiere() {
    return this.formStudent.get('filiere');
  }

  get niveau() {
    return this.formStudent.get('niveau');
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
      this.previ = true;
    });
  }
  cartItm!: number;
  all() {
    this.souscription.add(
      this.studentService
        .byId<Root<Student>>(this.id_ecole, 'etudiants/ecole')
        .subscribe((student) => {
          console.log(student);
          this.cartItm = 0;
          student.data.forEach((element) => {
            if (element.etat == 'enAttente') {
              this.cartItm = this.cartItm + 1;
            }
          });
          this.userService.setItemNumber(this.cartItm);
        })
    );
  }
  addStudent() {
    console.log(this.formStudent.value);
    this.souscription.add(
      this.studentService
        .add<RootLogin<Student>>('etudiants', this.formStudent.value)
        .subscribe(
          (student: RootLogin<Student>) => {
            // this.list.etudiants.unshift(...student.data);
            this.studentListService.addStudent(student.data);
            console.log('stu', student.data);
            this.router.navigate(['/listStudents']);
            
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: `${student.message}`,
              confirmButtonColor: '#002C6c',
            });
            this.formStudent.reset();
            this.photo = '';
            this.photo_diplome = '';
            console.log(student);
          },
          (error: any) => {
            this.handleError(error);
          }
        )
    );
  }

  // private etudiantExistValidator(): AsyncValidatorFn {
  //   return (control: AbstractControl): Observable<ValidationErrors | null> => {
  //     const value = control.value;

  //     if (!value) {
  //       return of(null);
  //     }

  //     return this.studentService
  //       .isExist<ChekExistGtin>({
  //         id_ecole: this.formStudent.get('ecole_id')?.value,
  //         numero_gtin: value,
  //       })
  //       .pipe(
  //         map((val: ChekExistGtin) => {
  //           console.log('Backend response:', val);

  //           if (val.code === 200) {
  //             return { etudiantExist: true };
  //           } else {
  //             return null;
  //           }
  //         }),
  //         catchError((error) => {
  //           console.error('Backend error:', error);
  //           return of(null);
  //         })
  //       );
  //   };
  // }

  EtudiantIsExist(event: Event) {
    let evnt = event.target as HTMLInputElement;
    if (evnt.value.length >= 8) {
      this.souscription.add(
        this.studentService
          .isExist<ChekExistGtin>({
            id_ecole: this.formStudent.get('ecole_id')?.value,
            numero_gtin: evnt.value,
          })
          .subscribe((val: ChekExistGtin) => {
            console.log(val);
            if (val.code == 200) {
              this.etudiantExist = true;
            } else {
              this.etudiantExist = false;
            }
          })
      );
    } else {
      this.etudiantExist = false;
    }
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
  etudiantExist: boolean = false;
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

  updateForm1(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;
    this.formStudent.patchValue({
      filiere: inputValue,
    });
  }
  updateFormWithSelectedOption1(event: MatAutocompleteSelectedEvent) {
    this.formStudent.patchValue({
      filiere: event.option.value,
    });
  }

  updateForm2(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;
    this.formStudent.patchValue({
      niveau: inputValue,
    });
  }
  updateFormWithSelectedOption2(event: MatAutocompleteSelectedEvent) {
    this.formStudent.patchValue({
      niveau: event.option.value,
    });
  }
  reset() {
    this.formStudent.reset();
  }
}
