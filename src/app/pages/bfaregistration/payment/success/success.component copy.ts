import {
  Component,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';

import {
  StorageService
} from '../../../../core/storage.service';

import {
  BfaregistrationService
} from '../../../../core/services/bfaregistration.service';

@Component({
  selector: 'app-success',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.css']
})
export class SuccessComponent
  implements OnInit { txnid: string = '';
      todayDate: Date = new Date();


  mihpayid: string = '';

  status: string = '';

  amount: string = '';

  firstname: string = '';

  email: string = '';

  phone: string = '';

  mode: string = '';
payment: any;
error: any;
loading: any;

  constructor(
    private bfaregistrationService:
      BfaregistrationService
  ) {}

  ngOnInit(): void {

    this.getPaymentData();

  }

  // =========================================
  // Get Payment Data
  // =========================================
  getPaymentData(): void {

    this.bfaregistrationService
      .getPaymentSuccessData()
      .subscribe({

        next: (response: any) => {

          console.log(
            'Payment Success Response =>',
            response
          );

          if (
            response &&
            response.status === true
          ) {

            const data =
              response.data;

            this.txnid =
              data.txnid || '';

            this.mihpayid =
              data.mihpayid || '';

            this.status =
              data.status || '';

            this.amount =
              data.amount || '';

            this.firstname =
              data.firstname || '';

            this.email =
              data.email || '';

            this.phone =
              data.phone || '';

            this.mode =
              data.mode || '';

          }

        },

        error: (error: any) => {

          console.error(
            'Payment Data Error =>',
            error
          );

        }

      });

  }
// =====================================
// Print Invoice
// =====================================
printInvoice(): void {

  const printContents =
    document.getElementById(
      'print-section'
    )?.innerHTML;

  const popupWindow =
    window.open(
      '',
      '_blank',
      'width=900,height=700'
    );

  if (
    popupWindow &&
    printContents
  ) {

    popupWindow.document.open();

    popupWindow.document.write(`

      <html>

        <head>

          <title>
            Payment Receipt
          </title>

          <style>

            body {

              font-family: Arial, sans-serif;

              padding: 20px;

            }

            .invoice-box {

              border: 1px solid #ddd;

              padding: 20px;

              border-radius: 10px;

            }

            .row {

              display: flex;

              flex-wrap: wrap;

            }

            .col-md-6 {

              width: 50%;

              margin-bottom: 15px;

            }

            img {

              max-height: 70px;

            }

            h4 {

              margin: 0;

            }

          </style>

        </head>

        <body onload="window.print();window.close()">

          <div class="invoice-box">

            ${printContents}

          </div>

        </body>

      </html>

    `);

    popupWindow.document.close();

  }

}
}
