import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class TestimonialService {

  baseUrl: string = environment.apiUrl;
  API_KEY: string = environment.API_KEY;

  constructor(private http: HttpClient) { }

  getTestimonials(filters: { testimonials_type: string, status: string }): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      //'Accept-Charset': 'ISO-8859-1',
      'Accept-Charset': 'utf-8',
      //ss"Authorization": this.API_KEY,
    });

    const body = filters;

    return this.http.post(this.baseUrl, body, { headers });
  }
}
