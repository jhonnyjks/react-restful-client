import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/atoms/Button';
import { useApiMutation } from '@/hooks/useApiMutation';
import { logout } from '@/services/api/auth';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/utils/cn';

export function Topbar() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const perfis = useAuthStore((state) => state.perfis);
  const clearSession = useAuthStore((state) => state.clearSession);

  const perfisLabel = useMemo(() => perfis.map((perfil) => perfil.nome).join(', '), [perfis]);

  const logoutMutation = useApiMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear();
      clearSession();
      navigate('/login', { replace: true });
    },
  });

  return (
    <header className="flex items-center justify-between rounded-3xl border border-secondary-300 bg-white/70 px-6 py-4 shadow-soft backdrop-blur-xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Bem-vindo de volta, {user?.nome ?? 'Operador(a)'}</h1>
        <p className="text-sm text-slate-500">
          Perfis vinculados: <span className="font-semibold text-slate-700">{perfisLabel || '—'}</span>
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-500/10 text-lg font-bold text-primary-600">
          {user?.nome?.[0]?.toUpperCase() ?? 'U'}
        </div>
        <div className="text-right text-sm">
          <p className="font-semibold text-slate-800">{user?.nome}</p>
          <p className="text-slate-500">{user?.email}</p>
        </div>
        <Button
          variant="ghost"
          className={cn('border border-secondary-300 bg-white text-sm font-semibold text-slate-700')}
          onClick={() => logoutMutation.mutate()}
          loading={logoutMutation.isPending}
        >
          Sair
        </Button>
      </div>
    </header>
  );
}

