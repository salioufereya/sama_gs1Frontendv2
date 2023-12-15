import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { StudentService } from '../services/student.service';
import { Root, Student } from '../models/Root';

@Component({
  selector: 'app-list-students',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-students.component.html',
  styleUrl: './list-students.component.css',
})
export class ListStudentsComponent implements OnInit {
  ngOnInit(): void {
    if (localStorage.getItem('user')) {
      let user = localStorage.getItem('user');
      this.id_ecole = JSON.parse(user!).ecole_id;
    }
    this.all();
  }
  constructor(private studentService: StudentService) {}
  id_ecole!: number;
  etudiants: Student[] = [];

  all() {
    this.studentService
      .byId<Root<Student>>(this.id_ecole, 'etudiants/ecole')
      .subscribe((student) => {
        this.etudiants = student.data;
        console.log(this.etudiants);
      });
  }
}
