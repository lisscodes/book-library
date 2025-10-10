export interface Author {
  name: string;
}

export interface Book {
  id: number;
  title: string;
  authors: Author[];
  subjects: string[];
  formats: Record<string, string>;
  download_count: number;
}

export interface BooksState {
  books: Book[];
  isLoading: boolean;
  searchQuery: string;
  error: string | null;
}
