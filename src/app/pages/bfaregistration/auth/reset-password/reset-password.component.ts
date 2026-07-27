import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { StorageService } from '../../../../core/storage.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  token = '';
  loading = false;
  message = '';
  error = '';
  showPassword = false;

  form = this.fb.group(
    {
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
          Validators.pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_\-+=])[A-Za-z\d@$!%*?&#^()_\-+=]{8,20}$/
          )
        ]
      ],
      password_confirm: ['', Validators.required]
    },
    {
      validators: this.passwordMatchValidator()
    }
  );
  phone: any;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private auth: AuthService, private storageService: StorageService, 
    private router: Router
  ) {}

  ngOnInit(): void {
    this.phone = this.storageService.get('userPhone') || '';
    this.token = this.route.snapshot.paramMap.get('token') || '';
      if (!this.phone) {
          this.router.navigate(['/otp']);
          return;
        }
  }

  get f() {
    return this.form.controls;
  }
  get maskedPhone(): string {
    if (!this.phone) {
      return '';
    }

    return this.phone.replace(/\d(?=\d{4})/g, 'X');
  }
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

      const password = control.get('password')?.value;
      const confirm = control.get('password_confirm')?.value;

      if (!password || !confirm) {
        return null;
      }

      return password === confirm
        ? null
        : { passwordMismatch: true };
    };
  }

  submit(): void {

    this.error = '';
    this.message = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    const request = {
      token: this.token,
      password: this.f.password.value || ''
    };

    this.auth.createPassword(request).subscribe({

      next: (response: any) => {

        this.loading = false;

        if (response.status) {

          this.message = 'Password reset successfully.';

          setTimeout(() => {
            this.router.navigate(['/auth/login']);
          }, 1500);

        } else {

          this.error = response.message;

        }

      },

      error: (err) => {

        this.loading = false;
        this.error =
          err?.error?.message ||
          'Reset failed or token expired.';

      }

    });

  }

}