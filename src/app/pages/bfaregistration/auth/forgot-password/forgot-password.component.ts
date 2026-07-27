import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../../core/services/auth.service';
import { CryptoService } from '../../../../core/services/crypto.service';
import { StorageService } from '../../../../core/storage.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  loading = false;
  message = '';
  errorMessage = '';
  showPassword = false;
  userId: string = '';
  phone: any;
  ngOnInit() {
      this.userId = this.storageService.get('user_id') ?? '';
      this.phone = this.storageService.get('userPhone') ?? '';
     if (!this.phone) {
          this.router.navigate(['/otp']);
          return;
        }
    }
 

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private cryptoService: CryptoService,
    private storageService: StorageService,
    private router: Router
  ) {}

  forgotPasswordForm = this.fb.group(
    {
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()_\-+=])[A-Za-z\d@$!%*?&^#()_\-+=]{8,}$/
          )
        ]
      ],

      confirmPassword: [
        '',
        Validators.required
      ]
    },
    {
      validators: this.passwordMatchValidator()
    }
  );

  get f() {
    return this.forgotPasswordForm.controls;
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  /**
   * Password Match Validator
   */
  private passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

      const password = control.get('password')?.value;
      const confirmPassword = control.get('confirmPassword')?.value;

      if (!password || !confirmPassword) {
        return null;
      }

      return password === confirmPassword
        ? null
        : { passwordMismatch: true };
    };
  }

  /**
   * Reset Password
   */
  onSubmit(): void {

    this.message = '';
    this.errorMessage = '';

    if (this.forgotPasswordForm.invalid) {
      this.forgotPasswordForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    const request = {
      userid: this.userId,
      phone: this.phone,
      password: this.f.password.value!,
      confirmPassword: this.f.confirmPassword.value!
    };

    this.authService
      .forgotPassword(this.cryptoService.encrypt(request))
      .subscribe({

        next: (response: any) => {

          this.loading = false;

          if (response.status) {

            this.message =
              response.message ?? 'Password reset successfully.';

            this.forgotPasswordForm.reset();

            setTimeout(() => {
              this.router.navigate(['/auth/login']);
            }, 2000);

          } else {

            this.errorMessage =
              response.message ?? 'Unable to reset password.';
          }
        },

        error: (error) => {

          this.loading = false;

          this.errorMessage =
            error?.error?.message ??
            'Something went wrong. Please try again.';
        }
      });
  }

  /**
   * Password validation helper
   */
  get passwordErrors(): string[] {

    const password = this.f.password.value ?? '';

    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('Minimum 8 characters');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('One uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('One lowercase letter');
    }

    if (!/\d/.test(password)) {
      errors.push('One number');
    }

    if (!/[@$!%*?&^#()_\-+=]/.test(password)) {
      errors.push('One special character');
    }

    return errors;
  }
}