import { useNavigate, useLocation } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useApiMutation } from '@/hooks/useApiMutation';
import { login } from '@/services/api/auth';
import type { LoginPayload } from '@/services/api/auth';
import { useAuthStore } from '@/store/authStore';

type LocationState = {
  from?: {
    pathname: string;
  };
};

export function useLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const setSession = useAuthStore((state) => state.setSession);

  const mutation = useApiMutation({
    mutationFn: (payload: LoginPayload) => login(payload),
    onSuccess: (session) => {
      queryClient.clear();
      setSession(session);

      const state = location.state as LocationState | undefined;
      navigate(state?.from?.pathname ?? '/', { replace: true });
    },
  }, {
    successMessage: 'Sessão iniciada com sucesso.',
    errorMessage: 'Não foi possível autenticar.',
  });

  return mutation;
}
