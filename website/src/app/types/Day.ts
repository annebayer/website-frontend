export interface Picture {
  Beschreibung: string | null;
  file: {
    url: string;
    formats?: {
      thumbnail?: { url: string };
      small?: { url: string };
      medium?: { url: string };
      large?: { url: string };
    };
  };
}

export interface Day {
  id: number;
  title: string;
  dateFrom: Date;
  dateTo?: Date | null;
  highlight: string;
  description?: {
    type: string;
    children: { type: string; text: string }[];
  }[] | null;
  pictures: Picture[];
}
