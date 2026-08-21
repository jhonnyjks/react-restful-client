import { useCallback } from 'react';
import type { ChangeEvent } from 'react';

type MaskFunction = (value: string) => string;

/**
 * Hook para aplicar máscaras em inputs
 */
export function useMaskedInput(mask: MaskFunction) {
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>, onChange?: (value: string) => void) => {
      const maskedValue = mask(e.target.value);
      e.target.value = maskedValue;
      onChange?.(maskedValue);
    },
    [mask],
  );

  return handleChange;
}

