import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class CcavenueService {

  apiPanUrl: string = environment.apiPanUrl;
  apiSmsUrl: string = environment.apiSmsURL;
 // baseUrl: string =///'http://localhost/ayurved/api/';
   baseUrl: string =environment.apiUrlOtp;
  API_KEY: string = environment.API_KEY;

  constructor(private http: HttpClient) {}

  /**
   * Generate Payment
   */
     Ccavenue(filters: any): Observable<any> {
          const headers = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded; charset=ISO-8859-1',
            'Accept-Charset': 'ISO-8859-1',
            //ss"Authorization": this.API_KEY,
          });

          const body = filters;

          return this.http.post(this.baseUrl+'Ccavenue/pay', body, { headers });
        }

  /**
   * Get Success Response
   */

  getPaymentResponse(filters: any): Observable<any> {
          const headers = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded; charset=ISO-8859-1',
            'Accept-Charset': 'ISO-8859-1',
            //ss"Authorization": this.API_KEY,
          });

          const body = filters;

          return this.http.post(this.baseUrl+'Ccavenue/response', body, { headers });
  }
  getPayment(orderId: any): Observable<any> {
          const headers = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded; charset=ISO-8859-1',
            'Accept-Charset': 'ISO-8859-1',
            //ss"Authorization": this.API_KEY,
          });

          const body = orderId;

          return this.http.post(this.baseUrl+'ccavenue/getPaymentSuccessResponse', body, { headers });
  }

getPayment1(orderId: string): Observable<any> {

  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  });

  const params = new HttpParams()
    .set('order_id', orderId);
  return this.http.get<any>(
    this.baseUrl + 'ccavenue/getPaymentSuccessResponse',
    {
      headers,
      params
    }
  );

}
}
