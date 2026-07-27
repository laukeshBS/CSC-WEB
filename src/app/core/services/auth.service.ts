import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { filter, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
 baseUrl: string = environment.apiUrlLogin;
   API_KEY: string = environment.API_KEY;

   constructor(private http: HttpClient) { }
  createPassword(filter: any): Observable<any> {
    const body = filter;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
       'Accept-Charset': 'ISO-8859-1',
    });

    return this.http.post(`${this.baseUrl}/login/createPassword`, body, { headers });
  }
  login(filter: any): Observable<any> {
    const body = filter;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
       'Accept-Charset': 'ISO-8859-1',
    });

    return this.http.post(`${this.baseUrl}/login`, body, { headers });
  }
  forgotPassword(filter: any): Observable<any> {
    const body = filter;


    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
       'Accept-Charset': 'ISO-8859-1',
    });

    return this.http.post(`${this.baseUrl}/forgotPassword`, body, { headers });
  }
}
