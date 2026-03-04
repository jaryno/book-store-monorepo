'use client';

import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useBook } from '@/hooks/useBooks';
import Link from 'next/link';

export default function BookDetailPage() {
  const t = useTranslations();
  const { slug } = useParams<{ slug: string }>();
  const { data: book, isLoading, error } = useBook(slug);

  if (isLoading) {
    return <p className="text-center py-12 text-gray-500">{t('common.loading')}</p>;
  }

  if (error || !book) {
    return <p className="text-center py-12 text-red-500">{t('books.notFound')}</p>;
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <Link href="/" className="text-blue-600 hover:underline mb-4 block">
        {t('common.backToList')}
      </Link>

      <h1 className="text-3xl font-bold">{book.name}</h1>
      {book.description && (
        <p className="text-gray-600 mt-2">{book.description}</p>
      )}

      <span
        className={`inline-block mt-3 text-xs font-medium px-2 py-0.5 rounded ${
          book.inStock
            ? 'bg-green-100 text-green-700'
            : 'bg-red-100 text-red-500'
        }`}
      >
        {book.inStock ? t('books.inStock') : t('books.soldOut')}
      </span>

      <h2 className="text-xl font-semibold mt-8 mb-4">{t('books.editions')}</h2>
      <div className="space-y-4">
        {book.editions.map((edition) => (
          <div key={edition.id} className="border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">
                {edition.language} · {edition.binding}
                {edition.yearPublished && ` · ${edition.yearPublished}`}
              </h3>
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded ${
                  edition.availableCount > 0
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-500'
                }`}
              >
                {edition.availableCount > 0
                  ? t('books.inStockCount', { count: edition.availableCount })
                  : t('books.soldOut')}
              </span>
            </div>

            <p className="text-sm text-gray-500 mt-1">
              {edition.authors.map((a) => a.name).join(', ')}
            </p>
            {edition.publisher && (
              <p className="text-sm text-gray-400">
                {t('books.publisher', { name: edition.publisher.name })}
              </p>
            )}
            {edition.pageCount && (
              <p className="text-sm text-gray-400">
                {t('books.pages', { count: edition.pageCount })}
                {edition.readingTimeMinutes &&
                  ` · ${t('books.readingTime', { hours: Math.round(edition.readingTimeMinutes / 60) })}`}
              </p>
            )}

            {edition.items.length > 0 && (
              <div className="mt-3 space-y-1">
                {edition.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between text-sm bg-gray-50 rounded px-3 py-1"
                  >
                    <span>{item.condition}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold">{t('books.priceSingle', { price: item.price })}</span>
                      <span
                        className={
                          item.status === 'AVAILABLE'
                            ? 'text-green-600'
                            : 'text-gray-400'
                        }
                      >
                        {item.status === 'AVAILABLE' ? '✓' : '✗'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}

