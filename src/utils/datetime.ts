/**
 * Conversões de data/hora: API sempre em UTC (ISO com Z); UI sempre no fuso local do browser.
 */

function pad2(value: number): string {
  return String(value).padStart(2, '0');
}

/** Valor de `<input type="datetime-local">` → ISO UTC (`...Z`) para a API. */
export function localInputToUtcIso(localValue: string): string {
  if (!localValue) {
    return '';
  }

  const date = new Date(localValue);
  if (Number.isNaN(date.getTime())) {
    throw new Error('Data/hora inválida.');
  }

  return date.toISOString();
}

/** ISO da API → valor para `<input type="datetime-local">` no fuso local. */
export function utcIsoToLocalInput(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}T${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
}

/** ISO da API → texto legível no fuso local. */
export function formatLocalDateTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return iso;
  }

  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}
