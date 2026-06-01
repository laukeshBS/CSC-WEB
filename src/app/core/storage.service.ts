import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root' // ✅ THIS FIXES YOUR ERROR
})
export class StorageService {

  private key = 'secret123';

  set(key: string, value: any): void {
  const stringValue = JSON.stringify(value); // ✅ convert any → string
  const encrypted = CryptoJS.AES.encrypt(stringValue, this.key).toString();
  localStorage.setItem(key, encrypted);
}

get<T = any>(key: string): T | null {
  const data = localStorage.getItem(key);
  if (!data) return null;

  try {
    const decrypted = CryptoJS.AES.decrypt(data, this.key).toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted); // ✅ convert back to original type
  } catch (e) {
    return null;
  }
}

  clear(p0: string) {
    localStorage.clear();
  }
}
