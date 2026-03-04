export interface BookItemResponse {
  id: number;
  condition: string;
  price: number;
  status: string;
}

export interface BookEditionResponse {
  id: number;
  language: string;
  binding: string;
  yearPublished: number | null;
  pageCount: number | null;
  readingTimeMinutes: number | null;
  description: string | null;
  isbn: string | null;
  coverImageUrl: string | null;
  publisher: { id: number; name: string } | null;
  authors: { id: number; name: string; slug: string }[];
  items: BookItemResponse[];
  availableCount: number;
}

export interface BookDetailResponse {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  editions: BookEditionResponse[];
  inStock: boolean;
}

