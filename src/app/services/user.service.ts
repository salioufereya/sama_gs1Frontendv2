import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/Root';
import { LocalService } from './local.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private user = new BehaviorSubject<User | null>(null);
  getUser = this.user.asObservable();
  constructor(private localstore: LocalService) {}
  setUser(newUser: User) {
    this.localstore.saveDataJson('user1', newUser);
    this.user.next(newUser);
  }
}
