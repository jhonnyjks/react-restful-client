import { useMutation } from '@tanstack/react-query';
import type { UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import { useToast } from './useToast';
import { parseApiError } from '@/utils/error';

export function useApiMutation<TData = unknown, TError = unknown, TVariables = void, TContext = unknown>(
  options: UseMutationOptions<TData, TError, TVariables, TContext>,
  feedback?: { successMessage?: string; errorMessage?: string },
): UseMutationResult<TData, TError, TVariables, TContext> {
  const toast = useToast();
  const { onSuccess, onError, ...rest } = options;

  return useMutation({
    ...rest,
    onSuccess: (data, variables, context, mutation) => {
      if (feedback?.successMessage) {
        toast.success({
          title: feedback.successMessage,
        });
      }
      onSuccess?.(data, variables, context, mutation);
    },
    onError: (error, variables, context, mutation) => {
      const parsed = parseApiError(error);
      
      // Se há uma mensagem específica do erro (não é a mensagem padrão), usa ela como título
      const hasSpecificMessage = parsed.message !== 'Ocorreu um erro inesperado. Tente novamente.';
      
      let errorTitle: string;
      let errorDescription: string | undefined;

      if (hasSpecificMessage) {
        // Se há mensagem específica, usa ela como título
        errorTitle = parsed.message;
        
        // Se há múltiplos detalhes, mostra todos no description
        if (parsed.details && parsed.details.length > 1) {
          errorDescription = parsed.details
            .map((d) => `${d.field ? `${d.field}: ` : ''}${d.message}`)
            .join('\n');
        }
      } else if (parsed.details && parsed.details.length > 0) {
        // Se não há mensagem específica mas há detalhes, usa o primeiro como título
        errorTitle = parsed.details[0].message;
        
        // Se há múltiplos detalhes, mostra os restantes no description
        if (parsed.details.length > 1) {
          errorDescription = parsed.details
            .slice(1)
            .map((d) => `${d.field ? `${d.field}: ` : ''}${d.message}`)
            .join('\n');
        }
      } else {
        // Fallback para mensagem de feedback ou padrão
        errorTitle = feedback?.errorMessage ?? 'Ocorreu um erro na operação.';
      }

      toast.error({
        title: errorTitle,
        description: errorDescription,
      });
      onError?.(error, variables, context, mutation);
    },
  });
}

