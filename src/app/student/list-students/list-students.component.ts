import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { StudentService } from '../../services/student.service';
import {
  ChekExistGtin,
  Civility,
  Filiere,
  Login,
  Niveau,
  Root,
  RootLogin,
  Student,
} from '../../models/Root';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FiltreStudentPipe } from '../../shared/pipes/student-filtre.pipe';
import {
  Observable,
  Subscription,
  catchError,
  debounceTime,
  map,
  of,
  switchMap,
} from 'rxjs';
import { NiveauService } from '../../niveau.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { initFlowbite } from 'flowbite';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { SuggestionService } from '../../suggestion.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { FiliereService } from '../../filiere.service';
import Swal from 'sweetalert2';
import { LoadingService } from '../../services/loading.service';
import { FilterEtudiantPipe } from '../../shared/pipes/filter-etudiant.pipe';
import { MatSelectChange } from '@angular/material/select';
import { ListStudentService } from 'src/app/services/list-student.service';
import { LocalService } from 'src/app/services/local.service';
import { dateRangeValidator } from 'src/app/shared/dateValidator';
import { ValidateString } from 'src/app/shared/pipes/validateString';
import { ValidateGtin } from 'src/app/shared/pipes/validateGtin';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-list-students',
  standalone: true,
  templateUrl: './list-students.component.html',
  styleUrl: './list-students.component.css',
  imports: [
    CommonModule,
    FormsModule,
    FiltreStudentPipe,
    NgxPaginationModule,
    AngularMaterialModule,
    ReactiveFormsModule,
    FilterEtudiantPipe,
  ],
})
export class ListStudentsComponent implements OnInit, OnDestroy {
  setView() {
    this.previewdiplome = !this.previewdiplome;
  }
  id!: number;
  role!: string;
  suggestions$!: Observable<string[]>;
  filieres$!: Observable<Filiere[]>;
  photo!: any;
  photo_diplome!: any;
  formTouched: boolean = false;
  selectedFilterField: string = 'libelle';
  searchTerm: string = '';
  private subscription: Subscription = new Subscription();
  suggestionFilieres$!: Observable<string[]>;
  suggestionNiveau$!: Observable<string[]>;
  previewdiplome: boolean = false;

  ngOnInit() {
    initFlowbite();
    if (this.localStore.getDataJson('user1')) {
      let user = this.localStore.getDataJson('user1');
      this.id = user?.ecole_id!;
      this.id_ecole = user?.ecole_id!;
      this.role = user!.role;
    }
    this.studentListService.studentAdded$.subscribe((student) => {
      if (student) {
        this.etudiants.unshift(student);
      }
      console.log('studentAdded', student);
    });
    this.getNiveau();
    this.getFiliere();
    this.all();
    this.formStudent.valueChanges.subscribe((val) => {
      this.formTouched = true;
    });
    this.checkScroll();
  }
  anneeMinimale = 2000;
  dateMaximale = new Date();
  formStudent: FormGroup;
  constructor(
    private studentService: StudentService,
    private niveauService: NiveauService,
    private fb: FormBuilder,
    private suggestionService: SuggestionService,
    private filiereService: FiliereService,
    public loader: LoadingService,
    private studentListService: ListStudentService,
    private localStore: LocalService,
    private userService: UserService
  ) {
    this.formStudent = this.fb.group({
      id: ['', [Validators.required]],
      nom: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
          ValidateString,
        ],
      ],
      prenom: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
          ValidateString,
        ],
      ],
      departement: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
          ValidateString,
        ],
      ],
      ecole: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
          ValidateString,
        ],
      ],
      civilite: ['', [Validators.required, Validators.minLength(2)]],
      filiere: [
        '',
        [Validators.required, ValidateString, Validators.maxLength(50)],
      ],
      niveau: [
        '',
        [Validators.required, ValidateString, Validators.maxLength(50)],
      ],
      numero_gtin: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
          ValidateGtin,
        ],
      ],
      date_obtention: [
        '',
        [
          Validators.required,
          dateRangeValidator(this.anneeMinimale, this.dateMaximale),
        ],
      ],
      matricule: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(10),
          ValidateString,
        ],
      ],
      photo: ['', [Validators.required]],
      photo_diplome: ['', [Validators.required]],
    });
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
    this.subscription.unsubscribe();
  }
  id_ecole!: number;
  etudiants: Student[] = [];
  selected: string = 'Filtrer';

  page: number = 1;
  count: number = 0;
  tableSize: number = 7;
  detail: boolean = false;
  onTableDataChange(event: any) {
    this.page = event;
    this.all();
  }
  modalTrue: boolean = false;
  all() {
    this.subscription.add(
      this.studentService
        .byId<Root<Student>>(this.id_ecole, 'etudiants/ecole')
        .subscribe((student) => {
          this.etudiants = student.data;
          this.etudiants.sort((a, b) => {
            if (a.etat === 'enAttente' && b.etat !== 'enAttente') {
              return -1;
            } else if (a.etat !== 'enAttente' && b.etat === 'enAttente') {
              return 1;
            } else {
              return 0;
            }
          });
          console.log(this.etudiants);
        })
    );
  }

  niveaux$!: Observable<Niveau[]>;
  getNiveau() {
    this.niveaux$ = this.niveauService.all<Root<Niveau>>('niveaux').pipe(
      map((response: Root<Niveau>) => response.data),
      catchError((error) => {
        console.error('Error fetching niveau data:', error);
        return of([]);
      })
    );
  }
  edit(etudiant: Student) {
    console.log(etudiant);
    this.modalTrue = true;
    this.formStudent.patchValue(etudiant);
    this.formStudent.get('civilite')?.setValue(etudiant.civilite);
    this.formStudent.get('filiere')?.setValue(etudiant.filiere);
    this.formStudent.get('niveau')?.setValue(etudiant.niveau);
    this.formStudent.get('filiere')?.setValue(etudiant.filiere);
    this.photo = etudiant.photo;
    this.formStudent.get('id')?.setValue(etudiant.id);
    this.photo_diplome = etudiant.photo_diplome;
  }
  close() {
    this.modalTrue = false;
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
  get ecole() {
    return this.formStudent.get('ecole');
  }
  get civilite() {
    return this.formStudent.get('civilite');
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
  get date_obtention() {
    return this.formStudent.get('date_obtention');
  }
  get matricule() {
    return this.formStudent.get('matricule');
  }
  civility: Civility[] = [
    { id: 1, libelle: 'Monsieur' },
    { id: 2, libelle: 'Madame' },
  ];

  updateFormWithSelectedOption(event: MatAutocompleteSelectedEvent) {
    this.formStudent.patchValue({
      departement: event.option.value,
    });
  }
  updateForm(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;
    this.formStudent.patchValue({
      departement: inputValue,
    });
  }
  modify() {
    console.log(this.formStudent.value);
    this.subscription.add(
      this.studentService
        .update<RootLogin<Student>, Student>(
          'etudiants/update',
          this.formStudent.value
        )
        .subscribe((student: RootLogin<Student>) => {
          console.log(student);
          if (student.code == 200) {
            this.formStudent.reset();
            const index = this.etudiants.findIndex(
              (item) => item.id === student.data!.id
            );
            if (index !== -1) {
              this.etudiants[index] = student.data!;
            }
          }
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: `${student.message}`,
            confirmButtonColor: '#002C6c',
          });
          this.close();
        })
    );
  }
  item!: number;
  loadValid: boolean=false;
  isScrollable: boolean = false;
  valider(student: Student) {
    this.loadValid = true;
    this.subscription.add(
      this.studentService
        .update<RootLogin<Student>, Student>('etudiants/valider', student)
        .subscribe((student: RootLogin<Student>) => {
          console.log(student);
          this.loadValid=false;
          if (student.code == 200) {
            this.userService.getItemNumer.subscribe((etu) => {
              this.item = etu;
            });
            this.userService.setItemNumber(this.item - 1);
            this.formStudent.reset();
            const index = this.etudiants.findIndex(
              (item) => item.id === student.data!.id
            );
            if (index !== -1) {
              this.etudiants[index] = student.data!;
            }
            this.detailEtudiant.etat = 'valide';
            this.detail = false;
          }
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: `${student.message}`,
            confirmButtonColor: '#002C6c',
          });
          this.close();
        })
    );
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
    let fileReader1 = new FileReader();
    fileReader1.readAsDataURL(this.photo_diplome);
    fileReader1.addEventListener('load', (e) => {
      this.photo_diplome = e.target?.result;
      this.formStudent.get('photo_diplome')?.setValue(this.photo_diplome);
    });
  }
  cartItm: number = 0;

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
          this.studentService
            .delete<RootLogin<Login>>(id, 'etudiants/supprimer')
            .subscribe((resulat) => {
              console.log(resulat);
              if (resulat.code == 200) {
                this.etudiants = this.etudiants.filter(
                  (etudiant) => etudiant.id !== id
                );
                this.userService.getItemNumer.subscribe((etu) => {
                  this.item = etu;
                });
                this.userService.setItemNumber(
                  this.item > 0 ? this.item - 1 : 0
                );
                this.detail = false;
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
  detailEtudiant!: Student;
  SeenDetail(etudiant: Student) {
    this.detailEtudiant = etudiant;
    this.detail = true;
    console.log(etudiant);
  }
  resetdetail() {
    this.detail = false;
  }

  loading$ = this.loader.loading$;
  filter: boolean = false;
  onFilterFieldChange(event: MatSelectChange): void {
    this.selectedFilterField = event.value;
    this.filter = true;
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
  etudiantExist: boolean = false;
  EtudiantIsExist(event: Event) {
    let evnt = event.target as HTMLInputElement;
    if (evnt.value.length >= 8) {
      this.subscription.add(
        this.studentService
          .isExist<ChekExistGtin>({
            id_ecole: this.id_ecole,
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
  checkScroll() {
    this.isScrollable = document.body.clientHeight > window.innerHeight;
  }
}
