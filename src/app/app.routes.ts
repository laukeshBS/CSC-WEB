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
    path: 'status',
    title: 'CSC Loan Bazar | Status ',
    component: StatusComponent
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

