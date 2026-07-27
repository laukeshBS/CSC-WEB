import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface PaymentRequest {
  amount: number;
  billing_name: string;
  billing_email: string;
  billing_tel: string;
  billing_address?: string;
  billing_city?: string;
  billing_state?: string;
  billing_zip?: string;
  billing_country?: string;
  currency?: string;
  pan?: string;
  order_id?: string;
}

export interface PaymentResponse {
  status: boolean;
  message?: string;
  payment_url?: string;
  encRequest?: string;
  access_code?: string;
  order_id?: string;
}

export interface PaymentSuccessResponse {
  status: boolean;
  data?: {
    order_id: string;
    order_status: string;
    tracking_id: string;
    bank_ref_no: string;
    amount: string;
    currency: string;
    payment_mode: string;
    card_name: string;
    failure_message?: string;
    raw: Record<string, any>;
  };
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiBase = environment.ccavenueApiBase;

  constructor(private http: HttpClient) {}

  /**
   * Create payment request (generates encRequest)
   */
  createPaymentRequest(paymentData: PaymentRequest): Observable<PaymentResponse> {
    return this.http.post<PaymentResponse>(`${this.apiBase}/pay`, paymentData);
  }

  /**
   * Get payment success response from session
   */
  getPaymentSuccessResponse(): Observable<PaymentSuccessResponse> {
    return this.http.get<PaymentSuccessResponse>(
      `${this.apiBase}/getPaymentSuccessResponse`
    );
  }

  /**
   * Test API connection
   */
  testConnection(): Observable<any> {
    return this.http.get(`${this.apiBase}/index`);
  }
}
