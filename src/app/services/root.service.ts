import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { GtinByEcole } from '../models/Root';
@Injectable({
  providedIn: 'root',
})
export class RootService {
  constructor(protected http: HttpClient) {}

  url: string = environment.apiUrl;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }),
  };

  all<T>(next: string): Observable<T> {
    return this.http.get<T>(this.url + `/${next}`);
  }

  add<T>(next: string, data: any): Observable<T> {
    return this.http.post<T>(this.url + `/${next}`, data);
  }
  update<T, U>(next: string, data: U): Observable<T> {
    return this.http.post<T>(this.url + `/${next}`, data);
  }

  byId<T>(id: number, next: string) {
    return this.http.get<T>(this.url + `/${next}/${id})`);
  }
  // delete<T>(next: string, id: any) {
  //   return this.http.delete<T>(this.url + `/${next})`, id);
  // }
  // delete<T>(id: Ids, next: string): Observable<T> {
  //   return this.http.delete<T>(this.url + `/${next}` + '/delete', { body: id });
  // }

  delete<T>(id: number, next: string): Observable<T> {
    return this.http.delete<T>(
      this.url+`/${next}`+`/${id}`,
      this.httpOptions
    );
  }

  sendResetPasswordLink<T>(data: any) {
    return this.http.post<T>(this.url + '/reset_password_request', data);
  }

  resetPassword<T>(data: any) {
    return this.http.post<T>(this.url+'/change_password', data);
  }
  isExiste<T>(data: any,next:string): Observable<T> {
    return this.http.post<T>(
      this.url + `/${next}`,
      data
    );
  }
}
