import { Component, AfterViewInit, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { MapService } from '../map.service';
import { Map, MapComponent, LocationComponent, RouteComponent } from '../types/Map';
import { Router } from '@angular/router';
import { toSlug } from '../util/slug'


@Component({
  selector: 'app-travel-map',
  standalone: true,
  template: '<div id="map" style="height: 600px;"></div>',
  styles: [`#map { width: 100%; }`]
})
export class TravelMapComponent implements OnInit, AfterViewInit {
  private map!: L.Map;
  maps: Map | null = null
  constructor(
      private mapService: MapService,
      private router: Router
    ) {}
private addMarkersAndRoutes(): void {
      if (!this.maps || !this.map) return;

      this.maps.locations.forEach((component: MapComponent) => {
        if (this.isLocationComponent(component)) {
          this.addMarker(component);
        } else if (this.isRouteComponent(component)) {
          this.addRoute(component);
        }
      });
    }

  ngOnInit(): void {
      this.mapService.getMap().subscribe({
        next: (mapData) => {
          this.maps = mapData;

          if (this.map) {
            this.addMarkersAndRoutes();
          }
        },
        error: (err) => console.error('Fehler beim Laden der Karte:', err)
      });
    }

  ngAfterViewInit(): void {
      this.initMap();

      if (this.maps) {
        this.addMarkersAndRoutes();
      }
    }

  private initMap(): void {
    this.map = L.map('map', {
          attributionControl: true,
          worldCopyJump: false,
      })
      .setView([-43.5321, 172.6362], 5);
      this.map.attributionControl.setPrefix(false); // remove Leaflet-Log

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);
  }


    private addMarker(location: LocationComponent): void {
      const marker = L.marker([location.coordinates.x, location.coordinates.y], {
        icon: this.getCustomIcon(location.sign)
      }).addTo(this.map);

      marker.bindTooltip(location.hoverTitle, {
          permanent: false,
          direction: 'top',
          offset: [0, -30],
          opacity: 0.9,
          className: 'custom-tooltip'  //todo Eigene CSS-Klasse
        });

       if (location.relation) {
            marker.on('click', () => {
              this.router.navigate(['/article', this.toSlug(location.relation!.title)]);
            });

            marker.on('popupopen', () => {
              const linkElement = document.getElementById(`link-${location.id}`);
              if (linkElement) {
                linkElement.addEventListener('click', (e) => {
                  e.preventDefault();
                  this.router.navigate(['/tage', location.relation!.title]);
                });
              }
            });
          }
      }

    private addRoute(route: RouteComponent): void {
      const latlngs: L.LatLngExpression[] = route.coordinates.map(coord =>
        [coord.x, coord.y] as L.LatLngExpression
      );

      const style = this.getLineStyle(route.lineStyle);

      L.polyline(latlngs, {
        color: 'blue',
        weight: 3,
        opacity: 0.7,
        ...style
      }).addTo(this.map);
    }

    private getLineStyle(lineStyle?: string): L.PolylineOptions {
      switch(lineStyle) {
        case 'Gestrichelt':
          return { dashArray: '10, 10' };

        case 'Gepunktet':
          return { dashArray: '2, 8' };

        case 'solid':
        default:
          return { dashArray: undefined };  // Durchgezogen
      }
    }

    private getCustomIcon(signArt: string): L.Icon {
      let iconUrl: string;

        switch(signArt) {
          case 'Wandern':
            iconUrl = 'marker/hiking.png';
            break;
          case 'Hobbit':
            iconUrl = 'marker/hobbit.png';
            break;
          case 'Essen':
            iconUrl = 'marker/food.png';
            break;
          case 'Parken':
            iconUrl = 'marker/sleeping.png';
            break;
          case 'Sehenswürdigkeit':
            iconUrl = 'marker/default.png';
            break;
          default:
            iconUrl = 'marker/default.png';
        }
      return L.icon({
        iconUrl: iconUrl,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34]
      });
    }

    private isLocationComponent(component: MapComponent): component is LocationComponent {
      return (component as LocationComponent).type === 'location';
    }

    private isRouteComponent(component: MapComponent): component is RouteComponent {
      return (component as RouteComponent).type === 'route';
    }

  toSlug(title: string): string {
    return toSlug(title)
  }
}
