import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleService } from '../article.service';
import { Day, Picture } from './../types/Day';

@Component({
  selector: 'app-article-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './article-list.html',
  styleUrls: ['./article-list.css']
})
export class ArticleList implements OnInit {
  days: Day[] = [];

  activePictures: Picture[] = [];
  activeIndex: number | null = null;

  get activePicture(): Picture | null {
    return this.activeIndex !== null ? this.activePictures[this.activeIndex] : null;
  }

  constructor(private articleService: ArticleService) {}

  ngOnInit(): void {
    this.articleService.getArticles().subscribe((res) => {
      this.days = res;
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
