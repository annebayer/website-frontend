import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ArticleService } from '../article.service';
import { Day } from './../types/Day';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-article-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './article-list.html',
  styleUrls: ['./article-list.css']
})
export class ArticleList implements OnInit {
  days: Day[] = [];

  constructor(
    private articleService: ArticleService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.articleService.getArticles().subscribe((res) => {
      this.days = res;
    });
  }

  getTeaserText(day: Day): string {
    if (day.descriptionShort) {
      return day.descriptionShort;
    }

    if (day.description && day.description.length > 0) {
      const fullText = day.description
        .map(block => block.children.map((child: any) => child.text).join(' '))
        .join(' ');
      return fullText.length > 300
        ? fullText.slice(0, 300).trim() + ' …'
        : fullText;
    }

    return '';
  }

toSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Umlaute entfernen
    .replace(/[^a-z0-9]+/g, '-')      // Sonderzeichen -> -
    .replace(/(^-|-$)+/g, '');        // Trim
}

getShortText(day: Day): string {
  if (day.descriptionShort) return day.descriptionShort;
  if (!day.description) return '';
  const text = day.description
    .flatMap(b => b.children.map((c:any) => c.text))
    .join(' ');
  return text.length > 300 ? text.substring(0, 300) + '…' : text;
}


  openDetail(id: number): void {
    this.router.navigate(['/article', id]);
  }
}
