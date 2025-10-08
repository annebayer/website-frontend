export interface Tag {
  id: number;
  Ueberschrift: string;
  Tage: string;
  Beschreibung?: {
    type: string;
    children: { type: string; text: string }[];
  }[] | null;
  TagBis?: string | null;
}
