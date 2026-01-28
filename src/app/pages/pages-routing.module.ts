import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Define routes
const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'about-us',
        loadComponent: () =>
          import('../pages/about/about.component').then((m) => m.AboutComponent),
         data: { title: 'About' },
      },
      {
        path: 'gallery',
        loadComponent: () =>
          import('../pages/gallery/gallery.component').then((m) => m.GalleryComponent),
         data: { title: 'Gallery' },
      },

      {
        path:'emi',
        loadComponent: () =>
          import('../pages/calculators/emi/emi.component').then((m) => m.EmiComponent),
         data: { title: 'Gallery' },
      },

      {
        path:'bfaregistration',
        loadComponent: () =>
          import('../pages/bfaregistration/bfaregistration.component').then((m) => m.BfaregistrationComponent),
         data: { title: 'BFA Registration' },
      },
    ],
  },
];

// Configure the module
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
