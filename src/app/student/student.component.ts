import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { StudentService } from '../services/student.service';

@Component({
  selector: 'app-student',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, FormsModule],
  templateUrl: './student.component.html',
  styleUrl: './student.component.css',
})
export class StudentComponent {
  constructor(
    private fb: FormBuilder,
    private studentService: StudentService
  ) {}
  photo!: any;
  photo_diplome!: any;

  formStudent: FormGroup = this.fb.group({
    id_system: ['', [Validators.required, Validators.minLength(2)]],
    civilite: ['', [Validators.required, Validators.minLength(2)]],
    nom: ['', [Validators.required]],
    prenom: ['', [Validators.required]],
    ecole: ['', [Validators.required]],
    departement: ['', [Validators.required]],
    filiere: ['', [Validators.required]],
    niveau_etude: ['', [Validators.required]],
    code: ['', [Validators.required]],
    num_gtin: ['', [Validators.required]],
    photo: ['', [Validators.required]],
    photo_diplome: ['', [Validators.required]],
  });

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
      .add('students', this.formStudent.value)
      .subscribe((student) => {
        console.log(student);
      });
  }
}
