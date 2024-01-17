import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Student } from '../models/Root';
@Injectable({
  providedIn: 'root',
})
export class ListStudentService {
  private studentAddedSource = new BehaviorSubject<Student | null>(null);
  studentAdded$ = this.studentAddedSource.asObservable();

  addStudent(student?: Student ) {
    console.log(student);
    this.studentAddedSource.next(student!);
  }
}
