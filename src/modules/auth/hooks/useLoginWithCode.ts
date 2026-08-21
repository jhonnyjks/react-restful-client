import { useNavigate, useLocation } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useApiMutation } from '@/hooks/useApiMutation';
import { loginWithCode } from '@/services/api/auth';
import { useAuthStore } from '@/store/authStore';

type LocationState = {
  from?: {
    pathname: string;
  };
};

export function useLoginWithCode() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const setSession = useAuthStore((state) => state.setSession);

  return useApiMutation(
    {
      mutationFn: (payload: { email: string; code: string }) => loginWithCode(payload),
      onSuccess: (data) => {
        queryClient.clear();
        setSession({
          token: data.token,
          token_type: data.token_type,
          user: data.user,
          perfis: data.perfis,
          permissoes: data.permissoes,
        });

        const state = location.state as LocationState | undefined;
        navigate(state?.from?.pathname ?? '/', { replace: true });
      },
    },
    {
      successMessage: 'Login realizado com sucesso!',
      errorMessage: 'Código inválido ou expirado',
    },
  );
}
