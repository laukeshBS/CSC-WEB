import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {
  ActivatedRoute,
  Router
} from '@angular/router';

import { AuthService } from '../../../../core/services/auth.service';
import { CryptoService } from '../../../../core/services/crypto.service';
import { StorageService } from '../../../../core/storage.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loading = false;
  errorMessage = '';
  token = '';
  showPassword = false;

  loginForm = this.fb.group({
    userid: [
      '',
      [Validators.required]
    ],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(8)
      ]
    ]
  });
  phone: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService, private storage: StorageService,
    private router: Router, private cryptoService: CryptoService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
 
    // Get token from route parameter
    this.token = this.route.snapshot.paramMap.get('token') ?? '';
     this.phone = this.storage.get('userPhone') || ''; 
     if (!this.phone) {
          this.router.navigate(['/otp']);
          return;
        }
    // If token is passed as query p  arameter
    // this.token = this.route.snapshot.queryParamMap.get('token') ?? '';

  }

  /**
   * Easy access to form controls
   */
  get f() {
    return this.loginForm.controls;
  }

  /**
   * Show / Hide Password
   */
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  /**
   * Login
   */
  onSubmit(): void {

    this.errorMessage = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    const request = {
      token: this.token,
      userid: this.f.userid.value?.trim() || '',
      password: this.f.password.value || ''
    };

    this.authService.login(this.cryptoService.encrypt(request)).subscribe({

      next: (response: any) => {

        this.loading = false;

        if (response.status) {

          // Store logged-in user details
          localStorage.setItem(
              'user',
              JSON.stringify(response.data)
          );

          // Store token if available
          if (response.token) {
              localStorage.setItem('token', response.token);
          }

          // Redirect with encrypted response data
      
         window.location.href =response.redirect_url + encodeURIComponent(response.data);
      }else {

          this.errorMessage =
            response.message || 'Invalid User ID or Password.';

        }

      },

      error: (error) => {

        this.loading = false;

        this.errorMessage =
          error?.error?.message ||
          'Unable to login. Please try again later.';

      }

    });

  }

}