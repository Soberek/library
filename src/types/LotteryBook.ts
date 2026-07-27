export interface LotteryBook {
  id: string;
  title: string;
  author: string;
  cover?: string;
  year?: number | null;
  subjects?: string[];
  rating?: number | null;
  openLibraryUrl?: string;
}

export interface BookLotteryFilters {
  subject: string;
  language: string;
  yearFrom: number | null;
  yearTo: number | null;
  requireCover: boolean;
}
