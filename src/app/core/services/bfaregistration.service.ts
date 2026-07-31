import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BfaregistrationService {


  apiPanUrl: string = environment.apiPanUrl;
  apiSmsUrl: string = environment.apiSmsURL;
    baseUrl: string = environment.apiUrlOtp;
     API_KEY: string = environment.API_KEY;

      constructor(private http: HttpClient) { }

      updatePost(filters: any): Observable<any> {
        const headers = new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded; charset=ISO-8859-1',
          'Accept-Charset': 'ISO-8859-1',
          //ss"Authorization": this.API_KEY,
        });

        const body = filters;

        return this.http.post(this.baseUrl+'bfaInfo/update', body, { headers });
      }
      getData(filters:any): Observable<any> {
        const headers = new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded; charset=ISO-8859-1',
          'Accept-Charset': 'ISO-8859-1',
          //ss"Authorization": this.API_KEY,
        });

        const body = filters;

        return this.http.post(this.baseUrl+'bfaInfo/getData', body, { headers });
      }
       getBankData(filters:any): Observable<any> {
        const headers = new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded; charset=ISO-8859-1',
          'Accept-Charset': 'ISO-8859-1',
          //ss"Authorization": this.API_KEY,
        });

        const body = filters;

        return this.http.post(this.baseUrl+'Bank/validate', body, { headers });
      }
      getBankList(filters:any): Observable<any> {
        const headers = new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded; charset=ISO-8859-1',
          'Accept-Charset': 'ISO-8859-1',
          //ss"Authorization": this.API_KEY,
        });

        const body = filters;     

        return this.http.post(this.baseUrl+'bfaInfo/getBankList', body, { headers });
      }
      getDataPhonePAN(filters:any): Observable<any> {
        const headers = new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded; charset=ISO-8859-1',
          'Accept-Charset': 'ISO-8859-1',
          //ss"Authorization": this.API_KEY,
        });

        const body = filters;

        return this.http.post(this.baseUrl+'bfaInfo/getDataPhonePAN', body, { headers });
      }
      getStates(filters:any): Observable<any> {
        const headers = new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded; charset=ISO-8859-1',
          'Accept-Charset': 'ISO-8859-1',
          //ss"Authorization": this.API_KEY,
        });

        const body = filters;

        return this.http.post(this.baseUrl+'bfaInfo/getStates', body, { headers });
      }
      getDistrict(filters:any): Observable<any> {
        const headers = new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded; charset=ISO-8859-1',
          'Accept-Charset': 'ISO-8859-1',
          //ss"Authorization": this.API_KEY,
        });

        const body = filters;

        return this.http.post(this.baseUrl+'bfaInfo/getDistrict', body, { headers });
      }
      uploadFile(payload: { filename: string; filetype: string; content: string }) {
         const headers = new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded; charset=ISO-8859-1',
          'Accept-Charset': 'ISO-8859-1',
          //ss"Authorization": this.API_KEY,
        });
        return this.http.post(`${this.baseUrl}bfaInfo/upload_file`, payload,{ headers });
      }
      profileStatus(payload:any) {
         const headers = new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded; charset=ISO-8859-1',
          'Accept-Charset': 'ISO-8859-1',
          //ss"Authorization": this.API_KEY,
        });
        return this.http.post(`${this.baseUrl}bfaInfo/profileStatus`, payload,{ headers });
      }
      getWhitelistUser(payload: any) {
         const headers = new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded; charset=ISO-8859-1',
          'Accept-Charset': 'ISO-8859-1',
          //ss"Authorization": this.API_KEY,
        });
        return this.http.post(`${this.baseUrl}bfaInfo/getWhitelistUser`, payload,{ headers });
      }
      gstinStatus(payload:any) {
         const headers = new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded; charset=ISO-8859-1',
          'Accept-Charset': 'ISO-8859-1',
          //ss"Authorization": this.API_KEY,
        });
        return this.http.post(`${this.baseUrl}Gst/validate`, payload,{ headers });
      }
      bankStatus(payload: {account:string; ifsc:string; }) {
         const headers = new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded; charset=ISO-8859-1',
          'Accept-Charset': 'ISO-8859-1',
          //ss"Authorization": this.API_KEY,
        });
        return this.http.post(`${this.baseUrl}bfaInfo/bankStatus`, payload,{ headers });
      }
      generateHashPost(filters: any): Observable<any> {
        const headers = new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded; charset=ISO-8859-1',
          'Accept-Charset': 'ISO-8859-1',
          //ss"Authorization": this.API_KEY,
        });

        const body = filters;

        return this.http.post(this.baseUrl+'bfaInfo/generateHash', body, { headers });
      }
       Ccavenue(filters: any): Observable<any> {
        const headers = new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded; charset=ISO-8859-1',
          'Accept-Charset': 'ISO-8859-1',
          //ss"Authorization": this.API_KEY,
        });

        const body = filters;

        return this.http.post(this.baseUrl+'Ccavenue/pay', body, { headers });
      }
     paymentHistoryPost(filters: any): Observable<any> {
        const headers = new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded; charset=ISO-8859-1',
          'Accept-Charset': 'ISO-8859-1',
          //ss"Authorization": this.API_KEY,
        });

        const body = filters;

        return this.http.post(this.baseUrl+'bfaInfo/payment_history', body, { headers });
      }
      getPaymentSuccessData(): Observable<any> {

        const headers = new HttpHeaders({

          'Content-Type':
            'application/json',

          'Accept':
            'application/json'

        });

        return this.http.get(

          this.baseUrl +
          'bfaInfo/getPaymentSuccessResponse',

          { headers }

        );

      }
      sendSMSBFA(
            mobile: string
        ) {

          return this.http.get(

             this.apiSmsUrl + `index.php/bfa/Service/sendSMSBFA/${mobile}/Location`

          );

        }



}
