import type { ReactNode } from 'react';

type AppShellProps = {
  sidebar: ReactNode;
  header: ReactNode;
  children: ReactNode;
  overlay?: ReactNode;
};

/**
 * Casca estrutural reutilizável do painel autenticado.
 * A aplicação de domínio fornece navegação, cabeçalho e o conteúdo das rotas.
 */
export function AppShell({ sidebar, header, overlay, children }: AppShellProps) {
  return (
    <div className="flex min-h-screen bg-surface-subtle">
      {sidebar}
      {overlay}
      <div className="flex flex-1 flex-col overflow-hidden">
        {header}
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="w-full px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
