import { Injectable } from '@angular/core';
import { RootService } from './root.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StudentService extends RootService {

  verify<T>(data: any): Observable<T> {
    return this.http.post<T>(this.url + `/etudiants/ecole/etudiantsByGTIN`, data);
  }

}
