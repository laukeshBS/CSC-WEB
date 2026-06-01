import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import {
  DomSanitizer,
  SafeHtml,
  SafeResourceUrl
} from '@angular/platform-browser';

import { environment } from '../../environments/environment.development';

import { GalleryService }
from '../../core/services/gallery.service';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})

export class GalleryComponent
implements OnInit {

  // =====================================
  // CONFIG
  // =====================================
  apiDocUrl: string =
    environment.apiDocUrl;

  fileURL =
    `${this.apiDocUrl}/uploads/gallery`;

  // =====================================
  // DEFAULT IMAGE
  // =====================================
  defaultImage =
    'assets/no-image.png';

  // =====================================
  // DATA
  // =====================================
  galleryItems: any[] = [];

  galleryLoaded = false;

  // =====================================
  // LIGHTBOX
  // =====================================
  selectedGallery: any = null;

  lightboxImage: any = null;

  currentIndex = 0;

  isLightboxOpen = false;

  safeVideoUrl!: SafeResourceUrl;

  currentGalleryId:
    number | null = null;

  lightboxGalleryDescription = '';

  constructor(

    private galleryService:
      GalleryService,

    private sanitizer:
      DomSanitizer

  ) {}

  // =====================================
  // INIT
  // =====================================
  ngOnInit(): void {

    this.getGalleries();

  }

  // =====================================
  // GET GALLERY
  // =====================================
  getGalleries(): void {

    if (this.galleryLoaded) {

      return;

    }

    const filters = {

      status: '1',

      post_type: 'gallery'

    };

    this.galleryService
      .getGalleries(filters)
      .subscribe({

        next: (res: any) => {

          const data =
            res?.data || [];

          this.galleryItems =
            this.transformGalleryItems(data);

          this.galleryLoaded = true;

          console.log(
            'Gallery Items =>',
            this.galleryItems
          );

        },

        error: (err: any) => {

          console.error(
            'Gallery Error:',
            err
          );

        }

      });

  }

  // =====================================
  // TRANSFORM DATA
  // =====================================
  transformGalleryItems(
    data: any[]
  ): any[] {

    return data.map((item) => {

      const rawImages =
        item?.metaData?.image_path || '';

      let images: any[] = [];

      // =====================================
      // IMAGE GALLERY
      // =====================================
      if (rawImages) {

        images = rawImages
          .split(',')
          .map((img: string) =>
            img.trim()
          )
          .filter((img: string) =>
            img !== ''
          )
          .map((img: string, i: number) => ({

            src:
              `${this.fileURL}/${img}`,

            alt:
              `Image ${i + 1}`,

            index: i

          }));

      }

      // =====================================
      // VIDEO THUMBNAIL
      // =====================================
      if (

        item?.metaData?.imageVideo === 'video'

      ) {

        const videoUrl =
          item?.metaData?.urlVideo || '';

        const thumb =
          this.getYouTubeThumbnail(
            videoUrl
          );

        images = [{

          src:
            thumb,

          alt:
            'Video Thumbnail',

          index: 0

        }];

      }

      // =====================================
      // DEFAULT IMAGE
      // =====================================
      if (images.length === 0) {

        images = [{

          src:
            this.defaultImage,

          alt:
            'No Image',

          index: 0

        }];

      }

      return {

        id:
          Number(item.ID),

        description:
          item.post_content || '',

        urlVideo:
          item.metaData?.urlVideo || '',

        imageVideo:
          item.metaData?.imageVideo || 'image',

        images: images

      };

    });

  }

  // =====================================
  // OPEN GALLERY
  // =====================================
  openGallery(
    gallery: any,
    index: number = 0
  ): void {

    this.selectedGallery =
      gallery;

    this.currentGalleryId =
      gallery.id;

    this.currentIndex =
      index;

    this.isLightboxOpen =
      true;

    this.lightboxGalleryDescription =
      gallery.description;

    // =====================================
    // IMAGE
    // =====================================
    if (
      gallery.imageVideo === 'image'
    ) {

      this.lightboxImage =
        gallery.images[index];

    }

    // =====================================
    // VIDEO
    // =====================================
    if (
      gallery.imageVideo === 'video'
    ) {

      this.safeVideoUrl =
        this.getSafeVideoUrl(
          gallery.urlVideo
        );

    }

  }

  // =====================================
  // CLOSE LIGHTBOX
  // =====================================
  closeLightbox(): void {

    this.isLightboxOpen =
      false;

    this.lightboxImage =
      null;

    this.selectedGallery =
      null;

  }

  // =====================================
  // NEXT IMAGE
  // =====================================
  nextImage(): void {

    const gallery =
      this.galleryItems.find(

        g =>
          g.id === this.currentGalleryId

      );

    if (

      !gallery ||

      gallery.imageVideo !== 'image'

    ) {

      return;

    }

    this.currentIndex =

      (
        this.currentIndex + 1
      ) %

      gallery.images.length;

    this.lightboxImage =

      gallery.images[
        this.currentIndex
      ];

  }

  // =====================================
  // PREVIOUS IMAGE
  // =====================================
  prevImage(): void {

    const gallery =
      this.galleryItems.find(

        g =>
          g.id === this.currentGalleryId

      );

    if (

      !gallery ||

      gallery.imageVideo !== 'image'

    ) {

      return;

    }

    this.currentIndex =

      (
        this.currentIndex - 1 +
        gallery.images.length
      ) %

      gallery.images.length;

    this.lightboxImage =

      gallery.images[
        this.currentIndex
      ];

  }

  // =====================================
  // GET YOUTUBE VIDEO ID
  // =====================================
  getYoutubeVideoId(
    url: string
  ): string {

    if (!url) {

      return '';

    }

    const regExp =
      /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

    const match =
      url.match(regExp);

    return match?.[1] || '';

  }

  // =====================================
  // YOUTUBE THUMBNAIL
  // =====================================
  getYouTubeThumbnail(
    url: string
  ): string {

    const videoId =
      this.getYoutubeVideoId(url);

    console.log(
      'Thumbnail Video ID =>',
      videoId
    );

    // =====================================
    // INVALID URL
    // =====================================
    if (!videoId) {

      return this.defaultImage;

    }

    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  }

  // =====================================
  // IMAGE ERROR
  // =====================================
  onImageError(event: any): void {

    event.target.src =
      this.defaultImage;

  }

  // =====================================
  // SAFE VIDEO URL
  // =====================================
  getSafeVideoUrl(
    url: string
  ): SafeResourceUrl {

    const videoId =
      this.getYoutubeVideoId(url);

    console.log(
      'Embed Video ID =>',
      videoId
    );

    // =====================================
    // INVALID VIDEO
    // =====================================
    if (!videoId) {

      return this.sanitizer
        .bypassSecurityTrustResourceUrl('');

    }

    const embedUrl =

      `https://www.youtube.com/embed/${videoId}`;

    return this.sanitizer
      .bypassSecurityTrustResourceUrl(
        embedUrl
      );

  }

  // =====================================
  // SANITIZED HTML
  // =====================================
  getSanitizedHtml(
    html: string
  ): SafeHtml {

    return this.sanitizer
      .bypassSecurityTrustHtml(
        html || ''
      );

  }

  // =====================================
  // TRACK BY
  // =====================================
  trackById(
    index: number,
    item: any
  ) {

    return item.id;

  }

}