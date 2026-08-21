import { useEffect, useMemo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { useAuthStore } from '@/store/authStore';

type NavItem = {
  label: string;
  to: string;
  icon: React.ReactNode;
  permission?: string;
};

const allNavItems: NavItem[] = [
  {
    label: 'Usuários',
    to: '/usuarios',
    permission: 'manter-usuarios',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M7.15381 4C4.94467 4 3.15381 5.79086 3.15381 8C3.15381 10.2091 4.94467 12 7.15381 12C9.36295 12 11.1538 10.2091 11.1538 8C11.1538 5.79086 9.36295 4 7.15381 4ZM5.15381 8C5.15381 6.89543 6.04924 6 7.15381 6C8.25838 6 9.15381 6.89543 9.15381 8C9.15381 9.10457 8.25838 10 7.15381 10C6.04924 10 5.15381 9.10457 5.15381 8Z"
          fill="currentColor"
          fillOpacity="0.96"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M17.1538 4C14.9447 4 13.1538 5.79086 13.1538 8C13.1538 10.2091 14.9447 12 17.1538 12C19.3629 12 21.1538 10.2091 21.1538 8C21.1538 5.79086 19.3629 4 17.1538 4ZM15.1538 8C15.1538 6.89543 16.0492 6 17.1538 6C18.2584 6 19.1538 6.89543 19.1538 8C19.1538 9.10457 18.2584 10 17.1538 10C16.0492 10 15.1538 9.10457 15.1538 8Z"
          fill="currentColor"
          fillOpacity="0.96"
        />
        <path
          d="M10.7536 15.1994C10.3496 15.7373 10.0117 16.3278 9.75216 16.9588C9.05317 16.361 8.14565 16 7.15381 16C4.94467 16 3.15381 17.7909 3.15381 20H1.15381C1.15381 16.6863 3.8401 14 7.15381 14C8.50446 14 9.75088 14.4463 10.7536 15.1994Z"
          fill="currentColor"
          fillOpacity="0.96"
        />
        <path
          d="M17.1538 16C14.9447 16 13.1538 17.7909 13.1538 20H11.1538C11.1538 16.6863 13.8401 14 17.1538 14C20.4675 14 23.1538 16.6863 23.1538 20H21.1538C21.1538 17.7909 19.3629 16 17.1538 16Z"
          fill="currentColor"
          fillOpacity="0.96"
        />
      </svg>
    ),
  },
  {
    label: 'Perfis',
    to: '/perfis',
    permission: 'manter-perfis',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
        <path
          d="M12 2L13.41 3.41L7.83 9L20 9L20 11L7.83 11L13.41 16.59L12 18L4.7071 10.7071C4.31658 10.3166 4.31658 9.68342 4.70711 9.29289L12 2Z"
          fill="currentColor"
          fillOpacity="0.96"
        />
      </svg>
    ),
  },
];

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const permissoes = useAuthStore((state) => state.permissoes);

  const navItems = useMemo(() => {
    return allNavItems.filter((item) => {
      if (!item.permission) {
        return true;
      }
      return permissoes.includes(item.permission);
    });
  }, [permissoes]);

  useEffect(() => {
    if (isOpen) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <>
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-menu-width flex-col border-r border-border bg-surface transition-transform duration-300 lg:static lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
      >
        <div className="flex h-16 items-center justify-center border-b border-border">
          <div className="flex h-10 w-10 items-center justify-center rounded-medium bg-primary-500 text-sm font-bold text-white">
            AL
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'ripple group relative flex flex-col items-center justify-center gap-1 rounded-medium p-3 text-xs font-medium transition-colors',
                  isActive
                    ? 'bg-primary-500 text-content-on-color'
                    : 'text-content-subtle hover:bg-surface-subtle-on-subtle hover:text-content',
                )
              }
              title={item.label}
            >
              <span className={cn('transition-opacity', !item.icon && 'text-lg')}>{item.icon || '📋'}</span>
              <span className="line-clamp-1 text-[10px]">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-border p-2">
          <button
            className="ripple group relative flex flex-col items-center justify-center gap-1 rounded-medium p-3 text-xs font-medium text-content-subtle transition-colors hover:bg-surface-subtle-on-subtle hover:text-content"
            title="Ajuda"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
              <path
                d="M13.1543 8.26795C12.773 8.04782 12.3298 7.95965 11.8932 8.01711C11.4567 8.07458 11.0514 8.27447 10.7401 8.58579C10.4288 8.89711 10.2289 9.30245 10.1714 9.73895C10.1452 9.93785 10.1493 10.1381 10.1823 10.3333L8.21025 10.6667C8.14426 10.2763 8.13615 9.87567 8.18852 9.4779C8.30346 8.6049 8.70324 7.79421 9.32587 7.17158C9.94851 6.54894 10.7592 6.14916 11.6322 6.03422C12.5052 5.91929 13.3917 6.09563 14.1543 6.5359C14.9169 6.97617 15.5129 7.65576 15.8498 8.46927C16.1868 9.28278 16.2459 10.1847 16.018 11.0353C15.7901 11.8858 15.2879 12.6374 14.5893 13.1734C14.1666 13.4978 13.7901 13.8134 13.5196 14.1449C13.2533 14.4713 13.1543 14.7347 13.1543 14.9635V15H11.1543V14.9635C11.1543 14.1079 11.5383 13.4096 11.97 12.8805C12.3976 12.3564 12.9342 11.9225 13.3718 11.5867C13.7211 11.3187 13.9722 10.9429 14.0862 10.5176C14.2001 10.0924 14.1705 9.64139 14.0021 9.23464C13.8336 8.82788 13.5356 8.48809 13.1543 8.26795Z"
                fill="currentColor"
                fillOpacity="0.96"
              />
              <path
                d="M13.1543 18V16H11.1543V18H13.1543Z"
                fill="currentColor"
                fillOpacity="0.96"
              />
              <path
                d="M12.1543 22C17.6771 22 22.1543 17.5228 22.1543 12C22.1543 6.47715 17.6771 2 12.1543 2C6.63145 2 2.1543 6.47715 2.1543 12C2.1543 17.5228 6.63145 22 12.1543 22ZM12.1543 20C7.73602 20 4.1543 16.4183 4.1543 12C4.1543 7.58172 7.73602 4 12.1543 4C16.5726 4 20.1543 7.58172 20.1543 12C20.1543 16.4183 16.5726 20 12.1543 20Z"
                fill="currentColor"
                fillOpacity="0.96"
              />
            </svg>
            <span className="line-clamp-1 text-[10px]">Ajuda</span>
          </button>
        </div>
      </aside>
    </>
  );
}
