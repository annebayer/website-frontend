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
          // Strapi liefert hier keine "attributes", also direkt das Objekt nehmen
          const attr = item.attributes ?? item;

          const pictures =
            attr.pictures?.map((p: any) => {
              // In deiner aktuellen API ist das File direkt: p.file.url
              const file = p.file;
              return {
                url: file ? this.baseUrl + file.url : '',
                description: p.Beschreibung || null
              };
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
