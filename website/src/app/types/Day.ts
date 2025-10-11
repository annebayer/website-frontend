export interface Picture {
  url: string;
  description: string | null;
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
