import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleService } from '../article.service';
import { Tag } from './../types/Tag'

@Component({
  selector: 'app-article-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './article-list.html',
  styleUrls: ['./article-list.css']
})
export class ArticleList implements OnInit {
  tage: Tag[] = [];

  constructor(private articleService: ArticleService) {}

  ngOnInit(): void {
    this.articleService.getArticles().subscribe((res) => {
      this.tage = res;
      console.log('Geladene Artikel:', this.tage);
    });
  }
}
