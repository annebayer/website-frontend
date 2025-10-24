export interface MediaFile {
  url: string;
  name?: string;
  alternativeText?: string;
  description?: string;
  caption?: string;
  formats?: {
    thumbnail?: { url: string };
    small?: { url: string };
    medium?: { url: string };
    large?: { url: string };
  };
}

export interface RichTextBlock {
  type: string;
  children: { type: string; text: string }[];
}

export interface BilderMitTextComponent {
  __component: 'shared.bilder-mit-text';
  type: string;
  Beschreibung: string | null;
  Bilder: MediaFile[];
}

export interface TipComponent {
  __component: 'shared.tip';
  type: string;
  text: string;
  icon?: 'Ausrufezeichen' | 'Fragezeichen' | 'Smiley' | null;
  bild?: MediaFile | null;
}

export interface AusfluegeBild {
  Beschreibung: string | null;
  Bilder: MediaFile[];
}
export interface AusfluegeComponent {
  __component: 'shared.ausfluege';
  type: string;
  id: string;
  title: string;
  description: string;
  Bilder: AusfluegeBild[];
  tip: TipComponent | null;
}

export type PictureComponent =
  | BilderMitTextComponent
  | TipComponent
  | AusfluegeComponent;

export interface Day {
  id: string;
  title: string;
  teaserBild?: {
    id: string
    alternativeText: string
    url: string
    }
  dateFrom: string;
  dateTo?: string | null;
  description: RichTextBlock[] | null;
  descriptionShort?: string | null;
  Highlights?: string | null;
  pictures: PictureComponent[];
}
