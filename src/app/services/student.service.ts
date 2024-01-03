import { Injectable } from '@angular/core';
import { RootService } from './root.service';
import { Observable } from 'rxjs';
import { GtinByEcole } from '../models/Root';

@Injectable({
  providedIn: 'root',
})
export class StudentService extends RootService {
  verify<T>(data: any): Observable<T> {
    return this.http.post<T>(
      this.url + `/etudiants/ecole/etudiantsByGTIN`,
      data
    );
  }

  isExist<T>(data: GtinByEcole): Observable<T> {
    return this.http.post<T>(
      this.url + `/etudiants/ecole/etudiantsByGTIN`,
      data
    );
  }
}
