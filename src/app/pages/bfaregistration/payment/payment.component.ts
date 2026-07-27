import {
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';

import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';

import { Router } from '@angular/router';

import { StorageService } from '../../../core/storage.service';
import { CcavenueService } from '../../../core/services/ccavenue.service';
import { CryptoService } from '../../../core/services/crypto.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  @ViewChild('ccavenueForm')
  ccavenueForm!: ElementRef<HTMLFormElement>;

  // Payment Gateway
  paymentUrl = '';
  encRequest = '';
  accessCode = '';

  // User Details
  token = localStorage.getItem('otpToken') || '';

  phone = '';
  firstname = '';
  email = '';
  userId = '';

  completeAddress = '';
  districtName = '';
  stateName = '';
  pincode = '';

  // Registration
  stepsNumber = '';

  // Payment
  readonly amount = '1499.00';
  orderId = '';

  loading = false;

  constructor(
    private ccavenueService: CcavenueService,
    private storageService: StorageService,
    private cryptoService: CryptoService,
    private router: Router
  ) {}

  // =====================================================
  // Initialize
  // =====================================================
  ngOnInit(): void {

    this.loadUserData();

    if (!this.phone || !this.stepsNumber) {
      this.router.navigate(['/otp']);
      return;
    }

    this.orderId = this.generateOrderId();

    this.storageService.set('order_id', this.orderId);

    this.initiatePayment();

  }

  // =====================================================
  // Load User Details
  // =====================================================
  private loadUserData(): void {

    this.phone = this.storageService.get('userPhone') || '';
    this.firstname = this.storageService.get('name') || '';
    this.email = this.storageService.get('email') || '';
    this.userId = this.storageService.get('user_id') || '';

    this.completeAddress =
      this.storageService.get('complete_address') || '';

    this.districtName =
      this.storageService.get('district_name') || '';

    this.stateName =
      this.storageService.get('state_name') || '';

    this.pincode =
      this.storageService.get('pincode') || '';

    this.stepsNumber =
      this.storageService.get('steps') || '';

  }

  // =====================================================
  // Initiate Payment
  // =====================================================
  private initiatePayment(): void {

    this.loading = true;

    const request = {

      order_id: this.orderId,

      //token: this.token,

      amount: this.amount,
      currency: 'INR',

      billing_name: this.firstname,
      billing_email: this.email,
      billing_tel: this.phone,

      billing_address: this.completeAddress,
      billing_city: this.districtName,
      billing_state: this.stateName,
      billing_zip: this.pincode,
      billing_country: 'India'

    };

    console.log('Payment Request', request);

    // Enable encryption if required
     const payload = this.cryptoService.encrypt(request);
console.log('Payment Request encrypt', payload);
    this.ccavenueService
      .Ccavenue(payload)
      .subscribe({

        next: (response: any) => {
console.log('Payment response encrypt', response);
          this.loading = false;

          //console.log('Payment Response', response);

          // Enable if API returns encrypted response
         const result = this.cryptoService.decrypt(response);

         // const result = response;

          if (!result?.status) {

            alert(result?.message || 'Unable to initiate payment.');

            return;

          }

          this.paymentUrl = result.payment_url;
          this.encRequest = result.encRequest;
          this.accessCode = result.access_code;
            this.orderId = result.order_id;
          this.storageService.set('order_id', this.orderId);
         // console.log('Payment URL', this.paymentUrl);
        //  console.log('Access Code', this.accessCode);

          setTimeout(() => {

            if (this.ccavenueForm) {
              this.ccavenueForm.nativeElement.submit();
            }

          }, 100);

        },

        error: (error: any) => {

          this.loading = false;

          console.error('Payment Error', error);

          alert(
            error?.error?.message ||
            'Unable to connect to the payment gateway.'
          );

        }

      });

  }

  // =====================================================
  // Generate Order ID
  // =====================================================
  private generateOrderId(): string {

    return (
      'ORD' +
      Date.now() +
      Math.floor(Math.random() * 100000)
    );

  }

  // =====================================================
  // Generate Transaction ID
  // =====================================================
  private generateTransactionId(): string {

    return (
      'TXN' +
      Date.now() +
      Math.floor(Math.random() * 100000)
    );

  }

}