import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  currentParams: Record<string, string>;
}

export default function Pagination({
  currentPage,
  totalPages,
  currentParams,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  function pageHref(page: number) {
    const params = new URLSearchParams(currentParams);
    params.set('page', String(page));
    return `/?${params.toString()}`;
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {currentPage > 1 && (
        <Link
          href={pageHref(currentPage - 1)}
          className="px-3 py-1 border rounded hover:bg-gray-100"
        >
          ←
        </Link>
      )}
      <span className="text-sm text-gray-600">
        {currentPage} / {totalPages}
      </span>
      {currentPage < totalPages && (
        <Link
          href={pageHref(currentPage + 1)}
          className="px-3 py-1 border rounded hover:bg-gray-100"
        >
          →
        </Link>
      )}
    </div>
  );
}

