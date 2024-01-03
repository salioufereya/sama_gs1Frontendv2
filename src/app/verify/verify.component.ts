import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { StudentService } from '../services/student.service';
import { RootLogin, Student } from '../models/Root';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IsExistComponent } from './is-exist/is-exist.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-verify',
  standalone: true,
  templateUrl: './verify.component.html',
  styleUrl: './verify.component.css',
  imports: [CommonModule, ReactiveFormsModule, IsExistComponent],
})
export class VerifyComponent implements OnInit, OnDestroy {
  ngOnInit() {
    if (localStorage.getItem('user')) {
      let user = localStorage.getItem('user');
      this.id_ecole = JSON.parse(user!).ecole_id;
    }
    this.formStudent.get('id_ecole')?.setValue(this.id_ecole);
  }
  isVerification: boolean = true;
  textInput: string = 'Vérifier le numéro du dipôlme';
  private studentService = inject(StudentService);
  private suscription: Subscription = new Subscription();
  constructor(private fb: FormBuilder) {}
  ngOnDestroy(): void {
    this.suscription.unsubscribe();
  }
  id_ecole!: number;
  student!: Student | null;
  num_gtin!: string;
  clicked: boolean = false;
  getSaisi(event: Event) {
    let evnt = event.target as HTMLInputElement;
    this.num_gtin = evnt.value;
    console.log(this.num_gtin);
  }

  formStudent: FormGroup = this.fb.group({
    id_ecole: ['', Validators.required],
    numero_gtin: [
      '',
      [Validators.required, Validators.minLength(8), Validators.maxLength(13)],
    ],
  });

  get numero_gtin() {
    return this.formStudent.get('numero_gtin');
  }
  getSudent() {
    this.suscription.add(
      this.studentService
        .verify<RootLogin<Student>>(this.formStudent.value)
        .subscribe((student) => {
          this.clicked = true;
          this.isVerification = false;
          if (student.code == 200) {
            console.log(student);
            this.student = student.data!;
          } else {
            console.log(student);
            this.student = null;
            this.numero_gtin?.reset();
          }
        })
    );
  }

  canVerif: boolean = false;
  check(event: Event) {
    let evnt = event.target as HTMLInputElement;
    this.canVerif = evnt.checked;
  }

  enlever(clicked: boolean) {
    this.clicked = clicked;
  }
}
