import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceRoot = path.join(repositoryRoot, 'src');
const defaultAppRoot = path.join(sourceRoot, 'app');
const appDirectory = process.env.APP_SOURCE_DIR ?? 'src/app';
const appRoot = path.resolve(repositoryRoot, appDirectory);

if (!appRoot.startsWith(`${repositoryRoot}${path.sep}`)) {
  throw new Error('APP_SOURCE_DIR deve apontar para um diretório dentro do skeleton.');
}

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

const requiredAppPaths = ['exports.js'];
const allowedAppConsumers = new Set([
  'src/main/reducers.js',
  'src/main/routes.jsx',
  'src/common/template/Menu.jsx',
]);
const violations = [];

for (const relativePath of forbiddenSkeletonPaths) {
  if (fs.existsSync(path.join(sourceRoot, relativePath))) {
    violations.push(`Código de domínio ainda está no skeleton: src/${relativePath}`);
  }
}

for (const relativePath of requiredAppPaths) {
  if (!fs.existsSync(path.join(appRoot, relativePath))) {
    violations.push(`Contrato da aplicação ausente: ${appDirectory}/${relativePath}`);
  }
}

const exportsPath = path.join(appRoot, 'exports.js');
if (fs.existsSync(exportsPath)) {
  const appExports = fs.readFileSync(exportsPath, 'utf8');
  for (const exportName of ['routes', 'menu', 'reducers']) {
    const declaresExport = new RegExp(`export\\s+(?:const|let|var)\\s+${exportName}\\b`).test(appExports);
    const reExportsName = new RegExp(`export\\s*\\{[^}]*\\b${exportName}\\b[^}]*\\}`, 's').test(appExports);
    if (!declaresExport && !reExportsName) {
      violations.push(`${appDirectory}/exports.js deve exportar ${exportName}.`);
    }
  }
}

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      return entryPath === defaultAppRoot || entryPath === appRoot || entry.name.startsWith('.') ? [] : walk(entryPath);
    }

    return /\.(?:js|jsx|ts|tsx)$/.test(entry.name) ? [entryPath] : [];
  });
}

for (const filePath of walk(sourceRoot)) {
  const relativePath = path.relative(repositoryRoot, filePath);
  const source = fs.readFileSync(filePath, 'utf8');

  if (/(?:from\s+|import\s*\()['"](?:@app(?:\/|['"])|\.\/app\/)/.test(source)) {
    if (!allowedAppConsumers.has(relativePath)) {
      violations.push(`${relativePath} importa a aplicação de domínio fora do contrato padrão.`);
    }
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
