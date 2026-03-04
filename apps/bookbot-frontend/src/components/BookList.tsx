'use client';

import { useTranslations } from 'next-intl';
import type { BookListItemResponse } from '@bookbot/book-utils';
import BookCard from './BookCard';

export default function BookList({ books }: { books: BookListItemResponse[] }) {
  const t = useTranslations('books');

  if (books.length === 0) {
    return (
      <p className="text-center text-gray-500 py-12">
        {t('noBooksFound')}
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}

