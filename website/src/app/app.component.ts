import { Component } from '@angular/core';
import { ArticleList } from './article-list/article-list';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ArticleList],
  templateUrl: './app.component.html',
})
export class AppComponent {}
