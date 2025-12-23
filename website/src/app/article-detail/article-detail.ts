import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DaysService } from '../days.service';
import { environment } from '../../environments/environment';

import {
  Day,
  TipComponent,
  BilderMitTextComponent,
  AusfluegeComponent,
  MediaFile,
  PictureComponent,
  QuestionAnswerComponent
} from './../types/Day';
import { Tip } from '../components/tip/tip.component';
import { Ausflug } from '../components/ausflug/ausflug.component';
import { QuestionAnswer } from '../components/question-answer/question-answer.component';

@Component({
  selector: 'app-article-detail',
  standalone: true,
  imports: [CommonModule, Tip, Ausflug, QuestionAnswer],
  templateUrl: './article-detail.html',
  styleUrls: ['./article-detail.css']
})
export class ArticleDetail implements OnInit {
  day: Day | null = null;
    private strapiUrl = environment.baseUrl;

  // Lightbox Properties
  lightboxOpen = false;
  lightboxImages: MediaFile[] = [];
  lightboxIndex = 0;
  lightboxDescription = '';

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
      }
      console.log("Tag", this.day);
    });
  }

  // --- Image URL Helper ---
  getImageUrl(url: string): string {
    if (!url) return '';
    return url.startsWith('http') ? url : `${this.strapiUrl}${url}`;
  }

  // --- Format Date ---
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  // --- Get Description Text ---
  getDescriptionParagraphs(): string[] {
    if (!this.day?.description) return [];

    return this.day.description
      .filter((block: any) => block.type === 'paragraph')
      .map((block: any) =>
        block.children
          .map((child: any) => child.text)
          .join('')
      )
      .filter((text: string) => text.trim().length > 0);
  }

  // --- Lightbox Methods ---
  openLightbox(images: MediaFile[], index: number, description: string = ''): void {
    this.lightboxImages = images;
    this.lightboxIndex = index;
    this.lightboxDescription = description;
    this.lightboxOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeLightbox(): void {
    this.lightboxOpen = false;
    document.body.style.overflow = '';
  }

  nextImage(): void {
    if (this.lightboxIndex < this.lightboxImages.length - 1) {
      this.lightboxIndex++;
    }
  }

  previousImage(): void {
    if (this.lightboxIndex > 0) {
      this.lightboxIndex--;
    }
  }

  // --- Type Guards ---
  isTip(block: PictureComponent): block is TipComponent {
    return block.type === 'tip';
  }

  isQuestionAnswer(block: PictureComponent): block is QuestionAnswerComponent {
    return block.type === 'question-answer';
  }

  isAusfluege(block: PictureComponent): block is AusfluegeComponent {
    return block.type === 'ausfluege';
  }
}
