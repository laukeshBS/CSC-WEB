import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OtpService } from '../../core/services/otp.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../core/storage.service';

@Component({
  selector: 'app-otp',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './otp.component.html',
  styleUrl: './otp.component.css'
})
export class OtpComponent implements OnInit {
  phone = '';
  otpSent = false;
  otpExpired = false;
  timer = 180;
  timerInterval: any;
  message = '';
  error = '';
  loading = false;
  otpSendCount = 0; // ✅ Track how many times OTP was sent

  otpBoxes = Array(6).fill(0);
  otpDigits: string[] = ['', '', '', '', '', ''];
  mobile: string | null | undefined;

  constructor(private storageService : StorageService ,private otpService: OtpService, private router: Router) {}
  ngOnInit(): void {

         this.storageService.clear('userPhone');
  }

  /** Step 1: Send OTP (max 3 times) */
  sendOtp() {
   // alert(this.otpSendCount);
    if (this.otpSendCount >= 3) {
      this.message = 'You have reached the maximum OTP limit (3 times).';
      this.error = 'error';
      return;
    }

    if (!this.phone || this.phone.trim() === '') {
      this.message = 'Phone number is required.';
      this.error = 'error';
      return;
    }
   if (this.phone) {
     this.phone = this.phone.replace(/^\+?91\s?/, '').replace(/\D/g, '');

// Keep only the last 10 digits (safety)
 this.phone =  this.phone.slice(-10);

    }
    if (!/^[0-9]{10}$/.test(this.phone)) {
      this.message = 'Enter a valid 10-digit phone number.';
      this.error = 'error';
      return;
    }
    this.loading = true;
    const filters = { phone: this.phone };

    this.otpService.sendOtpServices(filters).subscribe({
      next: (res) => {
        this.loading = false;
         this.storageService.clear('userPhone');
         this.storageService.set('userPhone', this.phone);
         this.message=res.message;
        if (res.steps) {

           //this.storageService.clear('steps');
           //this.storageService.clear('status');

        this.router.navigate(['/bfaregistration']);
          return;
        }
        if (res.status) {
          this.otpSendCount++;
          this.message = `OTP sent successfully! (Attempt ${this.otpSendCount}/3)`;
          this.error = '';
          this.otpSent = true;
          this.startTimer();
        } else {
          this.message = res.message || 'Failed to send OTP.';
          this.error = 'error';
        }

      },
      error: () => {
        this.loading = false;
        this.error = 'error';
        this.message = this.message || 'Server error';
      }
    });
  }

formatPhone() {
  // Remove all non-digit characters
  let digits = this.phone.replace(/\D/g, '');

  // If it already starts with '91', keep it
  if (digits.startsWith('91')) {
    this.phone = '+91 ' + digits.slice(2);
  } else {
    // Add '+91' if not present
    this.phone = '+91 ' + digits;
  }

  // Limit to 10 digits after +91
  if (digits.length > 10 && digits.startsWith('91')) {
    this.phone = '+91 ' + digits.slice(2, 12);
  }
}

 keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  /** Step 2: Validate OTP */
  validateOtp() {
  const otp = this.otpDigits.join('');

  if (!/^[0-9]{6}$/.test(otp)) {
    this.message = 'Enter a valid 6-digit OTP.';
    this.error = 'error';
    return;
  }

  if (this.otpExpired) {
    this.message = 'OTP expired. Please resend.';
    this.error = 'error';
    return;
  }

  this.loading = true;

  const filters = { otp, phone: this.phone };

  this.otpService.validateOtp(filters).subscribe({
    next: (res: any) => {
      this.loading = false;



      if (res?.status) {
         this.storageService.set('userPhone', this.phone);
            const steps = Number(res.data.steps) || 0;
            const status = Number(res.data.status) || 1;
            const pan = res.data.pan || '';
         ///console.log('res:', res.data.steps);
            this.storageService.set('steps', steps);
            this.storageService.set('status', status);
          //this.storageService.set('pan', pan || '');
          //console.log('Saved:', { steps, status });
        this.message = 'OTP verified successfully!';
        this.error = '';

        clearInterval(this.timerInterval);

        // ✅ Delay navigation slightly (important fix)
        setTimeout(() => {
          this.router.navigate(['/bfaregistration']);
        }, 100);

      } else {
        this.message = res.message || 'Invalid OTP.';
        this.error = 'error';
      }
    },
    error: () => {
      this.loading = false;
      this.message = 'Server error. Please try again.';
      this.error = 'error';
    }
  });
}
  /** Timer Start */
  startTimer() {
    this.timer = 180;
    this.otpExpired = false;
    clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      this.timer--;
      if (this.timer <= 0) {
        clearInterval(this.timerInterval);
        this.otpExpired = true;
        this.message = 'OTP expired. Please request again.';
        this.error = 'error';
      }
    }, 1000);
  }

  /** Resend OTP (max 3 times) */
  resendOtp() {

    if (this.otpSendCount >= 3) {
      this.message = 'You have reached the maximum OTP limit (3 times).';
      this.error = 'error';
      return;
    }

    clearInterval(this.timerInterval);
    this.otpDigits = ['', '', '', '', '', ''];
    this.sendOtp();
  }

  /** Handle OTP input navigation */
  onOtpInput(event: any, index: number) {
    const input = event.target;
    input.value = input.value.replace(/[^0-9]/g, ''); // only numeric
    this.otpDigits[index] = input.value;

    if (input.value && index < this.otpBoxes.length - 1) {
      const next = input.parentElement.children[index + 1];
      next.focus();
    }
  }

  onOtpBackspace(event: any, index: number) {
    if (!this.otpDigits[index] && index > 0) {
      const prev = event.target.parentElement.children[index - 1];
      prev.focus();
    }
  }

  /** Format timer (mm:ss) */
  formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }
  onlyNumberInput(event: KeyboardEvent): void {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Delete'];
    if (!allowedKeys.includes(event.key) && !/^[0-9]$/.test(event.key)) {
      event.preventDefault();
    }
  }
  getMaskedPhone(data:any): string {
    if (!data) return '';
    let cleanPhone =data.replace(/^\+?91\s?/, '').replace(/\D/g, '');
    cleanPhone = cleanPhone.slice(-10);
    return '+91 ' + 'xxxxxx' + cleanPhone.slice(-4);
  }

showMessage: boolean = false;

showTemporaryMessage(msg: string) {
  this.message = msg;
  this.showMessage = true;
  setTimeout(() => {
    this.showMessage = false;
  }, 30000); // hide after 30 seconds
}





}
