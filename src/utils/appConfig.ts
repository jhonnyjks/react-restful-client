/**
 * Configurações da aplicação a partir de variáveis de ambiente
 */
// Debug: log das variáveis de ambiente (apenas em desenvolvimento)
if (import.meta.env.DEV) {
  console.log('Environment variables:', {
    VITE_APP_NAME: import.meta.env.VITE_APP_NAME,
    VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
    VITE_API_PROXY_TARGET: import.meta.env.VITE_API_PROXY_TARGET,
  });
}

export const appConfig = {
  appName: import.meta.env.VITE_APP_NAME || 'Projeto Base',
} as const;

