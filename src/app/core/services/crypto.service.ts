import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
@Injectable({
  providedIn: 'root'
})

export class CryptoService {

  private key = CryptoJS.enc.Utf8.parse(
    '12345678901234567890123456789012'
  );

  private iv = CryptoJS.enc.Utf8.parse(
    '1234567890123456'
  );

  decrypt(cipherText: string): any {

    const decrypted = CryptoJS.AES.decrypt(
      cipherText,
      this.key,
      {
        iv: this.iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      }
    );

    return JSON.parse(
      decrypted.toString(CryptoJS.enc.Utf8)
    );

  }
  encrypt(data:any){

        const text = JSON.stringify(data);

        const encrypted = CryptoJS.AES.encrypt(
        text,
        this.key,
        {
        iv:this.iv,
        mode:CryptoJS.mode.CBC,
        padding:CryptoJS.pad.Pkcs7
        }
        );

        return encrypted.toString();

    }

}