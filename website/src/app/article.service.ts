import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Day } from './types/Day';

@Injectable({ providedIn: 'root' })
export class ArticleService {
  private apiUrl = 'http://localhost:1337/api/tages?populate[pictures][populate]=*';
  private baseUrl = 'http://localhost:1337';

  constructor(private http: HttpClient) {}

  getArticles(): Observable<Day[]> {
    return this.http.get<{ data: any[] }>(this.apiUrl).pipe(
      map(response =>
        response.data.map(item => {
          const attr = item.attributes ?? item;

          const pictures =
            attr.pictures?.flatMap((p: any) => {
              if (p.__component === 'shared.media' && p.file) {
                return [{
                  url: this.baseUrl + p.file.url,
                  description: p.Beschreibung || null
                }];
              }

              if (p.__component === 'shared.bilder-mit-text' && Array.isArray(p.Bilder)) {
                return p.Bilder.map((b: any) => ({
                  url: this.baseUrl + b.url,
                  description: null
                }));
              }

              return [];
            }) ?? [];

          return {
            id: item.id,
            title: attr.title,
            dateFrom: attr.dateFrom,
            dateTo: attr.dateTo,
            highlight: attr.highlight || '',
            description: attr.description,
            pictures
          } as Day;
        })
      )
    );
  }
}
