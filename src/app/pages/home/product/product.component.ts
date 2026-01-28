import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, ElementRef, Renderer2 } from '@angular/core';
import {CarouselModule,OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CarouselModule,CommonModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements  AfterViewInit {
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit() {
    const owlDots = this.el.nativeElement.querySelector('.owl-dots');
    if (owlDots) {
      this.renderer.setStyle(owlDots, 'display', 'none');
    }
  }
  loans = [
    { title: 'Home Loan', imgSrc: 'assets/assetsWeb/images/Home-loan.png', altText: 'Home Loan' },
    { title: 'Gold Loan', imgSrc: 'assets/assetsWeb/images/gold-loan.png', altText: 'Gold Loan' },
    { title: 'Education Loan', imgSrc: 'assets/assetsWeb/images/com-v-loan.png', altText: 'Education Loan' },
    { title: 'Deposit Loan', imgSrc: 'assets/assetsWeb/images/deposit.png', altText: 'Deposit Loan' },
    { title: 'MSME Loan', imgSrc: 'assets/assetsWeb/images/msme-loan.png', altText: 'MSME Loan' },
    { title: 'Vehicle Loan', imgSrc: 'assets/assetsWeb/images/vechle-loan.png', altText: 'Vehicle Loan' },
    { title: 'Personal Loan', imgSrc: 'assets/assetsWeb/images/personal-loan.png', altText: 'Personal Loan' }
  ];

    // Carousel options
    carouselOptions: OwlOptions = {
      loop: true,
      autoplay: true,
      navText: ['<', '>'],
      responsive: {
        0: {
          items: 2
        },
        600: {
          items: 3
        },
        1000: {
          items: 8
        }
      },
      nav: true,


    };

}
