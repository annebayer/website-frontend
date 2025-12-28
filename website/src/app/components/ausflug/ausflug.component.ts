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

  // Hilfsmethode für die Anzahl der sichtbaren Bilder
  getImagesPerPage(): number {
    return this.isSmallScreen() ? 1 : 2;
  }

  nextCarousel(): void {
    const imagesPerPage = this.getImagesPerPage();
    const maxIndex = Math.max(0, this.allImages.length - imagesPerPage);
    this.currentCarouselIndex = Math.min(
      this.currentCarouselIndex + imagesPerPage, 
      maxIndex
    );
  }

  prevCarousel(): void {
    const imagesPerPage = this.getImagesPerPage();
    this.currentCarouselIndex = Math.max(0, this.currentCarouselIndex - imagesPerPage);
  }

  getVisibleImages(): ImageWithDescription[] {
    const imagesToShow = this.getImagesPerPage();
    return this.allImages.slice(
      this.currentCarouselIndex, 
      this.currentCarouselIndex + imagesToShow
    );
  }

  isSmallScreen(): boolean {
    return window.innerWidth < 768;
  }

  hasMoreImages(): boolean {
    const imagesPerPage = this.getImagesPerPage();
    return this.allImages.length > imagesPerPage;
  }

  canGoNext(): boolean {
    const imagesPerPage = this.getImagesPerPage();
    return this.currentCarouselIndex < this.allImages.length - imagesPerPage;
  }

  canGoPrev(): boolean {
    return this.currentCarouselIndex > 0;
  }

  getIndicatorCount(): number[] {
    const imagesPerPage = this.getImagesPerPage();
    return Array(Math.ceil(this.allImages.length / imagesPerPage)).fill(0);
  }

  isIndicatorActive(index: number): boolean {
    const imagesPerPage = this.getImagesPerPage();
    return this.currentCarouselIndex === index * imagesPerPage;
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
