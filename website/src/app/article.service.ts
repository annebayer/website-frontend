import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Tag } from './types/Tag'

@Injectable({ providedIn: 'root' })
export class ArticleService {
  //todo localhost als env-Variable
  private apiUrl = 'http://localhost:1337/api/tages';

  constructor(private http: HttpClient) {}

  getArticles(): Observable<Tag[]> {
    return this.http.get<{ data: Tag[] }>(this.apiUrl).pipe(
      map(response => response.data)
    );
  }
}
