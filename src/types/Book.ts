export interface Book {
  id: string;
  title: string;
  author: string;
  read: string;
  overallPages: number;
  readPages?: number;
  cover: string;
  genre: string;
  rating: number;
  createdAt?: string;
}
