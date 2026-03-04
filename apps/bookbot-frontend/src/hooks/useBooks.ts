import { useQuery } from '@tanstack/react-query';
import { fetchBooks, fetchBook, fetchFilters } from '@/lib/api';

export function useBooks(params?: Record<string, string>) {
  return useQuery({
    queryKey: ['books', params],
    queryFn: () => fetchBooks(params),
  });
}

export function useBook(slug: string) {
  return useQuery({
    queryKey: ['book', slug],
    queryFn: () => fetchBook(slug),
    enabled: !!slug,
  });
}

export function useFilters() {
  return useQuery({
    queryKey: ['filters'],
    queryFn: fetchFilters,
    staleTime: 60_000 * 60, // 1 hour — filters rarely change
  });
}

