import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { TestimonialService } from '../../../core/services/testimonials.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule, CarouselModule],
  templateUrl: './testimonials.component.html',
  styleUrl: './testimonials.component.css'
})
export class TestimonialsComponent implements OnInit {
  selectedTab: string = 'Customer';
  testimonials: any[] = [];
  image: string = 'assets/assetsWeb/images/user-img.jpg';
  arrowImg: string = 'assets/assetsWeb/images/t-arrow.png';
  apiDocUrl: string = environment.apiDocUrl;
  fileURL = this.apiDocUrl + '/uploads/testimonials/';
  constructor(private testimonialService: TestimonialService,private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.getTestimonials();
  }

  getTestimonials(): void {
    const filters = {
      testimonials_type: this.selectedTab,
      status: '1',
      post_type: 'testimonial'
    };

    this.testimonialService.getTestimonials(filters).subscribe({
      next: (data) => {
        const response = data?.data ?? [];
        this.testimonials = Array.isArray(response) ? response : [];

        // Optional: adjust carousel options if only 1 item
        if (this.testimonials.length < 2) {
          this.carouselOptions = {
            ...this.carouselOptions,
            loop: false,
            autoplay: false,
          };
        } else {
          this.carouselOptions = {
            ...this.carouselOptions,
            loop: true,
            autoplay: true,
          };
        }

        // Debug/logging (optional)
        // console.log('Fetched testimonials:', this.testimonials);
      },
      error: (error) => {
        console.error('Error fetching testimonials:', error);
        this.testimonials = [];
      }
    });
  }


  carouselOptions: OwlOptions = {
    loop: true,
    autoplay: true,
    nav: false,
    dots: false,
    responsive: {
      0: { items: 1 },
      600: { items: 1 },
      1000: { items: 2 }
    }
  };

  setTab(tabName: string): void {
    this.selectedTab = tabName;
    this.getTestimonials();
  }
  getSanitizedHtml(html: string): SafeHtml {

    if (html === 'null' || !html) {
      return  this['sanitizer'].bypassSecurityTrustHtml('');
    }
    return this['sanitizer'].bypassSecurityTrustHtml(html);
  }
}
