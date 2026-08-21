import { useApiMutation } from '@/hooks/useApiMutation';
import { sendLoginCode } from '@/services/api/auth';

export function useSendLoginCode() {
  return useApiMutation(
    {
      mutationFn: (email: string) => sendLoginCode({ email }),
    },
    {
      successMessage: 'Código enviado! Verifique seu e-mail.',
      errorMessage: 'Erro ao enviar código',
    },
  );
}

