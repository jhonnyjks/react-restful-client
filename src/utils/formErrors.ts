import type { FieldPath, FieldValues, UseFormSetError } from 'react-hook-form';
import type { ParsedApiError } from './error';

/**
 * Aplica erros de validação da API (422) nos campos do react-hook-form.
 * Retorna true se pelo menos um erro foi mapeado para um campo.
 */
export function applyParsedApiErrorsToForm<TFieldValues extends FieldValues>(
  parsed: ParsedApiError,
  setError: UseFormSetError<TFieldValues>,
  fieldMap: Record<string, FieldPath<TFieldValues>>,
): boolean {
  if (!parsed.details?.length) {
    return false;
  }

  let applied = false;

  parsed.details.forEach(({ field, message }) => {
    if (!field || !message) {
      return;
    }

    const formField = fieldMap[field];
    if (!formField) {
      return;
    }

    setError(formField, { type: 'server', message });
    applied = true;
  });

  return applied;
}
