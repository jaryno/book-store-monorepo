'use client';

import { useSearchParams } from 'next/navigation';
import { useBooks, useFilters } from '@/hooks/useBooks';
import BookList from '@/components/BookList';
import Filters from '@/components/Filters';
import Pagination from '@/components/Pagination';
import { Suspense } from 'react';

function HomeContent() {
  const searchParams = useSearchParams();

  const query: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    query[key] = value;
  });

  const { data: books, isLoading: booksLoading, error: booksError } = useBooks(query);
  const { data: filters, isLoading: filtersLoading } = useFilters();

  if (booksLoading || filtersLoading) {
    return <p className="text-center py-12 text-gray-500">Načítání...</p>;
  }

  if (booksError || !books) {
    return <p className="text-center py-12 text-red-500">Chyba při načítání knih.</p>;
  }

  return (
    <div className="flex gap-8">
      <aside className="w-64 shrink-0 hidden md:block">
        {filters && <Filters filters={filters} />}
      </aside>
      <div className="flex-1">
        <p className="text-sm text-gray-500 mb-4">
          {books.meta.totalCount} knih nalezeno
        </p>
        <BookList books={books.data} />
        <Pagination
          currentPage={books.meta.page}
          totalPages={books.meta.totalPages}
          currentParams={query}
        />
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">BookBot</h1>
      <Suspense fallback={<p className="text-center py-12 text-gray-500">Načítání...</p>}>
        <HomeContent />
      </Suspense>
    </main>
  );
}
