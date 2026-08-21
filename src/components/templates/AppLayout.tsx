import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/organisms/Sidebar';
import { Header } from '@/components/organisms/Header';

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-surface-subtle">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
