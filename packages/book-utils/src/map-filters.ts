import type { BookFiltersResponse } from './types.js';

export interface RawFiltersInput {
  languageGroups: { language: string; count: number }[];
  bindingGroups: { binding: string; count: number }[];
  conditionGroups: { condition: string; count: number }[];
  priceRange: {
    min: number | { toNumber(): number } | null;
    max: number | { toNumber(): number } | null;
  };
  yearRange: {
    min: number | null;
    max: number | null;
  };
  authorEditionCounts: {
    author: { id: number; name: string; slug: string };
    count: number;
  }[];
  publisherEditionCounts: {
    publisher: { id: number; name: string };
    count: number;
  }[];
}

export function mapFilters(raw: RawFiltersInput): BookFiltersResponse {
  const { min: minPrice, max: maxPrice } = raw.priceRange;

  return {
    languages: raw.languageGroups.map((g) => ({
      code: g.language,
      count: g.count,
    })),
    bindings: raw.bindingGroups.map((g) => ({
      code: g.binding,
      count: g.count,
    })),
    conditions: raw.conditionGroups.map((g) => ({
      code: g.condition,
      count: g.count,
    })),
    authors: raw.authorEditionCounts.map((g) => ({
      id: g.author.id,
      name: g.author.name,
      slug: g.author.slug,
      count: g.count,
    })),
    publishers: raw.publisherEditionCounts.map((g) => ({
      id: g.publisher.id,
      name: g.publisher.name,
      count: g.count,
    })),
    priceRange:
      minPrice !== null && maxPrice !== null
        ? {
            min:
              typeof minPrice === 'number' ? minPrice : minPrice.toNumber(),
            max:
              typeof maxPrice === 'number' ? maxPrice : maxPrice.toNumber(),
          }
        : null,
    yearRange:
      raw.yearRange.min !== null && raw.yearRange.max !== null
        ? { min: raw.yearRange.min, max: raw.yearRange.max }
        : null,
  };
}

