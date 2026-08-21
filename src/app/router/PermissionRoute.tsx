import { Navigate, Outlet } from 'react-router-dom';
import { useAuthorization } from '@/hooks/useAuthorization';

type PermissionRouteProps = {
  permission: string;
  redirectTo?: string;
};

/**
 * Componente que protege rotas baseado em permissões
 * Redireciona para a home se o usuário não tiver a permissão necessária
 */
export function PermissionRoute({ permission, redirectTo = '/' }: PermissionRouteProps) {
  const { hasPermission } = useAuthorization();

  if (!hasPermission(permission)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}

