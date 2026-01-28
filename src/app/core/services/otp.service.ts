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
sendOtpServices(filters: {phone: string; }): Observable<any> {
     const headers = new HttpHeaders({
       'Content-Type': 'application/x-www-form-urlencoded; charset=ISO-8859-1',

       'Accept-Charset': 'ISO-8859-1',
       //ss"Authorization": this.API_KEY,
     });

     const body = filters;

     return this.http.post(`${this.baseUrl}/otp/send`, body, { headers });
   }
   validateOtp(filters: {otp: string; }): Observable<any> {
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

}
