import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { StudentService } from '../services/student.service';
import {
  Civility,
  Filiere,
  Login,
  Niveau,
  Root,
  RootLogin,
  Student,
} from '../models/Root';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FiltreCoursPipe } from '../shared/pipes/student-filtre.pipe';
import { Observable, catchError, debounceTime, map, of, switchMap } from 'rxjs';
import { NiveauService } from '../niveau.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { initFlowbite } from 'flowbite';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { SuggestionService } from '../suggestion.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { FiliereService } from '../filiere.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-students',
  standalone: true,
  templateUrl: './list-students.component.html',
  styleUrl: './list-students.component.css',
  imports: [
    CommonModule,
    FormsModule,
    FiltreCoursPipe,
    NgxPaginationModule,
    AngularMaterialModule,
    ReactiveFormsModule,
  ],
})
export class ListStudentsComponent implements OnInit {
  id!: number;
  suggestions$!: Observable<string[]>;
  filieres$!: Observable<Filiere[]>;
  photo!: any;
  photo_diplome!: any;
  formTouched: boolean = false;
  ngOnInit() {
    initFlowbite();
    if (localStorage.getItem('user')) {
      let user = localStorage.getItem('user');
      this.id = JSON.parse(user!).ecole_id;
      this.id_ecole = JSON.parse(user!).ecole_id;
    }
    this.getNiveau();
    this.getFiliere();
    this.all();
    this.formStudent.valueChanges.subscribe((val) => {
      console.log(val);
      this.formTouched = true;
    });
  }
  formStudent: FormGroup;
  constructor(
    private studentService: StudentService,
    private niveauService: NiveauService,
    private fb: FormBuilder,
    private suggestionService: SuggestionService,
    private filiereService: FiliereService
  ) {
    this.formStudent = this.fb.group({
      id: ['', [Validators.required]],
      nom: ['', [Validators.required, Validators.minLength(2)]],
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      departement: ['', [Validators.required, Validators.minLength(2)]],
      ecole: ['', [Validators.required, Validators.minLength(2)]],
      civilite: ['', [Validators.required, Validators.minLength(2)]],
      filiere: ['', [Validators.required]],
      niveau: ['', [Validators.required]],
      numero_gtin: ['', [Validators.required, Validators.minLength(8)]],
      date_obtention: ['', [Validators.required]],
      matricule: ['', [Validators.required]],
      photo: ['', [Validators.required]],
      photo_diplome: ['', [Validators.required]],
    });
    this.suggestions$ = this.departement!.valueChanges.pipe(
      debounceTime(200),
      switchMap((query) => this.suggestionService.getSuggestions(query))
    );
  }
  id_ecole!: number;
  etudiants: Student[] = [];
  selected: string = 'Filtrer';

  page: number = 1;
  count: number = 0;
  tableSize: number = 2;
  onTableDataChange(event: any) {
    this.page = event;
    this.all();
  }
  modalTrue: boolean = false;
  all() {
    this.studentService
      .byId<Root<Student>>(this.id_ecole, 'etudiants/ecole')
      .subscribe((student) => {
        this.etudiants = student.data;
        console.log(this.etudiants);
      });
  }
  niveaux$!: Observable<Niveau[]>;
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
  edit(etudiant: Student) {
    this.modalTrue = true;
    this.formStudent.patchValue(etudiant);
    this.formStudent.get('civilite')?.setValue(etudiant.civilite);
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
    this.studentService
      .update<Root<Student>, Student>(
        'etudiants/update',
        this.formStudent.value
      )
      .subscribe((student: Root<Student>) => {
        console.log(student);
        if (student.code == 200) {
          this.formStudent.reset();
          this.close();
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: `${student.message}`,
          });
        }
      });

    console.log(this.formStudent.value);
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
    let fileReader = new FileReader();
    fileReader.readAsDataURL(this.photo);
    fileReader.addEventListener('load', (e) => {
      this.photo_diplome = e.target?.result;
      this.formStudent.get('photo_diplome')?.setValue(this.photo_diplome);
    });
  }

  delete(id: number) {
    Swal.fire({
      title: 'Etes vous surs ?',
      text: 'Voulez vours vraiment supprimé cet étudiant!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#002C6c',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, je veux!',
      cancelButtonText: 'Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        this.studentService
          .delete<RootLogin<Login>>(id, 'etudiants/supprimer')
          .subscribe((resulat) => {
            console.log(resulat);
            if (resulat.code == 200) {
              this.etudiants = this.etudiants.filter(
                (etudiant) => etudiant.id !== id
              );
              Swal.fire({
                title: 'Supprimé!',
                text: `${resulat.message}`,
                icon: 'success',
              });
            }
          });
      }
    });
  }
}
