import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { GalleryComponent } from './pages/gallery/gallery.component';
import { EmiComponent } from './pages/calculators/emi/emi.component';
import { AboutComponent } from './pages/about/about.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { BfaregistrationComponent } from './pages/bfaregistration/bfaregistration.component';
import { OtpComponent } from './pages/otp/otp.component';
import { StatusComponent } from './pages/bfaregistration/status/status.component';
import { PreviewComponent } from './pages/bfaregistration/preview/preview.component';
import { TermsConditionsComponent } from './pages/bfaregistration/terms-conditions/terms-conditions.component';
import { PaymentComponent } from './pages/bfaregistration/payment/payment.component';
import { SuccessComponent } from './pages/bfaregistration/payment/success/success.component';
import { FailureComponent } from './pages/bfaregistration/payment/failure/failure.component';
import { LoginComponent } from './pages/bfaregistration/auth/login/login.component';
import { ChangePasswordComponent } from './pages/bfaregistration/auth/change-password/change-password.component';
import { ResetPasswordComponent } from './pages/bfaregistration/auth/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './pages/bfaregistration/auth/forgot-password/forgot-password.component';

export const routes: Routes = [
  {
    path: '',
    title: 'CSC Loan Bazar',
    component: HomeComponent,
    pathMatch: 'full'
  },
  {
    path: 'gallery',
    title: 'CSC Loan Bazar | Gallery',
    component: GalleryComponent
  },
  {
    path: 'about-us',
    title: 'CSC Loan Bazar | About us',
    component: AboutComponent
  },
  {
    path: 'emi',
    title: 'CSC Loan Bazar | EMI Calculator ',
    component: EmiComponent
  },

  {
    path: 'bfaregistration',
    title: 'CSC Loan Bazar | BFA Registration ',
    component: BfaregistrationComponent
  },
  {
    path: 'otp',
    title: 'CSC Loan Bazar | OTP ',
    component: OtpComponent
  },
  {
    path: 'preview',
    title: 'CSC Loan Bazar | Preview ',
    component: PreviewComponent
  },
  {
    path: 'payment',
    title: 'CSC Loan Bazar | Payment ',
    component: PaymentComponent
  },
  // {
  //   path: 'payment/success',
  //   title: 'CSC Loan Bazar | Payment Success',
  //   component: SuccessComponent
  // },
  {
    path: 'payment/success',
    title: 'CSC Loan Bazar | Payment Success',
    component: SuccessComponent
  },
  {
    path: 'payment/failure',
    title: 'CSC Loan Bazar | Payment Failure',
    component: FailureComponent
  },
  {
    path: 'terms-conditions',
    title: 'CSC Loan Bazar | Terms Conditions ',
    component: TermsConditionsComponent
  },
   {
    path: 'status',
    title: 'CSC Loan Bazar | Status ',
    component: StatusComponent
  },
  {
    path: 'auth/login',
    title: 'CSC Loan Bazar | Login ',
    component: LoginComponent
  },
  {
    path: 'auth/change-password',
    title: 'CSC Loan Bazar | Change Password ',
    component:ChangePasswordComponent
  },
  {
    path: 'auth/reset-password',
    title: 'CSC Loan Bazar | Reset Password ',
    component:ResetPasswordComponent
  },
  {
    path: 'auth/forgot-password',
    title: 'CSC Loan Bazar | Forgot Password ',
    component: ForgotPasswordComponent
  },
  {
    path: 'web-new/otp',
    title: 'CSC Loan Bazar | OTP ',
    component: OtpComponent
  } ,
   {
    path: 'web-new/status',
    title: 'CSC Loan Bazar | Status ',
    component: StatusComponent
  },

  {
    path: 'web-new/gallery',
    title: 'CSC Loan Bazar | Gallery',
    component: GalleryComponent
  },
  {
    path: 'web-new/about-us',
    title: 'CSC Loan Bazar | About us',
    component: AboutComponent
  },
  {
    path: 'web-new/emi',
    title: 'CSC Loan Bazar | EMI Calculator ',
    component: EmiComponent
  },
  {
    path: 'web-new/bfaregistration',
    title: 'CSC Loan Bazar | BFA Registration ',
    component: EmiComponent
  },
  {
    path: '**',
    component: NotfoundComponent
  }
];

