import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
@Component({
  selector: 'app-login',
  standalone: true,
   imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  view: 'first' | 'regular' = 'regular';

  // First-time flow
  ftStep = 1; // 1: intro, 2: enter PAN, 3: set PIN
  panForm!: FormGroup;
  pinForm!: FormGroup;
  ftMessage = '';
  pinError = '';

  // Regular login
  loginForm!: FormGroup;
  otpSent = false;
  loginError = '';

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.panForm = this.fb.group({ pan: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]] });
    this.pinForm = this.fb.group({ pin: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(6)]], pinConfirm: ['', Validators.required] });
    this.loginForm = this.fb.group({ mobile: ['', [Validators.required, Validators.pattern(/^\\d{10}$/)]], otp: ['', Validators.required], pinLogin: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(6)]] });
  }

  showFirstTime() { this.view = 'first'; this.ftStep = 1; }
  showRegular() { this.view = 'regular'; }

  gotoForgot(evt: Event) { evt.preventDefault(); this.ftStep = 2; }

  submitPan() {
    if (this.panForm.invalid) return;
    const pan = this.panForm.value.pan;

    // TODO: call service to reset using PAN
    // Mock response: success -> ask user to set PIN
    console.log('reset PAN requested for', pan);
    this.ftStep = 3;
    this.ftMessage = 'PAN verified. Please set a login PIN.';
  }

  setPin() {
    if (this.pinForm.invalid) return;
    const { pin, pinConfirm } = this.pinForm.value;
    if (pin !== pinConfirm) {
      this.pinError = 'PIN and confirmation do not match.';
      return;
    }

    // TODO: call service to store PIN securely
    console.log('Setting PIN', pin);
    this.ftMessage = 'PIN set successfully. You can now login using OTP + PIN.';
    this.ftStep = 1;
  }

  cancelFirstTime() {
    this.ftStep = 1;
    this.panForm.reset();
    this.pinForm.reset();
    this.ftMessage = '';
  }

  // Regular login handlers
  sendOtp() {
    const mobile = this.loginForm.value.mobile;
    if (!/^\d{10}$/.test(mobile)) {
      this.loginError = 'Enter a valid 10-digit mobile number.';
      return;
    }

    // TODO: call OTP service
    console.log('Sending OTP to', mobile);
    this.otpSent = true;
    this.loginForm.get('otp')?.setValue('');
    this.loginError = '';
  }

  login() {
    if (this.loginForm.invalid) {
      this.loginError = 'Please fill all required fields.';
      return;
    }

    const payload = this.loginForm.value;
    console.log('Login attempt', payload);

    // Mock successful login
    this.loginError = '';
    alert('Login successful (mock). Replace with real auth flow.');
  }

}
