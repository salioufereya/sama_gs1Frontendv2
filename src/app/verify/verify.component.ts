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
import { LocalService } from '../services/local.service';
import { initFlowbite } from 'flowbite';
import { AngularMaterialModule } from '../angular-material/angular-material.module';

@Component({
  selector: 'app-verify',
  standalone: true,
  templateUrl: './verify.component.html',
  styleUrl: './verify.component.css',
  imports: [CommonModule, ReactiveFormsModule, IsExistComponent,AngularMaterialModule],
})
export class VerifyComponent implements OnInit, OnDestroy {
  ngOnInit() {
    initFlowbite();
    if (this.localStore.getDataJson('user1')) {
      console.log('userA', this.localStore.getDataJson('user1'));
      let user = this.localStore.getDataJson('user1')!;
      this.id_ecole = user.ecole_id!;
    }
    this.formStudent.get('id_ecole')?.setValue(this.id_ecole);
  }
  isVerification: boolean = true;
  // textInput: string = 'Vérifier le numéro du dipôlme';
  private studentService = inject(StudentService);
  private suscription: Subscription = new Subscription();
  constructor(private fb: FormBuilder, private localStore: LocalService) {}
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
load:boolean = false;
  get numero_gtin() {
    return this.formStudent.get('numero_gtin');
  }
  getSudent() {
    if (!this.isVerification) {
      this.clicked = false;
      this.isVerification = true;
      this.numero_gtin?.reset();
      return;
    }else{
      this.load=true;
    }
    this.suscription.add(
      this.studentService
        .verify<RootLogin<Student>>(this.formStudent.value)
        .subscribe((student) => {
          this.load=false;
          this.clicked = true;
          this.isVerification = false;
          if (student.code == 200) {
            console.log(student);
            this.student = student.data!;
          } else {
            console.log(student);
            this.student = null;
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
    this.isVerification = true;
    this.numero_gtin?.reset();
  }
}
