import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InformationService {

  baseUrl: string = environment.apiUrl;
     API_KEY: string = environment.API_KEY;

     constructor(private http: HttpClient) { }

     getInformations(filters: {status: string }): Observable<any> {
       const headers = new HttpHeaders({
         'Content-Type': 'application/x-www-form-urlencoded; charset=ISO-8859-1',
         'Accept-Charset': 'ISO-8859-1',
         //ss"Authorization": this.API_KEY,
       });

       const body = filters;

       return this.http.post(this.baseUrl, body, { headers });
     }
}
