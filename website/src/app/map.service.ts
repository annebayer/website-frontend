import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Map, MapComponent, LocationComponent, RouteComponent, Coordinates } from './types/Map';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private graphqlUrl = environment.graphqlUrl;

  constructor(private http: HttpClient) {}

  getMap(): Observable<Map> {
    const query = `
      query GetKarte {
        karte {
          createdAt
          documentId
          Orte {
            __typename
            ...on ComponentSharedMap {
              id
              hoverTitle
              Koordinate {
                x
                y
              }
              Sign {
                Art
              }
              tages {
                title
              }
            }
            ... on ComponentSharedMapRoute {
              Von
              Nach
              Koordinaten {
                x
                y
              }
              MapRouteArt {
                Art
              }
            }
          }
        }
      }
    `;

    return this.http.post<{ data: { karte: any } }>(
      this.graphqlUrl,
      { query }
    ).pipe(
      map(response => this.mapToMap(response.data.karte))  // ← Kein .map(), da kein Array
    );
  }

  private mapToMap(karteData: any): Map {
    return {
      id: karteData.documentId,
      locations: this.mapLocations(karteData.Orte || [])
    };
  }

  private mapLocations(orte: any[]): MapComponent[] {
    return orte.map(ort => {
      switch (ort.__typename) {
        case 'ComponentSharedMap':
          return {
            type: 'location',
            id: ort.id,
            hoverTitle: ort.hoverTitle,
            sign: ort.Sign?.Art || '',
            coordinates: {
              x: ort.Koordinate?.x || 0,
              y: ort.Koordinate?.y || 0
            },
            relation: ort.tages?.[0] ? {
              title: ort.tages[0].title
            } : undefined
          } as LocationComponent;

        case 'ComponentSharedMapRoute':
          return {
            type: 'route',
            from: ort.Von,
            to: ort.Nach,
            coordinates: (ort.Koordinaten || []).map((k: any) => ({
              x: k.x,
              y: k.y
            })),
            lineStyle: ort.MapRouteArt != null ? ort.MapRouteArt.Art : null,
          } as RouteComponent;

        default:
          console.warn('Unknown component type:', ort.__typename);
          return null;
      }
    }).filter(Boolean) as MapComponent[];
  }
}
