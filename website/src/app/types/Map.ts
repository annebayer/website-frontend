export interface Coordinates {
  x: number;
  y: number;
}

export interface LocationComponent {
  type: 'location';
  id: string;
  hoverTitle: string;
  relation?: string;
  sign: string;
  coordinates: Coordinates;
}

export interface RouteComponent {
  type: 'route';
  from?: string;
  to?: string;
  coordinates: Coordinates[];
}

export type MapComponent = LocationComponent | RouteComponent;

export interface Map {
  id: string;
  locations: MapComponent[];
}
