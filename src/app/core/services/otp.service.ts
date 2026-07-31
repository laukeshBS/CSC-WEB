import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class OtpService {
   baseUrl: string = environment.apiUrlOtp;
   API_KEY: string = environment.API_KEY;

   constructor(private http: HttpClient) { }  
sendOtpServices(filters: any): Observable<any> {
     const headers = new HttpHeaders({
       'Content-Type': 'application/x-www-form-urlencoded; charset=ISO-8859-1',

       'Accept-Charset': 'ISO-8859-1',
       //ss"Authorization": this.API_KEY,
     });

     const body = filters;

     return this.http.post(`${this.baseUrl}/otp/send`, body, { headers });
   }
   getCaptcha(): Observable<any> {
     const headers = new HttpHeaders({
       'Content-Type': 'application/x-www-form-urlencoded; charset=ISO-8859-1',

       'Accept-Charset': 'ISO-8859-1',
       //ss"Authorization": this.API_KEY,
     });

   

     return this.http.get(`${this.baseUrl}otp/getCaptcha`, { headers });
   }
   validateOtp(filters:any): Observable<any> {
     const headers = new HttpHeaders({
       'Content-Type': 'application/x-www-form-urlencoded; charset=ISO-8859-1',

       'Accept-Charset': 'ISO-8859-1',
       //ss"Authorization": this.API_KEY,
     });

     const body = filters;

     return this.http.post(`${this.baseUrl}/otp/validate`, body, { headers });
   }
// validateOtp(otp: string): Observable<any> {
//   const body = new HttpParams().set('otp', otp);

//   const headers = new HttpHeaders({
//     'Content-Type': 'application/json',
//      'Accept-Charset': 'ISO-8859-1',
//   });

//   return this.http.post(`${this.baseUrl}/otp/validate`, body.toString(), { headers });
// }
createPassword(username: string,password: string,mobile: string): Observable<any> {
  const body = new HttpParams().set('username', username).set('password', password).set('mobile', mobile);

  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
     'Accept-Charset': 'ISO-8859-1',
  });

  return this.http.post(`${this.baseUrl}/login/createPassword`, body.toString(), { headers });
}
login(username: string,password: string): Observable<any> {
  const body = new HttpParams().set('username', username).set('password', password);

  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
     'Accept-Charset': 'ISO-8859-1',
  });

  return this.http.post(`${this.baseUrl}/login/login`, body.toString(), { headers });
}
forgetPassword(username: string,password: string,oldpassword: string,mobile: string): Observable<any> {
  const body = new HttpParams().set('username', username).set('password', password).set('oldpassword', oldpassword).set('mobile', mobile);

  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
     'Accept-Charset': 'ISO-8859-1',
  });

  return this.http.post(`${this.baseUrl}/login/forgetPassword`, body.toString(), { headers });
}

}
