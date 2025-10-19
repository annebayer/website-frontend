import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ArticleService } from '../article.service';
import { Day, Picture } from './../types/Day';

@Component({
  selector: 'app-article-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './article-detail.html',
  styleUrls: ['./article-detail.css']
})
export class ArticleDetail implements OnInit {
  day: Day | null = null;

  activePictures: Picture[] = [];
  activeIndex: number | null = null;

  get activePicture(): Picture | null {
    return this.activeIndex !== null ? this.activePictures[this.activeIndex] : null;
  }

  constructor(
    private route: ActivatedRoute,
    private articleService: ArticleService
  ) {}

ngOnInit(): void {
  const param = this.route.snapshot.paramMap.get('id');
  if (!param) return;

  const id = Number(param.split('-')[0]); // extrahiere ID aus "12-hobbiton"

  this.articleService.getArticles().subscribe((days) => {
    this.day = days.find((d) => d.id === id) ?? null;
  });
}


  openSlider(pictures: Picture[], index: number): void {
    this.activePictures = pictures;
    this.activeIndex = index;
  }

  closeSlider(): void {
    this.activeIndex = null;
  }

  nextPicture(): void {
    if (this.activeIndex === null) return;
    this.activeIndex = (this.activeIndex + 1) % this.activePictures.length;
  }

  prevPicture(): void {
    if (this.activeIndex === null) return;
    this.activeIndex =
      (this.activeIndex - 1 + this.activePictures.length) % this.activePictures.length;
  }
}
