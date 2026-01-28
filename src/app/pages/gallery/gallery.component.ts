import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { GalleryService } from '../../core/services/gallery.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {


  apiDocUrl: string = environment.apiDocUrl;
  fileURL = `${this.apiDocUrl}/uploads/gallery`;
  galleryItems: any[] = [];
  galleryLoaded = false;
  constructor(private galleryService: GalleryService, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.getGalleries();
  }



  getGalleries(): void {
    // Avoid reloading if already loaded
    if (this.galleryLoaded) {
      return;
    }

    const filters = { status: '1', post_type: 'gallery' };

    this.galleryService.getGalleries(filters).subscribe({
      next: (data) => {
        if (data?.data?.length) {
          // Add a cap to prevent DOM from freezing with too many items
          const safeItems = data.data.slice(0, 100); // or any sensible limit
          this.galleryItems = this.transformGalleryItems(safeItems);
        } else {
          this.galleryItems = [];
        }
        this.galleryLoaded = true;
      },
      error: (error) => {
        console.error('Error fetching galleryItems:', error);
      }
    });
  }
  trackById(index: number, item: any) {
    return item.id || index;
  }

  transformGalleryItems(data: any[]): any[] {
    return data.map((item, index) => {
      const images = item.metaData.image_path.split(',').map((image: any, imageIndex: number) => {
        return {
          src:  this.fileURL+`/${image}`,
          alt: `Image ${imageIndex + 1}`,
          index: imageIndex
        };
      });
      return {
        id: parseInt(item.ID),
        description: item.post_content,
        images: images
      };
    });
  }

  isLightboxOpen = false;
  currentGalleryId: number | null = null;
  currentIndex = 0;
  lightboxImage: any = null;
  lightboxGalleryDescription = '';

  displayGalleryById(galleryId: number): void {
    const gallery = this.galleryItems.find((item) => item.id === galleryId);
    if (gallery) {
      this.currentGalleryId = galleryId;
      this.currentIndex = 0;
      this.lightboxImage = gallery.images[this.currentIndex];
      this.lightboxGalleryDescription = gallery.description;
      this.isLightboxOpen = true;
      console.log(this.lightboxImage.src + "" + this.lightboxGalleryDescription);
    }
  }

  closeLightbox(): void {
    this.isLightboxOpen = false;
    this.lightboxImage = null;
    this.lightboxGalleryDescription = '';
  }

  nextImage(): void {
    if (this.currentGalleryId !== null) {
      const gallery = this.galleryItems.find((item) => item.id === this.currentGalleryId);
      if (gallery) {
        this.currentIndex = (this.currentIndex + 1) % gallery.images.length;
        this.lightboxImage = gallery.images[this.currentIndex];
      }
    }
  }

  prevImage(): void {
    if (this.currentGalleryId !== null) {
      const gallery = this.galleryItems.find((item) => item.id === this.currentGalleryId);
      if (gallery) {
        this.currentIndex = (this.currentIndex - 1 + gallery.images.length) % gallery.images.length;
        this.lightboxImage = gallery.images[this.currentIndex];
      }
    }
  }
  getSanitizedHtml(html: string): SafeHtml {

    if (html === 'null' || !html) {
      return  this['sanitizer'].bypassSecurityTrustHtml('');
    }
    return this['sanitizer'].bypassSecurityTrustHtml(html);
  }
}
