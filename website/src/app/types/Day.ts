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

export interface AusflugBild {
  description: string | null;
  bilder: MediaFile[];
}
//todo in AusflugComponent umändern + Groß/Kleinschreibung
export interface AusfluegeComponent {
  __component: 'shared.ausfluege';
  type: string;
  id: string;
  title: string;
  description: string;
  bilder: AusflugBild[];
  tip: TipComponent | null;
}

export interface QuestionAnswerComponent {
  __component: 'shared.frage-antwort';
  type: string
  question: string;
  answer: string;
  answerLong: string;
  bildQuestion?: MediaFile | null;
  bildAnswer?: MediaFile | null;
}

export type PictureComponent =
  | TipComponent
  | AusfluegeComponent
  | QuestionAnswerComponent;

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
  highlights?: string | null;
  pictures: PictureComponent[];
}
