import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceRoot = path.join(repositoryRoot, 'src');
const appRoot = path.join(sourceRoot, 'app');

const forbiddenSkeletonPaths = [
  'modules',
  'services/api',
  'store/authStore.ts',
  'hooks/useAuthorization.ts',
  'hooks/useAuthHydrated.ts',
  'utils/appConfig.ts',
  'components/organisms/Header.tsx',
  'components/organisms/Sidebar.tsx',
  'components/organisms/Topbar.tsx',
  'components/templates/AppLayout.tsx',
];

const requiredAppPaths = ['App.tsx', 'exports.ts', 'README.md', 'navigation.ts'];
const violations = [];

for (const relativePath of forbiddenSkeletonPaths) {
  if (fs.existsSync(path.join(sourceRoot, relativePath))) {
    violations.push(`Código de domínio ainda está no skeleton: src/${relativePath}`);
  }
}

for (const relativePath of requiredAppPaths) {
  if (!fs.existsSync(path.join(appRoot, relativePath))) {
    violations.push(`Contrato da aplicação ausente: src/app/${relativePath}`);
  }
}

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      return entryPath === appRoot || entry.name.startsWith('.') ? [] : walk(entryPath);
    }

    return /\.(?:ts|tsx)$/.test(entry.name) ? [entryPath] : [];
  });
}

for (const filePath of walk(sourceRoot)) {
  const relativePath = path.relative(repositoryRoot, filePath);
  const source = fs.readFileSync(filePath, 'utf8');

  const stripped = source
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*$/gm, '')
    .trim();

  if (relativePath === 'src/App.tsx') {
    if (stripped !== "export { App as default } from '@app/exports';") {
      violations.push('src/App.tsx deve ser somente o adaptador para @app/exports.');
    }
    continue;
  }

  if (/(?:from\s+|import\s*\()['"](?:@app(?:\/|['"])|\.\/app\/)/.test(source)) {
    violations.push(`${relativePath} importa a aplicação de domínio.`);
  }

  if (/(?:from\s+|import\s*\()['"]@\/(?:modules|services\/api)\//.test(source)) {
    violations.push(`${relativePath} importa módulo ou API de domínio do skeleton.`);
  }
}

if (violations.length > 0) {
  console.error('Fronteira skeleton/app inválida:\n');
  for (const violation of violations) {
    console.error(`- ${violation}`);
  }
  process.exitCode = 1;
} else {
  console.log('Fronteira skeleton/app válida.');
}
