export interface Coordinates {
  x: number;
  y: number;
}

export interface LocationComponent {
  type: 'location';
  id: string;
  hoverTitle: string;
  relation?: {
    title: string
  };
  sign: string;
  coordinates: Coordinates;
}

export interface RouteComponent {
  type: 'route';
  from?: string;
  to?: string;
  coordinates: Coordinates[];
  lineStyle: string
}

export type MapComponent = LocationComponent | RouteComponent;

export interface Map {
  id: string;
  locations: MapComponent[];
}
