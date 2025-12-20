import { Routes } from '@angular/router';
import { ArticleList } from './article-list/article-list';
import { ArticleDetail } from './article-detail/article-detail';
import { TravelMapComponent } from './map/map.component';
import { LaraEasterEggComponent } from './lara/lara.component';

export const routes: Routes = [
  { path: '', component: ArticleList },
  { path: 'article/:id', component: ArticleDetail },
  { path: 'map', component: TravelMapComponent },
  { path: 'lara', component: LaraEasterEggComponent },
];
