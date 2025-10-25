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
      [-47.5, 166.0],
      [-34.0, 179.0]
    ];

    L.imageOverlay(
      'https://upload.wikimedia.org/wikipedia/commons/2/21/New_Zealand_location_map.svg',
      bounds
    ).addTo(this.map);

    // Marker mit echten Koordinaten
    this.addMarker(-36.8485, 174.7633, 'Auckland');
  }

  // Marker hinzufügen
  addMarker(lat: number, lng: number, label: string): void {
    const marker = L.marker([lat, lng], {
      icon: L.icon({
        iconUrl: 'assets/marker-icon.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34]
      })
    });

    marker.bindPopup(label);
    marker.addTo(this.map);
  }

  // Punkte verbinden
  connectPoints(points: [number, number][]): void {
    const polyline = L.polyline(points, {
      color: 'red',
      weight: 3,
      opacity: 0.7
    });

    polyline.addTo(this.map);
  }
}
