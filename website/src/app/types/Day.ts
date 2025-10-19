export interface MediaFile {
  id: number;
  url: string;
  name?: string;
  alternativeText?: string;
  caption?: string;
  formats?: {
    thumbnail?: { url: string };
    small?: { url: string };
    medium?: { url: string };
    large?: { url: string };
  };
}

export interface Picture {
  id: number;
  url: string;
  name?: string;
  alternativeText?: string;
  description?: string;
}

export interface RichTextBlock {
  type: string;
  children: { type: string; text: string }[];
}

export interface BilderMitTextComponent {
  __component: 'shared.bilder-mit-text';
  id: number;
  url: string;
  Beschreibung: string | null;
  Bilder: MediaFile[];
}

export interface MediaComponent {
  __component: 'shared.media';
  id: number;
  url: string;
  Beschreibung: string | null;
  file: MediaFile;
}

export interface TipComponent {
  __component: 'shared.tip';
  id: number;
  url: string;
  Text: string;
  Icon: string | null;
  Bild: MediaFile | null;
}

export interface AusfluegeComponent {
  __component: 'shared.ausfluege';
  id: number;
  title: string;
  url: string;
  description: string;
  Bilder: { id: number; Beschreibung: string | null }[];
  tip: {
    id: number;
    Text: string;
    Icon: string | null;
  };
}

export type PictureComponent =
  | MediaComponent
  | BilderMitTextComponent
  | TipComponent
  | AusfluegeComponent;

export interface Day {
  id: number;
  title: string;
  dateFrom: string;
  dateTo?: string;
  description: any[];
  descriptionShort?: string;
  pictures: Picture[];
}
