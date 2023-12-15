import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/Root';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private user = new BehaviorSubject<User | null>(null);
  getUser = this.user.asObservable();
  setUser(newUser: User) {
    localStorage.setItem('user', JSON.stringify(newUser));
    this.user.next(newUser);
  }
}
