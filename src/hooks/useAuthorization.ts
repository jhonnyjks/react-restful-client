import { useAuthStore } from '@/store/authStore';

export function useAuthorization() {
  const permissoes = useAuthStore((state) => state.permissoes);

  const hasPermission = (permission: string | string[]) => {
    if (Array.isArray(permission)) {
      return permission.every((item) => permissoes.includes(item));
    }
    return permissoes.includes(permission);
  };

  return {
    permissoes,
    hasPermission,
  };
}
