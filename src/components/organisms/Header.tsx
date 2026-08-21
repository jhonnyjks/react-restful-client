import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useApiMutation } from '@/hooks/useApiMutation';
import { logout } from '@/services/api/auth';
import { useAuthStore } from '@/store/authStore';
import { appConfig } from '@/utils/appConfig';

const pageTitles: Record<string, string> = {
  '/usuarios': 'Usuários',
  '/perfis': 'Perfis',
  '/': 'Início',
};

type HeaderProps = {
  onMenuClick: () => void;
};

export function Header({ onMenuClick }: HeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const clearSession = useAuthStore((state) => state.clearSession);

  const pageTitle = useMemo(() => {
    const path = location.pathname;
    if (path === '/') {
      return appConfig.appName;
    }
    if (path.startsWith('/usuarios/')) {
      return path.includes('/novo') ? 'Novo usuário' : 'Editar usuário';
    }
    if (path.startsWith('/perfis/')) {
      return path.includes('/novo') ? 'Novo perfil' : 'Editar perfil';
    }
    return pageTitles[path] || 'Painel Administrativo';
  }, [location.pathname]);

  const logoutMutation = useApiMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear();
      clearSession();
      navigate('/login', { replace: true });
    },
  });

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-surface px-4 sm:px-6">
      <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-4">
        <button
          onClick={onMenuClick}
          className="ripple flex h-10 w-10 shrink-0 items-center justify-center rounded-medium text-content-subtle transition-colors hover:bg-surface-subtle-on-subtle hover:text-content lg:hidden"
          aria-label="Abrir menu"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
            <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        {location.pathname !== '/' && (
          <button
            onClick={() => navigate(-1)}
            className="ripple hidden h-10 w-10 shrink-0 items-center justify-center rounded-medium text-content-subtle transition-colors hover:bg-surface-subtle-on-subtle hover:text-content sm:flex"
            aria-label="Voltar"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <path
                d="M6.29289 11.2928L14.2929 3.29285L15.7071 4.70706L8.41421 12L15.7071 19.2928L14.2929 20.7071L6.29289 12.7071C5.90237 12.3165 5.90237 11.6834 6.29289 11.2928Z"
                fill="currentColor"
                fillOpacity="0.96"
              />
            </svg>
          </button>
        )}
        <h1 className="truncate text-lg font-semibold text-content sm:text-xl">{pageTitle}</h1>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <button
          className="ripple flex items-center gap-1.5 rounded-medium px-2 py-2 text-sm font-medium text-content-subtle transition-colors hover:bg-surface-subtle-on-subtle hover:text-content sm:gap-2 sm:px-3"
          onClick={() => logoutMutation.mutate()}
          disabled={logoutMutation.isPending}
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
            <path
              d="M12 4L13.41 5.41L7.83 11L20 11L20 13L7.83 13L13.41 18.59L12 20L4.7071 12.7071C4.31658 12.3166 4.31658 11.6834 4.70711 11.2929L12 4Z"
              fill="currentColor"
              fillOpacity="0.64"
            />
          </svg>
          <span className="hidden sm:inline">Sair</span>
        </button>
      </div>
    </header>
  );
}

