import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  standalone: true,
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {
  private map!: L.Map;

  // Neuseeland Grenzen für die SVG
  private bounds: L.LatLngBoundsExpression = [
    [-47.5, 166.0], // Süd-West
    [-34.0, 179.0]  // Nord-Ost
  ];

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('map').setView([-41.0, 173.0], 6);

    // SVG als ImageOverlay mit echten Koordinaten
    const bounds: L.LatLngBoundsExpression = [
      [-48.3, 165.8],
      [-34.1, 179.5]
    ];

    L.imageOverlay(
      'https://upload.wikimedia.org/wikipedia/commons/2/21/New_Zealand_location_map.svg',
      bounds
    ).addTo(this.map);

    // === NORDINSEL Städte ===
    this.addMarker(-36.5057, 174.4555, 'Auckland', 'blue');
    this.addMarker(-37.4700, 175.1700, 'Hamilton', 'green');
    this.addMarker(-38.1368, 176.2497, 'Rotorua', 'orange');
    this.addMarker(-39.9333, 175.0568, 'Whanganui', 'purple');
    this.addMarker(-41.2865, 174.7762, 'Wellington', 'red');

    // === SÜDINSEL Städte ===
    this.addMarker(-41.2708, 173.2804, 'Nelson', 'teal');
    this.addMarker(-43.5321, 172.6362, 'Christchurch', 'darkblue');
    this.addMarker(-44.2335, 171.1503, 'Timaru', 'brown');
    this.addMarker(-45.0152, 168.3945, 'Queenstown', 'gold');
    this.addMarker(-45.5227, 170.3013, 'Dunedin', 'darkred');

    // === ROUTE 1: Nordinsel (Auckland → Wellington) ===
    this.connectPoints([
      [-36.8485, 174.7633], // Auckland
      [-37.7870, 175.2793], // Hamilton
      [-38.1368, 176.2497], // Rotorua
      [-39.9333, 175.0500], // Whanganui
      [-41.2865, 174.7762]  // Wellington
    ], 'blue', 'Nordinsel Route');

    // === ROUTE 2: Südinsel Ostküste ===
    this.connectPoints([
      [-41.5100, 173.9550], // Nelson
      [-43.5321, 172.6362], // Christchurch
      [-44.4030, 171.2500], // Timaru
      [-45.8788, 170.5028]  // Dunedin
    ], 'red', 'Ostküste Route');

    // === ROUTE 3: Queenstown nach Dunedin ===
    this.connectPoints([
      [-45.0152, 168.3945], // Queenstown
      [-45.8788, 170.5028]  // Dunedin
    ], 'green', 'Inland Route', true); // gestrichelte Linie

    // === Zusätzliche Features ===

    // Kreis um Auckland (z.B. 100km Radius)
    this.addCircle(-36.8485, 174.7633, 100000, 'Auckland Region');

    // Bereich markieren (z.B. Nationalpark)
    this.addPolygon([
      [-37.5, 175.5],
      [-37.8, 175.5],
      [-37.8, 175.8],
      [-37.5, 175.8]
    ], 'Tongariro National Park');
  }

  // Marker hinzufügen mit Farboption
  addMarker(lat: number, lng: number, label: string, color: string = 'blue'): void {
    // Custom HTML Icon mit Farbe
    const marker = L.marker([lat, lng], {
      icon: L.divIcon({
        className: 'custom-marker',
        html: `<div style="
          background-color: ${color};
          width: 15px;
          height: 15px;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 0 4px rgba(0,0,0,0.5);
        "></div>`,
        iconSize: [15, 15],
        iconAnchor: [7.5, 7.5]
      })
    });

    marker.bindPopup(`<b>${label}</b><br>Lat: ${lat.toFixed(4)}<br>Lng: ${lng.toFixed(4)}`);
    marker.addTo(this.map);
  }

  // Punkte verbinden mit erweiterten Optionen
  connectPoints(
    points: [number, number][],
    color: string = 'red',
    label?: string,
    dashed: boolean = false
  ): void {
    const polyline = L.polyline(points, {
      color: color,
      weight: 3,
      opacity: 0.7,
      dashArray: dashed ? '10, 10' : undefined
    });

    if (label) {
      polyline.bindPopup(label);
    }

    polyline.addTo(this.map);
  }

  // Kreis hinzufügen (z.B. für Radius um Stadt)
  addCircle(lat: number, lng: number, radius: number, label: string): void {
    const circle = L.circle([lat, lng], {
      color: 'blue',
      fillColor: '#30a3ec',
      fillOpacity: 0.2,
      radius: radius // in Metern
    });

    circle.bindPopup(label);
    circle.addTo(this.map);
  }

  // Polygon/Bereich hinzufügen
  addPolygon(points: [number, number][], label: string): void {
    const polygon = L.polygon(points, {
      color: 'green',
      fillColor: '#90EE90',
      fillOpacity: 0.3
    });

    polygon.bindPopup(label);
    polygon.addTo(this.map);
  }
}
