import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type SessionUser = {
  id: number;
  nome: string;
  email: string;
};

export type SessionPerfil = {
  id: number;
  nome: string;
  label: string;
  padrao?: boolean;
};

export type SessionState = {
  token: string | null;
  tokenType: string | null;
  user: SessionUser | null;
  perfis: SessionPerfil[];
  permissoes: string[];
  isAuthenticated: boolean;
  setSession: (payload: {
    token: string;
    token_type?: string;
    user: SessionUser;
    perfis: SessionPerfil[];
    permissoes: string[];
  }) => void;
  updateSession: (payload: Partial<Pick<SessionState, 'token' | 'tokenType' | 'user' | 'perfis' | 'permissoes'>>) => void;
  clearSession: () => void;
};

export const useAuthStore = create<SessionState>()(
  persist(
    (set) => ({
      token: null,
      tokenType: null,
      user: null,
      perfis: [],
      permissoes: [],
      isAuthenticated: false,
      setSession: ({ token, token_type = 'Bearer', user, perfis, permissoes }) =>
        set({
          token,
          tokenType: token_type,
          user,
          perfis,
          permissoes,
          isAuthenticated: true,
        }),
      updateSession: (payload) =>
        set((state) => ({
          ...state,
          ...payload,
        })),
      clearSession: () =>
        set({
          token: null,
          tokenType: null,
          user: null,
          perfis: [],
          permissoes: [],
          isAuthenticated: false,
        }),
    }),
    {
      name: 'auth-session',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        token: state.token,
        tokenType: state.tokenType,
        user: state.user,
        perfis: state.perfis,
        permissoes: state.permissoes,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
