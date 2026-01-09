import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Day } from './types/Day';
import { environment } from '../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class DaysService {
  private graphqlUrl = environment.graphqlUrl;

  constructor(private http: HttpClient) {}

  getDays(): Observable<Day[]> {
    const query = `
      query GetTages {
        tages {
          documentId
          title
          dateFrom
          dateTo
          descriptionShort
          Highlights
          description
          TeaserBild {
            documentId
            url
            alternativeText
          }
          pictures {
            __typename
            ... on ComponentSharedAusfluege {
              title
              description
              bilderKomponenten: Bilder {
                Beschreibung
                bilderMedia: Bilder(pagination: { pageSize: 50 }) {
                  documentId
                  url
                  alternativeText
                }
              }
              tip {
                Icon
                Text
                Bild {
                  documentId
                  url
                  alternativeText
                }
              }
            }
            ... on ComponentSharedTip {
              Icon
              Text
              Bild {
                documentId
                url
                alternativeText
              }
            }
            ... on ComponentSharedFrageAntwort {
              Frage
              Antwort
              AntwortLang
              FrageBild {
                documentId
                alternativeText
                url
              }
              AntwortBild {
                documentId
                url
                alternativeText
              }
            }
          }
        }
      }
    `;

    return this.http.post<{ data: { tages: any[] } }>(
      this.graphqlUrl,
      { query }
    ).pipe(
      map(response => response.data.tages.map(tage => this.mapToDay(tage)))
    );
  }

  private mapToDay(tage: any): Day {
    return {
      id: tage.documentId,
      title: tage.title,
      dateFrom: tage.dateFrom,
      dateTo: tage.dateTo,
      teaserBild: tage.TeaserBild ? {
        id: tage.TeaserBild.documentId,
        url: tage.TeaserBild.url,
        alternativeText: tage.TeaserBild.alternativeText
      } : null,
      descriptionShort: tage.descriptionShort,
      highlights: tage.Highlights,
      description: tage.description,
      pictures: this.mapPictures(tage.pictures || [])
        } as Day;
      }

      private mapPictures(pictures: any[]): any[] {
        return pictures.map(picture => {
          switch (picture.__typename) {
            case 'ComponentSharedAusfluege':
              return {
                type: 'ausfluege',
                title: picture.title,
                description: picture.description,
                bilder: picture.bilderKomponenten?.map((bild: any) => ({
                  description: bild.Beschreibung,
                  bilder: bild.bilderMedia?.map((media: any) => ({
                    id: media.documentId,
                    url: media.url,
                    alternativeText: media.alternativeText
                  }))
                })),
                tip: picture.tip ? {
                  icon: picture.tip.Icon,
                  text: picture.tip.Text,
                  bild: picture.tip.Bild ? {
                    id: picture.tip.Bild.documentId,
                    url: picture.tip.Bild.url,
                    alternativeText: picture.tip.Bild.alternativeText
                  } : null
                } : null
              };

            case 'ComponentSharedTip':
              return {
                type: 'tip',
                icon: picture.Icon,
                text: picture.Text,
                bild: picture.Bild ? {
                  id: picture.Bild.documentId,
                  url: picture.Bild.url,
                  alternativeText: picture.Bild.alternativeText
                } : null
              };

            case 'ComponentSharedFrageAntwort':
              return {
                type: 'question-answer',
                question: picture.Frage,
                answer: picture.Antwort,
                answerLong: picture.AntwortLang,
                bildQuestion: picture.FrageBild ? {
                  id: picture.FrageBild.documentId,
                  url: picture.FrageBild.url,
                  alternativeText: picture.FrageBild.alternativeText
                } : null,
                bildAnswer: picture.AntwortBild ? {
                  id: picture.AntwortBild.documentId,
                  url: picture.AntwortBild.url,
                  alternativeText: picture.AntwortBild.alternativeText
                } : null
              };

            default:
              return picture;
          }
        });
      }

    }
