import Link from 'next/link';
import type { BookListItemResponse } from '@bookbot/book-utils';

export default function BookCard({ book }: { book: BookListItemResponse }) {
  return (
    <Link
      href={`/books/${book.slug}`}
      className="block border rounded-lg p-4 hover:shadow-md transition-shadow"
    >
      <h2 className="font-semibold text-lg truncate">{book.name}</h2>
      <p className="text-sm text-gray-500 mt-1">
        {book.authors.map((a) => a.name).join(', ')}
      </p>
      <div className="flex items-center gap-2 mt-2 text-sm text-gray-400">
        {book.languages.join(', ')} · {book.bindings.join(', ')}
      </div>
      <div className="flex items-center justify-between mt-3">
        {book.minPrice !== null ? (
          <span className="font-bold">
            {book.minPrice === book.maxPrice
              ? `${book.minPrice} Kč`
              : `${book.minPrice}–${book.maxPrice} Kč`}
          </span>
        ) : (
          <span className="text-gray-400">—</span>
        )}
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded ${
            book.inStock
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-500'
          }`}
        >
          {book.inStock ? `Skladem (${book.availableCount})` : 'Vyprodáno'}
        </span>
      </div>
    </Link>
  );
}

