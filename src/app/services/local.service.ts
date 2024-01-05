import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { User } from '../models/Root';
@Injectable({
  providedIn: 'root',
})
export class LocalService {
  key = '"((-"-(@-èèé("""" +Gs1_';
  public saveData(key: string, value: string) {
    sessionStorage.setItem(key, this.encrypt(value));
  }

  public getData(key: string) {
    let data = sessionStorage.getItem(key) || '';
    return this.decrypt(data);
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

  public getDataJson(key: string) {
    let data = sessionStorage.getItem(key) || '';
    return this.decryptObject(data);
  }

  public encryptObject(obj: User): string {
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
      return null;
    }
  }
}
