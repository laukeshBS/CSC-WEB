import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { InformationService } from '../../../core/services/information.service';

@Component({
  selector: 'app-information',
  standalone: true,
  imports: [CommonModule, CarouselModule],
  templateUrl: './information.component.html',
  styleUrl: './information.component.css'
})
export class InformationComponent implements OnInit {
  information: any[] = [];
  informationLoaded = false;
  carouselOptions: any;

  constructor(
    private infoService: InformationService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.getInformations();
  }

  getInformations(): void {
    if (this.informationLoaded) return;

    const filters = { status: '1', post_type: 'information' };
    this.infoService.getInformations(filters).subscribe({
      next: (data) => {
        this.information = Array.isArray(data?.data) ? data.data : [];
        this.informationLoaded = true;
        this.updateCarouselOptions();
      },
      error: (error) => {
        console.error('Error fetching information:', error);
      }
    });
  }

  updateCarouselOptions(): void {
    const length = this.information.length;
    this.carouselOptions = {
      loop: length > 1,
      margin: 10,
      autoplay: true,
      nav: true,
      navText: ['<', '>'],
      responsive: {
        0: { items: Math.min(length, 2) },
        600: { items: Math.min(length, 3) },
        1000: { items: Math.min(length, 8) }
      }
    };
  }

  getSanitizedHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html || '');
  }

  trackById(index: number, item: any): any {
    return item.id || index;
  }
  infoIcons = [
    'info-logo-01.png',
    'info-logo-02.png',
    'info-logo-03.png',
    'info-logo-04.png'
  ];
}
