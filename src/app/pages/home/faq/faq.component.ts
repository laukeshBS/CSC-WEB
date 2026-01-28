import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FaqService } from '../../../core/services/faq.service';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {
  faqs: any[] = [];
  displayedFaqs: any[] = [];
  faqLoaded = false;
  showAll = false;
  openIndex: number | null = null;

  constructor(private faqService: FaqService, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.getFaqs();
  }

  getFaqs(): void {
    if (this.faqLoaded) {
      return; // Prevent duplicate calls
    }

    const filters = { status: '1', post_type: 'faq' };

    this.faqService.getFaqs(filters).subscribe({
      next: (data) => {
        this.faqs = Array.isArray(data?.data) ? data.data : [];
        this.displayedFaqs = this.faqs.slice(0, 5);
        this.faqLoaded = true;
      },
      error: (error) => {
        console.error('Error fetching FAQs:', error);
      }
    });
  }
  trackById(index: number, item: any): any {
    return item.id || index;
  }


  showMore(): void {
    this.displayedFaqs = this.faqs;
    this.showAll = true;
  }

  toggleFaq(index: number): void {
    this.openIndex = this.openIndex === index ? null : index;
  }

  isFaqOpen(index: number): boolean {
    return this.openIndex === index;
  }

  getSanitizedHtml(html: string): SafeHtml {
    if (!html) {
      return this.sanitizer.bypassSecurityTrustHtml('');
    }
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
