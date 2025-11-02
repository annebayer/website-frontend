import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AusfluegeComponent, MediaFile, AusflugBild } from '../../types/Day';
import { Tip } from '../tip/tip.component';
import { environment } from '../../../environments/environment';

interface ImageWithDescription {
  image: MediaFile;
  description: string;
}

@Component({
  selector: 'app-ausflug',
  standalone: true,
  imports: [CommonModule, Tip],
  templateUrl: './ausflug.component.html',
  styleUrls: ['./ausflug.component.css']
})
export class Ausflug implements OnInit {
  @Input() ausflug!: AusfluegeComponent;
  @Input() strapiUrl: string = environment.baseUrl;


  @Output() imageClick = new EventEmitter<{
    images: MediaFile[];
    index: number;
    description: string;
  }>();

  allImages: ImageWithDescription[] = [];

  currentCarouselIndex = 0;

  isLightboxOpen = false;
  currentLightboxIndex = 0;

  ngOnInit(): void {
    this.allImages = [];
    this.ausflug.bilder.forEach((gruppe: AusflugBild) => {
      gruppe.bilder.forEach((bild: MediaFile) => {
        this.allImages.push({
          image: bild,
          description: gruppe.description || ''
        });
      });
    });
  }

  getImageUrl(url: string): string {
    if (!url) return '';
    return url.startsWith('http') ? url : `${this.strapiUrl}${url}`;
  }

  nextCarousel(): void {
    const maxIndex = Math.max(0, this.allImages.length - 2);
    this.currentCarouselIndex = Math.min(this.currentCarouselIndex + 2, maxIndex);
  }

  prevCarousel(): void {
    this.currentCarouselIndex = Math.max(0, this.currentCarouselIndex - 2);
  }

  getVisibleImages(): ImageWithDescription[] {
    const imagesToShow = this.isSmallScreen() ? 1 : 2;
    return this.allImages.slice(this.currentCarouselIndex, this.currentCarouselIndex + imagesToShow);
  }

  isSmallScreen(): boolean {
    return window.innerWidth < 768;
  }

  hasMoreImages(): boolean {
    return this.allImages.length > 2;
  }

  canGoNext(): boolean {
    return this.currentCarouselIndex < this.allImages.length - 2;
  }

  canGoPrev(): boolean {
    return this.currentCarouselIndex > 0;
  }

  getIndicatorCount(): number[] {
    let divisor = this.isSmallScreen() ? 1 : 2
    return Array(Math.ceil(this.allImages.length / divisor)).fill(0);
  }

  isIndicatorActive(index: number): boolean {
    return this.currentCarouselIndex === index * 2;
  }

  openLightbox(globalIndex: number): void {
    this.currentLightboxIndex = globalIndex;
    this.isLightboxOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeLightbox(): void {
    this.isLightboxOpen = false;
    document.body.style.overflow = '';
  }

  nextLightbox(): void {
    this.currentLightboxIndex =
      (this.currentLightboxIndex + 1) % this.allImages.length;
  }

  prevLightbox(): void {
    this.currentLightboxIndex =
      (this.currentLightboxIndex - 1 + this.allImages.length) % this.allImages.length;
  }

  getCurrentLightboxImage(): ImageWithDescription {
    return this.allImages[this.currentLightboxIndex];
  }

  onLightboxBackgroundClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('lightbox-overlay')) {
      this.closeLightbox();
    }
  }

  onKeydown(event: KeyboardEvent): void {
    if (!this.isLightboxOpen) return;

    if (event.key === 'ArrowLeft') {
      this.prevLightbox();
    } else if (event.key === 'ArrowRight') {
      this.nextLightbox();
    } else if (event.key === 'Escape') {
      this.closeLightbox();
    }
  }
}
