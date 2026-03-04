'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import type { BookFiltersResponse } from '@bookbot/book-utils';

interface FiltersProps {
  filters: BookFiltersResponse;
}

export default function Filters({ filters }: FiltersProps) {
  const t = useTranslations('filters');
  const router = useRouter();
  const searchParams = useSearchParams();

  function toggleFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    const current = params.get(key)?.split(',').filter(Boolean) ?? [];

    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];

    if (updated.length) {
      params.set(key, updated.join(','));
    } else {
      params.delete(key);
    }
    params.set('page', '1');
    router.push(`/?${params.toString()}`);
  }

  function isActive(key: string, value: string) {
    return searchParams.get(key)?.split(',').includes(value) ?? false;
  }

  function toggleInStock() {
    const params = new URLSearchParams(searchParams.toString());
    if (params.get('inStock') === 'true') {
      params.delete('inStock');
    } else {
      params.set('inStock', 'true');
    }
    params.set('page', '1');
    router.push(`/?${params.toString()}`);
  }

  function clearAll() {
    router.push('/');
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-lg">{t('title')}</h2>
        {searchParams.toString() && (
          <button
            onClick={clearAll}
            className="text-xs text-blue-600 hover:underline"
          >
            {t('clearAll')}
          </button>
        )}
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={searchParams.get('inStock') === 'true'}
            onChange={toggleInStock}
          />
          {t('inStockOnly')}
        </label>
      </div>

      <FilterSection
        title={t('language')}
        options={filters.languages}
        filterKey="languages"
        isActive={isActive}
        onToggle={toggleFilter}
      />

      <FilterSection
        title={t('binding')}
        options={filters.bindings}
        filterKey="bindings"
        isActive={isActive}
        onToggle={toggleFilter}
      />

      <FilterSection
        title={t('condition')}
        options={filters.conditions}
        filterKey="conditions"
        isActive={isActive}
        onToggle={toggleFilter}
      />

      {filters.authors.length > 0 && (
        <div>
          <h3 className="font-semibold text-sm mb-2">{t('authors')}</h3>
          {filters.authors.map((author) => (
            <label
              key={author.id}
              className="flex items-center gap-2 text-sm cursor-pointer py-0.5"
            >
              <input
                type="checkbox"
                checked={isActive('authorIds', String(author.id))}
                onChange={() => toggleFilter('authorIds', String(author.id))}
              />
              {author.name}
              <span className="text-gray-400 text-xs">({author.count})</span>
            </label>
          ))}
        </div>
      )}

      {filters.publishers.length > 0 && (
        <div>
          <h3 className="font-semibold text-sm mb-2">{t('publishers')}</h3>
          {filters.publishers.map((pub) => (
            <label
              key={pub.id}
              className="flex items-center gap-2 text-sm cursor-pointer py-0.5"
            >
              <input
                type="checkbox"
                checked={isActive('publisherIds', String(pub.id))}
                onChange={() => toggleFilter('publisherIds', String(pub.id))}
              />
              {pub.name}
              <span className="text-gray-400 text-xs">({pub.count})</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

function FilterSection({
  title,
  options,
  filterKey,
  isActive,
  onToggle,
}: {
  title: string;
  options: { code: string; count: number }[];
  filterKey: string;
  isActive: (key: string, value: string) => boolean;
  onToggle: (key: string, value: string) => void;
}) {
  if (options.length === 0) return null;

  return (
    <div>
      <h3 className="font-semibold text-sm mb-2">{title}</h3>
      {options.map((opt) => (
        <label
          key={opt.code}
          className="flex items-center gap-2 text-sm cursor-pointer py-0.5"
        >
          <input
            type="checkbox"
            checked={isActive(filterKey, opt.code)}
            onChange={() => onToggle(filterKey, opt.code)}
          />
          {opt.code}
          <span className="text-gray-400 text-xs">({opt.count})</span>
        </label>
      ))}
    </div>
  );
}

