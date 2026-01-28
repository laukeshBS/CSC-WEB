import { CommonModule } from '@angular/common';
import { Component, OnInit, AfterViewInit, ElementRef, Renderer2 } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { SliderService } from '../../../core/services/slider.service';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-slider',
  standalone: true,
  imports: [CommonModule, CarouselModule],
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css']
})
export class SliderComponent implements OnInit, AfterViewInit {
  slides: any[] = [];
  apiDocUrl: string = environment.apiDocUrl;
  fileURL: string = `${this.apiDocUrl}/uploads/testimonials/`;
  image: string = 'assets/assetsWeb/images/home-bg.webp';

  carouselOptions: OwlOptions = {};


  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private sliderService: SliderService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loadSlides();
  }

  ngAfterViewInit(): void {
    // Optional: Hide navigation dots if required
    const owlDots = this.elementRef.nativeElement.querySelector('.owl-dots');
    if (owlDots) {
      this.renderer.setStyle(owlDots, 'display', 'none');
    }
  }

  private loadSlides(): void {
    const filters = { status: '1', post_type: 'banner' };

    this.sliderService.getBanners(filters).subscribe({
      next: (response) => {
        this.slides = response.data || [];
        const slideCount = this.slides.length;

        if (slideCount === 0) return;

        const itemCount = Math.min(slideCount, 1); // Show 1 item at a time

        this.carouselOptions = {
          loop: slideCount > itemCount,
          autoplay: slideCount > 1,
          nav: slideCount > itemCount,
          navText: ['<', '>'],
          responsive: {
            0: { items: itemCount },
            600: { items: itemCount },
            1000: { items: itemCount }
          }
        };
      },
      error: (err) => {
        console.error('Error loading slider data:', err);
      }
    });
  }

  trackById(index: number, item: any): any {
    return item?.id ?? index;
  }
}
