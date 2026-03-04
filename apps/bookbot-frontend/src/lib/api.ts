import type {
  BookListResponse,
  BookDetailResponse,
  BookFiltersResponse,
} from '@bookbot/book-utils';
import { config } from './config';

const API_BASE = config.apiUrl;

export async function fetchBooks(
  params?: Record<string, string>,
): Promise<BookListResponse> {
  const query = params ? '?' + new URLSearchParams(params).toString() : '';
  const res = await fetch(`${API_BASE}/books${query}`);
  if (!res.ok) throw new Error('Failed to fetch books');
  return res.json();
}

export async function fetchBook(slug: string): Promise<BookDetailResponse> {
  const res = await fetch(`${API_BASE}/books/${slug}`);
  if (!res.ok) throw new Error('Failed to fetch book');
  return res.json();
}

export async function fetchFilters(): Promise<BookFiltersResponse> {
  const res = await fetch(`${API_BASE}/books/filters`);
  if (!res.ok) throw new Error('Failed to fetch filters');
  return res.json();
}

