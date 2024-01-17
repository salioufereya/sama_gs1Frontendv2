import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { User } from '../models/Root';
import { LoginService } from './login.service';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class LocalService {
  constructor(private loginService: LoginService, private router: Router) {}
  key = '"((-"-(@-èèé("""" +Gs1_';
  public saveData(key: string, value: string) {
    sessionStorage.setItem(key, this.encrypt(value));
  }

  public getData(key: string) {
    let data = sessionStorage.getItem(key) || '';
    return this.decrypt(data);
  }

  public getDataItem(key: string) {
    let data = sessionStorage.getItem(key) || '';
    return this.decryptItem(data);
  }
  public removeData(key: string) {
    sessionStorage.removeItem(key);
  }

  public clearData() {
    sessionStorage.clear();
  }

  private encrypt(txt: string): string {
    return CryptoJS.AES.encrypt(txt, this.key).toString();
  }

  private decrypt(txtToDecrypt: string) {
    return CryptoJS.AES.decrypt(txtToDecrypt, this.key).toString(
      CryptoJS.enc.Utf8
    );
  }

  public saveDataJson(key: string, value: User) {
    sessionStorage.setItem(key, this.encryptObject(value));
  }

  public saveItem(key: string, value: number) {
    sessionStorage.setItem(key, this.encryptItem(value));
  }
  public getDataJson(key: string) {
    let data = sessionStorage.getItem(key) || '';
    return this.decryptObject(data);
  }
  public getItem(key: string) {
    let data = sessionStorage.getItem(key) || '';
    return this.decryptItem(data);
  }

  public encryptObject(obj: User): string {
    const jsonString = JSON.stringify(obj);
    return this.encrypt(jsonString);
  }

  public encryptItem(obj: number): string {
    const jsonString = JSON.stringify(obj);
    return this.encrypt(jsonString);
  }
  public decryptObject(txtToDecrypt: string): User | null {
    try {
      const decryptedText = this.decrypt(txtToDecrypt);
      const jsonObject = JSON.parse(decryptedText);
      return jsonObject;
    } catch (error) {
      console.error('Error decrypting and parsing object:', error);
      //this.loginService.logout();
      sessionStorage.clear();
      this.router.navigate(['/login']);
      return null;
    }
  }
  public decryptItem(txtToDecrypt: string): number | null {
    try {
      const decryptedText = this.decrypt(txtToDecrypt);
      //const jsonObject = JSON.parse(decryptedText);
      return +decryptedText;
    } catch (error) {
      console.error('Error decrypting and parsing object:', error);
      //this.loginService.logout();
      sessionStorage.clear();
      this.router.navigate(['/login']);
      return null;
    }
  }
}
