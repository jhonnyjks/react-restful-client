import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Spinner } from '@/components/atoms/Spinner';
import { useAuthHydrated } from '@/hooks/useAuthHydrated';
import { useAuthStore } from '@/store/authStore';

export function ProtectedRoute() {
  const location = useLocation();
  const hydrated = useAuthHydrated();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-subtle">
        <Spinner className="h-8 w-8 text-primary-500" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
