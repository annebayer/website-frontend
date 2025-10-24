import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DaysService } from '../days.service';
import {
  Day,
  TipComponent,
  BilderMitTextComponent,
  AusfluegeComponent,
  MediaFile
} from './../types/Day';
import { Tip } from '../components/tip/tip.component';

@Component({
  selector: 'app-article-detail',
  standalone: true,
  imports: [CommonModule, Tip],
  templateUrl: './article-detail.html',
  styleUrls: ['./article-detail.css']
})
export class ArticleDetail implements OnInit {
  day: Day | null = null;
  private strapiUrl = 'http://localhost:1337';

  // Lightbox Properties
  sliderImages: any[] = [];
  currentImageIndex: number = 0;
  activePicture: any = null;  // Nur eine Definition!

  constructor(
    private route: ActivatedRoute,
    private daysService: DaysService
  ) {}

  ngOnInit(): void {
    const param = this.route.snapshot.paramMap.get('id');
    if (!param) return;

    const searchTitle = decodeURIComponent(param)
      .toLowerCase()
      .trim()
      .replace(/-/g, ' ');

    this.daysService.getDays().subscribe((days) => {
      this.day = days.find((d) =>
        d.title.toLowerCase().trim() === searchTitle
      ) ?? null;

      if (!this.day) {
        console.warn(`Kein Tag mit Titel "${param}" gefunden`);
        console.log('Verfügbare Titel:', days.map(d => d.title));
      }
      console.log("Tag", this.day);
    });
  }

  // --- Image URL Helper ---
  getImageUrl(url: string): string {
    if (!url) return '';
    return url.startsWith('http') ? url : `${this.strapiUrl}${url}`;
  }

  // --- Lightbox ---
  openSlider(images: any[], startIndex: number): void {
    this.sliderImages = images;
    this.currentImageIndex = startIndex;
    this.activePicture = images[startIndex];
    document.body.style.overflow = 'hidden';
  }

  closeSlider(): void {
    this.activePicture = null;
    this.sliderImages = [];
    this.currentImageIndex = 0;
    document.body.style.overflow = '';
  }

  nextPicture(): void {
    if (this.currentImageIndex < this.sliderImages.length - 1) {
      this.currentImageIndex++;
      this.activePicture = this.sliderImages[this.currentImageIndex];
    }
  }

  prevPicture(): void {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
      this.activePicture = this.sliderImages[this.currentImageIndex];
    }
  }

  // --- Type Guards ---
  isTip(block: PictureComponent): block is TipComponent {
    return block.type === 'tip';
  }

  isMediaFile(block: any): block is MediaFile {
    return 'url' in block && !('__typename' in block);
  }

  // --- Helper: alle Bilder eines Blocks für die Lightbox ---
  getBlockPictures(block: any): MediaFile[] {
    if (this.isBilderMitText(block)) return block.Bilder ?? [];
    if (this.isTip(block) && block.Bild) return [block.Bild];
    if (this.isAusfluege(block)) {
      return (block.Bilder ?? [])
        .flatMap((item: any) => item.bilderMedia ?? []);
    }
    if (this.isMediaFile(block)) return [block];
    return [];
  }
}
