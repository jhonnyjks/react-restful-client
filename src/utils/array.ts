export function ensureArray<T>(value: T[] | null | undefined): T[];
export function ensureArray(value: unknown): unknown[];
export function ensureArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) {
    return value as T[];
  }
  return [];
}

export function unwrapListResponse<T>(data: unknown): T[] {
  if (Array.isArray(data)) {
    return data;
  }

  if (data && typeof data === 'object' && Array.isArray((data as { data?: unknown }).data)) {
    return (data as { data: T[] }).data;
  }

  return [];
}
