export type BookStatus = "W trakcie" | "Przeczytana" | "Porzucona";

export interface Book {
  id: string;
  title: string;
  author: string;
  read: BookStatus;
  overallPages: number;
  readPages?: number;
  cover?: string;
  genre: string;
  rating: number;
  createdAt?: string;
}

export type BookFormData = Omit<Book, "id" | "createdAt">;

export interface BookToAdd extends Omit<Book, "id"> {
  userId: string;
  createdAt: string;
}

export type BookUpdateData = Partial<Omit<Book, "id" | "createdAt">>;
