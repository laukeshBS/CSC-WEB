import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { StorageService } from '../../../../core/storage.service';
import { CcavenueService } from '../../../../core/services/ccavenue.service';
import { CryptoService } from '../../../../core/services/crypto.service';

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
export class SuccessComponent implements OnInit {

  todayDate = new Date();

  txnid = '';
  mihpayid = '';
  status = '';
  amount = '';
  firstname = '';
  email = '';
  phone = '';
  mode = '';

  loading = false;
  error = '';

  orderId = '';

  constructor(
    private ccavenueService: CcavenueService,
    private storageService: StorageService,
    private cryptoService: CryptoService,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.phone = this.storageService.get('userPhone') || '';
    this.orderId = this.storageService.get('order_id') || 'ORD1785231626021675';

    if (!this.orderId) {
      this.error = 'Order ID not found.';
      return;
    }

    this.getPaymentData();

  }

  getPaymentData(): void {

    this.loading = true;

    const request = {
      order_id: this.orderId,
      token: localStorage.getItem('otpToken') || ''
    };

    console.log('Request =>', request);

    this.ccavenueService
      .getPayment(this.cryptoService.encrypt(request))
      .subscribe({

        next: (res: any) => {

          this.loading = false;

         // console.log('Encrypted Response =>', res);

          const response = this.cryptoService.decrypt(res.data);

         // console.log('Decrypted Response =>', response);
//console.log('Payment Data:', response.status);
          if (!response) {

            this.error = response?.message || 'Payment details not found.';
            return;

          }

          const data = response;
          
          this.txnid = data.order_id ?? '';
          this.mihpayid = data.tracking_id ?? '';
          this.status = data.order_status ?? '';
          this.amount = data.amount ?? '';
          this.firstname = data.billing_name ?? '';
          this.email = data.billing_email ?? '';
          this.phone = data.phone ?? '';
          this.mode = data.payment_mode ?? '';

        },

        error: (err) => {

          this.loading = false;

          console.error('API Error', err);

          console.error('Status :', err.status);
          console.error('Status Text :', err.statusText);
          console.error('URL :', err.url);
          console.error('Message :', err.message);
          console.error('Error Body :', err.error);

          this.error = 'Unable to fetch payment details.';

        }

      });

  }

  printInvoice1(): void {

    window.print();

  }
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