import { Injectable } from '@angular/core';
import { RootService } from './root.service';

@Injectable({
  providedIn: 'root',
})
export class StudentService extends RootService {}
