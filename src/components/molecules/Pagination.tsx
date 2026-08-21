import { Button } from '@/components/atoms/Button';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  itemLabel?: string;
};

function getPageWindow(currentPage: number, totalPages: number): Array<number | 'ellipsis'> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages: Array<number | 'ellipsis'> = [1];
  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  if (start > 2) {
    pages.push('ellipsis');
  }

  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }

  if (end < totalPages - 1) {
    pages.push('ellipsis');
  }

  pages.push(totalPages);

  return pages;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  itemLabel = 'itens',
}: PaginationProps) {
  if (totalItems === 0) {
    return null;
  }

  const safeTotalPages = Math.max(1, totalPages);
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);
  const pages = getPageWindow(currentPage, safeTotalPages);

  return (
    <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-content-subtle">
        Mostrando {startItem}-{endItem} de {totalItems} {itemLabel}
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Anterior
        </Button>

        {pages.map((page, index) =>
          page === 'ellipsis' ? (
            <span key={`ellipsis-${index}`} className="px-1 text-sm text-content-subtle">
              ...
            </span>
          ) : (
            <Button
              key={page}
              type="button"
              variant={page === currentPage ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => onPageChange(page)}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </Button>
          ),
        )}

        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === safeTotalPages}
        >
          Próxima
        </Button>
      </div>
    </div>
  );
}
