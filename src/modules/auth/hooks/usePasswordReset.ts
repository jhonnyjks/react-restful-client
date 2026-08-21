import { useNavigate } from 'react-router-dom';
import { useApiMutation } from '@/hooks/useApiMutation';
import { forgotPassword, resetPassword } from '@/services/api/auth';
import type { ForgotPasswordPayload, ResetPasswordPayload } from '@/services/api/auth';

export function useForgotPassword() {
  return useApiMutation(
    {
      mutationFn: (payload: ForgotPasswordPayload) => forgotPassword(payload),
    },
    {
      successMessage: 'Se o e-mail informado estiver cadastrado, você receberá um link de recuperação de senha.',
      errorMessage: 'Erro ao solicitar recuperação de senha.',
    },
  );
}

export function useResetPassword() {
  const navigate = useNavigate();

  return useApiMutation(
    {
      mutationFn: (payload: ResetPasswordPayload) => resetPassword(payload),
      onSuccess: () => {
        // Redireciona para login após redefinir senha
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 2000);
      },
    },
    {
      successMessage: 'Senha redefinida com sucesso! Redirecionando para login...',
      errorMessage: 'Erro ao redefinir senha.',
    },
  );
}
