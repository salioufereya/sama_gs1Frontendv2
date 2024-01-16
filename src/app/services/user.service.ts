import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/Root';
import { LocalService } from './local.service';

@Injectable({
  providedIn: 'root',
})
export class UserService implements OnInit {
  constructor(private localstore: LocalService) {}
  ecole!: string;
  ngOnInit() {
    if (this.localstore.getDataJson('user1')) {
      let user = this.localstore.getDataJson('user1');
      this.ecole = user?.ecole.libelle!;
      console.log('ecole on', this.ecole);
    }
    console.log('testeDiallo servive');
  }
  private user = new BehaviorSubject<User | null>(null);
  private itemNumber = new BehaviorSubject<number>(0);
  private idEcole = new BehaviorSubject<number>(0);
  getUser = this.user.asObservable();
  getItemNumer = this.itemNumber.asObservable();
  getIdEcole = this.idEcole.asObservable();

  setUser(newUser: User) {
    this.localstore.saveDataJson('user1', newUser);
    this.user.next(newUser);
  }
  setItemNumber(newItemNumber: number) {
    this.itemNumber.next(newItemNumber);
  }
  setIdEcole(idEcole: number) {
    this.localstore.saveData('idEcole', idEcole.toString());
    this.idEcole.next(idEcole);
  }
}
