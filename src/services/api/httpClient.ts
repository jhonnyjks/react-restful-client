import axios, { AxiosHeaders } from 'axios';
import { useAuthStore } from '@/store/authStore';
import { useToastStore } from '@/store/toastStore';

const baseURL = import.meta.env.VITE_API_BASE_URL ?? '/api';

export const httpClient = axios.create({
  baseURL,
  withCredentials: true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

let csrfResolved = false;
let csrfPromise: Promise<void> | null = null;

function buildSanctumCsrfURL() {
  if (/^https?:\/\//i.test(baseURL)) {
    const url = new URL(baseURL);
    return `${url.origin}/sanctum/csrf-cookie`;
  }

  return '/sanctum/csrf-cookie';
}

export async function getCsrfCookie(forceReload = false) {
  if (!forceReload && csrfResolved) {
    return;
  }

  if (!forceReload && typeof document !== 'undefined') {
    const hasCookie = document.cookie
      .split(';')
      .some((cookie) => cookie.trim().startsWith('XSRF-TOKEN='));
    if (hasCookie) {
      csrfResolved = true;
      return;
    }
  }

  if (!csrfPromise) {
    csrfPromise = axios
      .get(buildSanctumCsrfURL(), {
        withCredentials: true,
        headers: {
          Accept: 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
      })
      .then(() => {
        csrfResolved = true;
      })
      .finally(() => {
        csrfPromise = null;
      });
  }

  await csrfPromise;
}

httpClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  const tokenType = useAuthStore.getState().tokenType ?? 'Bearer';

  if (token) {
    if (!config.headers) {
      config.headers = new AxiosHeaders();
    }

    if (config.headers instanceof AxiosHeaders) {
      config.headers.set('Authorization', `${tokenType} ${token}`);
    } else {
      (config.headers as Record<string, string>).Authorization = `${tokenType} ${token}`;
    }
  }

  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url || '';

    if (status === 401) {
      const { token } = useAuthStore.getState();

      if (!useAuthStore.persist.hasHydrated() || !token) {
        return Promise.reject(error);
      }

      // Verifica se é uma tentativa de login (não deve mostrar mensagem de sessão expirada)
      const isLoginAttempt = requestUrl.includes('/auth/login') || requestUrl.includes('/auth/login-with-code');
      
      // Se não for tentativa de login, trata como sessão expirada
      if (!isLoginAttempt) {
        useAuthStore.getState().clearSession();
        useToastStore.getState().push({
          variant: 'warning',
          title: 'Sessão expirada',
          description: 'Faça login novamente para continuar.',
        });
        if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
      // Se for tentativa de login, deixa o erro ser tratado pelo hook de login
    }

    return Promise.reject(error);
  },
);

