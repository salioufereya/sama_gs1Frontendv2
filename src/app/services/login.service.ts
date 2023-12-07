import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RootService } from './root.service';
import { Identifiant } from '../models/Data';

@Injectable({
  providedIn: 'root',
})
export class LoginService extends RootService {
  login<T>(value: Identifiant): Observable<T> {
    return this.http.post<T>(this.url + '/users/login', value);
  }
}
