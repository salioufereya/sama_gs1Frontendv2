import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Student } from 'src/app/models/Root';

@Component({
  selector: 'app-is-exist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './is-exist.component.html',
  styleUrl: './is-exist.component.css',
})
export class IsExistComponent {
  @Input() message: string = '';
  @Input() student!: Student | null;
  @Output() closed = new EventEmitter<boolean>();
  viewDiplome: boolean = false;

  close() {
    this.closed.emit(false);
  }
  setView() {
    console.log('setView');
    this.viewDiplome = !this.viewDiplome;
  }
}
