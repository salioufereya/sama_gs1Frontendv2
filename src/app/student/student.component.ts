import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { StudentService } from '../services/student.service';
import { NiveauService } from '../niveau.service';
import { Filiere, Niveau, Root, Student } from '../models/Root';
import { CommonModule } from '@angular/common';
import { FiliereService } from '../filiere.service';
import { UserService } from '../services/user.service';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-student',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './student.component.html',
  styleUrl: './student.component.css',
})
export class StudentComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private niveauService: NiveauService,
    private filiereService: FiliereService,
    private userService: UserService
  ) {}
  ngOnInit(): void {
    if (localStorage.getItem('user')) {
      let user = localStorage.getItem('user');
      this.id = JSON.parse(user!).ecole_id;
    }
    this.getFiliere();
    this.getNiveau();
    this.formStudent.get('ecole_id')!.setValue(this.id);
  }
  photo!: any;
  photo_diplome!: any;
  filieres: Filiere[] = [];
  filieres$!: Observable<Filiere[]>;
  niveaux$!: Observable<Niveau[]>;
  niveaux: Niveau[] = [];
  id!: number;
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
    num_gtin: ['', [Validators.required]],
    photo: ['', [Validators.required]],
    photo_diplome: ['', []],
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

  get num_gtin() {
    return this.formStudent.get('num_gtin');
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
    });
  }
  addStudent() {
    console.log(this.formStudent.value);
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
          console.log(student);
        },
        (error: any) => {
          this.handleError(error);
        }
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
}
