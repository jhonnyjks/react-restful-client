import { isValidElement, type ReactNode, useEffect, useRef, useState } from 'react';
import { cn } from '@/utils/cn';

export type Column<T> = {
  header: string;
  accessor: (item: T, index: number) => ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
};

type DataTableProps<T> = {
  data: T[];
  columns: Column<T>[];
  emptyState?: ReactNode;
  keyExtractor?: (item: T, index: number) => string | number;
  className?: string;
};

const DEFAULT_COLUMN_WIDTH = '14rem';

function getColumnWidth(width?: string): string {
  return width || DEFAULT_COLUMN_WIDTH;
}

function extractText(value: ReactNode): string {
  if (value === null || value === undefined || typeof value === 'boolean') return '';
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (Array.isArray(value)) return value.map((item) => extractText(item)).join(' ').trim();
  if (!isValidElement<{ children?: ReactNode }>(value)) return '';
  return extractText(value.props.children).trim();
}

function hasInteractiveContent(value: ReactNode): boolean {
  if (value === null || value === undefined || typeof value === 'boolean') return false;
  if (typeof value === 'string' || typeof value === 'number') return false;
  if (Array.isArray(value)) return value.some((item) => hasInteractiveContent(item));
  if (!isValidElement<Record<string, unknown>>(value)) return false;

  const tag = typeof value.type === 'string' ? value.type : '';
  if (['button', 'a', 'input', 'select', 'textarea'].includes(tag)) return true;

  const props = value.props as { onClick?: unknown; children?: ReactNode };
  if (typeof props.onClick === 'function') return true;

  return hasInteractiveContent(props.children);
}

type TruncatedCellTextProps = {
  text: string;
  align?: 'left' | 'center' | 'right';
};

function TruncatedCellText({ text, align = 'left' }: TruncatedCellTextProps) {
  const textRef = useRef<HTMLSpanElement | null>(null);
  const [isOverflow, setIsOverflow] = useState(false);

  useEffect(() => {
    const evaluateOverflow = () => {
      if (!textRef.current) return;
      setIsOverflow(textRef.current.scrollWidth > textRef.current.clientWidth);
    };

    evaluateOverflow();
    window.addEventListener('resize', evaluateOverflow);
    return () => {
      window.removeEventListener('resize', evaluateOverflow);
    };
  }, [text]);

  const tooltipPositionClass = align === 'right'
    ? 'right-0'
    : align === 'center'
      ? 'left-1/2 -translate-x-1/2'
      : 'left-0';

  return (
    <div className="group relative min-w-0 max-w-full">
      <span ref={textRef} className="block truncate">
        {text}
      </span>
      {isOverflow ? (
        <div
          className={cn(
            'pointer-events-none absolute top-full z-30 mt-1 hidden max-w-[80vw] rounded-md border border-border bg-surface px-2 py-1 text-xs text-content shadow-lg group-hover:block',
            tooltipPositionClass,
          )}
        >
          {text}
        </div>
      ) : null}
    </div>
  );
}

export function DataTable<T>({
  data,
  columns,
  emptyState,
  keyExtractor,
  className,
}: DataTableProps<T>) {
  if (data.length === 0) {
    return <div className={cn('w-full', className)}>{emptyState}</div>;
  }

  return (
    <div
      className={cn(
        'w-full overflow-x-auto rounded-large border border-border bg-surface',
        'scrollbar-thin scrollbar-thumb-border scrollbar-track-surface-subtle',
        className,
      )}
      style={{ scrollbarWidth: 'thin' }}
    >
      <table className="divide-y divide-border" style={{ minWidth: '100%', width: 'max-content' }}>
          <thead className="bg-surface-subtle">
            <tr>
              {columns.map((column, idx) => (
                <th
                  key={idx}
                  className={cn(
                    'px-3 py-3 text-left text-xs font-medium text-content-subtle sm:px-4',
                    column.align === 'right' && 'text-right',
                    column.align === 'center' && 'text-center',
                  )}
                  style={{
                    width: getColumnWidth(column.width),
                    minWidth: getColumnWidth(column.width),
                    maxWidth: getColumnWidth(column.width),
                  }}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.map((item, rowIndex) => (
              <tr
                key={keyExtractor?.(item, rowIndex) ?? rowIndex}
                className="bg-surface transition-colors hover:bg-surface-subtle"
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className={cn(
                      'px-3 py-3 text-sm text-content sm:px-4',
                      column.align === 'right' && 'text-right',
                      column.align === 'center' && 'text-center',
                    )}
                    style={{
                      width: getColumnWidth(column.width),
                      minWidth: getColumnWidth(column.width),
                      maxWidth: getColumnWidth(column.width),
                    }}
                  >
                    {(() => {
                      const content = column.accessor(item, rowIndex);
                      const plainText = extractText(content);
                      const shouldTruncateWithTooltip =
                        Boolean(plainText) &&
                        (typeof content === 'string' || typeof content === 'number' || !hasInteractiveContent(content));

                      if (shouldTruncateWithTooltip) {
                        return <TruncatedCellText text={plainText} align={column.align} />;
                      }
                      return content;
                    })()}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
    </div>
  );
}

