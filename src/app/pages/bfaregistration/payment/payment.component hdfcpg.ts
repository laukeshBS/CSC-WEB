import {
  Component,
  ElementRef,
  ViewChild,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';

import {
  Router
} from '@angular/router';

import {
  BfaregistrationService
} from '../../../core/services/bfaregistration.service';

import {
  StorageService
} from '../../../core/storage.service';

import {
  environment
} from '../../../environments/environment';

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

  @ViewChild('payuForm')
  payuForm!: ElementRef<HTMLFormElement>;

  // =========================================
  // User Details
  // =========================================
  phone: string = '';

  firstname: string = '';

  email: string = '';

  user_id: any = '';

  stepsNumber: any = '';

  // =========================================
  // PayU Config
  // =========================================
  MERCHANT_KEY: string = '7rnFly';

  action: string =
    'https://test.payu.in/_payment';

  // =========================================
  // Payment Details
  // =========================================
  txnid: string = '';

  hash: string = '';

  amount: string = '1499.00';

  orderID: string = '';

  // =========================================
  // Backend URL
  // =========================================
  apiBaseUrl: string =
    environment.apiUrlOtp;

  // =========================================
  // Success & Failure URL
  // =========================================
  surl: string = '';

  furl: string = '';

  // =========================================
  // Loader
  // =========================================
  loading: boolean = false;
paymentUrl: any;
encRequest: any;
accessCode: any;
token: any;

  constructor(
    private bfaregistrationService: BfaregistrationService,
    private storageService: StorageService,
    private router: Router
  ) {}

  // =========================================
  // INIT
  // =========================================
  ngOnInit(): void {

    // =========================================
    // Get Storage Data
    // =========================================
    this.phone =
      this.storageService.get('userPhone') || '';

    this.stepsNumber =
      this.storageService.get('steps') || '';

    this.email =
      this.storageService.get('email') || '';

    this.firstname =
      this.storageService.get('name') || '';

    this.user_id =
      this.storageService.get('user_id') || '';

    // =========================================
    // Fix Undefined Email
    // =========================================
    if (
      !this.email ||
      this.email === 'undefined' ||
      this.email === 'null'
    ) {

      this.email =
        'test@gmail.com';

    }

    // =========================================
    // Fix Undefined Firstname
    // =========================================
    if (
      !this.firstname ||
      this.firstname === 'undefined' ||
      this.firstname === 'null'
    ) {

      this.firstname = 'test';

    }

    // =========================================


    // =========================================
    // Session Validation
    // =========================================
    if (
      !this.phone ||
      !this.stepsNumber
    ) {

      this.router.navigate(['/otp']);

      return;

    }

    // =========================================
    // Generate Transaction ID
    // =========================================
    this.txnid =
      this.generateTxnId();

    // =========================================
    // Generate Order ID
    // =========================================
    this.orderID =
      this.generateOrderId();

    // =========================================
    // Save IDs
    // =========================================
    this.storageService.set(
      'txnid',
      this.txnid
    );

    this.storageService.set(
      'order_id',
      this.orderID
    );

    // =========================================
    // Success URL
    // =========================================
    this.surl =
      `${this.apiBaseUrl}/bfaInfo/paymentSuccess`;

    // =========================================
    // Failure URL
    // =========================================
    this.furl =
      `${this.apiBaseUrl}/bfaInfo/paymentFailure`;



    // =========================================
    // Generate Hash
    // =========================================
    this.generateHash();

  }

  // =========================================
  // Generate PayU Hash
  // =========================================
  generateHash(): void {

    this.loading = true;

    const request = {

      txnid:
        this.txnid,

      amount:
        this.amount,

      productinfo:
        this.orderID,

      firstname:
        this.firstname,

      email:
        this.email,

      phone:
        this.phone

    };


    this.bfaregistrationService
      .generateHashPost(request)
      .subscribe({

        next: (response: any) => {

          console.log(
            'Hash Response =>',
            response
          );

          if (
            response &&
            response.status === true &&
            response.hash
          ) {

            // =========================================
            // Set Hash
            // =========================================
            this.hash =
              response.hash;



            // =========================================
            // Auto Submit PayU Form
            // =========================================
            setTimeout(() => {

              if (
                this.payuForm &&
                this.payuForm.nativeElement
              ) {

                console.log(
                  'Submitting PayU Form...'
                );

                this.payuForm
                  .nativeElement
                  .submit();

              } else {

                this.loading = false;

                console.error(
                  'PayU Form Not Found'
                );

              }

            }, 500);

          } else {

            this.loading = false;

            alert(
              response.message ||
              'Hash generation failed'
            );

          }

        },

        error: (error: any) => {

          this.loading = false;

          console.error(
            'Hash API Error =>',
            error
          );

          alert(
            'Unable to generate hash'
          );

        }

      });

  }

  // =========================================
  // Generate Transaction ID
  // =========================================
  generateTxnId(): string {

    return (
      'TXN' +
      Date.now() +
      Math.floor(
        Math.random() * 100000
      )
    );

  }

  // =========================================
  // Generate Order ID
  // =========================================
  generateOrderId(): string {

    return (
      'ODR' +
      Date.now() +
      Math.floor(
        Math.random() * 100000
      )
    );

  }

}
