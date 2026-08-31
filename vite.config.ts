import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const projectRoot = path.resolve(__dirname);
  const appRoot = path.resolve(projectRoot, env.APP_SOURCE_DIR ?? 'src/app');
  const proxyTarget = env.VITE_API_PROXY_TARGET ?? 'http://127.0.0.1:8080';
  const legacyApiHost = env.REACT_APP_API_HOST ?? env.VITE_API_BASE_URL ?? '/api';
  const legacyAppName = env.REACT_APP_NAME ?? env.VITE_APP_NAME ?? 'React Client';
  const legacyLogo = env.REACT_APP_LOGO ?? '';
  const legacyLoginLogo = env.REACT_APP_LOGIN_LOGO ?? '';

  if (!appRoot.startsWith(`${projectRoot}${path.sep}`)) {
    throw new Error('APP_SOURCE_DIR deve apontar para um diretório dentro do skeleton.');
  }

  return {
    plugins: [react()],
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode),
      'process.env.REACT_APP_API_HOST': JSON.stringify(legacyApiHost),
      'process.env.REACT_APP_NAME': JSON.stringify(legacyAppName),
      'process.env.REACT_APP_LOGO': JSON.stringify(legacyLogo),
      'process.env.REACT_APP_LOGIN_LOGO': JSON.stringify(legacyLoginLogo),
    },
    resolve: {
      alias: [
        {
          find: /^react-redux-toastr$/,
          replacement: path.resolve(projectRoot, './node_modules/react-redux-toastr/lib/index.js'),
        },
        { find: '@app', replacement: appRoot },
        { find: '@', replacement: path.resolve(projectRoot, './src') },
      ],
    },
    server: {
      proxy: {
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
          secure: false,
          cookieDomainRewrite: '',
          cookiePathRewrite: '/',
          ws: false,
        },
        '/sanctum': {
          target: proxyTarget,
          changeOrigin: true,
          secure: false,
          cookieDomainRewrite: '',
          cookiePathRewrite: '/',
          ws: false,
        },
      },
    },
  };
});
