import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '@/components/templates/AppLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { PermissionRoute } from './PermissionRoute';
import { LoginPage } from '@/modules/auth/pages/LoginPage';
import { ForgotPasswordPage } from '@/modules/auth/pages/ForgotPasswordPage';
import { HomePage } from '@/app/pages/HomePage';
import { UsuariosListPage } from '@/modules/usuarios/pages/UsuariosListPage';
import { UsuarioFormPage } from '@/modules/usuarios/pages/UsuarioFormPage';
import { PerfisListPage } from '@/modules/perfis/pages/PerfisListPage';
import { PerfilFormPage } from '@/modules/perfis/pages/PerfilFormPage';
import { GruposListPage } from '@/modules/grupos/pages/GruposListPage';
import { ScattersListPage } from '@/modules/scatters/pages/ScattersListPage';
import { ScatterFormPage } from '@/modules/scatters/pages/ScatterFormPage';
import { ScatterScheduleStatsPage } from '@/modules/scatters/pages/ScatterScheduleStatsPage';

export const appRouter = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/recuperar-senha',
    element: <ForgotPasswordPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            index: true,
            element: <HomePage />,
          },
          {
            element: <PermissionRoute permission="manter-usuarios" />,
            children: [
              {
                path: '/usuarios',
                element: <UsuariosListPage />,
              },
              {
                path: '/usuarios/novo',
                element: <UsuarioFormPage />,
              },
              {
                path: '/usuarios/:id',
                element: <UsuarioFormPage />,
              },
            ],
          },
          {
            element: <PermissionRoute permission="manter-perfis" />,
            children: [
              {
                path: '/perfis',
                element: <PerfisListPage />,
              },
              {
                path: '/perfis/novo',
                element: <PerfilFormPage />,
              },
              {
                path: '/perfis/:id',
                element: <PerfilFormPage />,
              },
            ],
          },
          {
            element: <PermissionRoute permission="manter-grupos" />,
            children: [
              {
                path: '/grupos',
                element: <GruposListPage />,
              },
            ],
          },
          {
            element: <PermissionRoute permission="manter-scatters" />,
            children: [
              {
                path: '/scatters',
                element: <ScattersListPage />,
              },
              {
                path: '/scatters/novo',
                element: <ScatterFormPage />,
              },
              {
                path: '/scatters/:id',
                element: <ScatterFormPage />,
              },
              {
                path: '/scatters/:id/schedules/:scheduleId',
                element: <ScatterScheduleStatsPage />,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
