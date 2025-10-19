import { Routes } from '@angular/router';
import { ArticleList } from './article-list/article-list';
import { ArticleDetail } from './article-detail/article-detail';

export const routes: Routes = [
  { path: '', component: ArticleList },
  { path: 'article/:id', component: ArticleDetail },
];
