import { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { QueryKey, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { useToast } from './useToast';
import { parseApiError } from '@/utils/error';

export function useApiQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
  feedback?: { successMessage?: string; errorMessage?: string },
): UseQueryResult<TData, TError> {
  const toast = useToast();
  const lastErrorRef = useRef<unknown>(null);

  const query = useQuery<TQueryFnData, TError, TData, TQueryKey>({
    ...options,
    retry: options.retry ?? 1,
  });

  useEffect(() => {
    if (query.isError) {
      if (lastErrorRef.current !== query.error) {
        lastErrorRef.current = query.error;
        const parsedError = parseApiError(query.error);
        toast.error({
          title: feedback?.errorMessage ?? 'Não foi possível carregar os dados.',
          description: parsedError.message,
        });
      }
    } else {
      lastErrorRef.current = null;
    }
  }, [feedback?.errorMessage, query.error, query.isError, toast]);

  const shouldBlockWithLoading = query.isLoading || query.isFetching;

  return {
    ...query,
    isLoading: shouldBlockWithLoading,
  } as UseQueryResult<TData, TError>;
}

