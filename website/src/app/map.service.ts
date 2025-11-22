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
                KoordinatenZusammen
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
                KoordinatenZusammen
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
      map(response => this.mapToMap(response.data.karte))
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
          const coords = this.parseCoordinates(ort.Koordinate);
          return {
            type: 'location',
            id: ort.id,
            hoverTitle: ort.hoverTitle,
            sign: ort.Sign?.Art || '',
            coordinates: coords,
            relation: ort.tages?.[0] ? {
              title: ort.tages[0].title
            } : undefined
          } as LocationComponent;

        case 'ComponentSharedMapRoute':
          return {
            type: 'route',
            from: ort.Von,
            to: ort.Nach,
            coordinates: (ort.Koordinaten || []).map((k: any) =>
              this.parseCoordinates(k)
            ),
            lineStyle: ort.MapRouteArt != null ? ort.MapRouteArt.Art : null,
          } as RouteComponent;

        default:
          console.warn('Unknown component type:', ort.__typename);
          return null;
      }
    }).filter(Boolean) as MapComponent[];
  }

  private parseCoordinates(koordinate: any): { x: number; y: number } {
    if (koordinate?.x != null && koordinate?.y != null) {
      return {
        x: koordinate.x,
        y: koordinate.y
      };
    }

    if (koordinate?.KoordinatenZusammen) {
      const coords = this.parseKoordinatenZusammen(koordinate.KoordinatenZusammen);
      if (coords) {
        return coords;
      }
    }

    console.warn('Keine gültigen Koordinaten gefunden:', koordinate);
    return { x: 0, y: 0 };
  }

  private parseKoordinatenZusammen(koordinatenStr: string): { x: number; y: number } | null {
    if (!koordinatenStr) {
      return null;
    }

    try {
      const cleaned = koordinatenStr
        .replace(/[()]/g, '')
        .replace(/,/g, '');

      const parts = cleaned.trim().split(/\s+/);

      if (parts.length >= 2) {
        const x = parseFloat(parts[0]);
        const y = parseFloat(parts[1]);

        if (!isNaN(x) && !isNaN(y)) {
          return { x, y };
        }
      }

      console.warn('Ungültiges KoordinatenZusammen Format:', koordinatenStr);
      return null;
    } catch (error) {
      console.error('Fehler beim Parsen von KoordinatenZusammen:', koordinatenStr, error);
      return null;
    }
  }
}
