const fs = require('fs');
const { execSync } = require('child_process');

// Obtener el entorno pasado por argumento (dev, qa, prd) o usar 'dev' por defecto
const targetEnv = process.argv[2] || 'dev';

const branch = execSync('git branch --show-current').toString().trim();
// Extraer solo el nombre de la carpeta del repositorio en lugar de la ruta absoluta
const repoPath = execSync('git rev-parse --show-toplevel').toString().trim();
const repo = repoPath.split(/[/\\]/).pop();

const wranglerContent = fs.readFileSync('wrangler.toml', 'utf8');

const workerMatch = wranglerContent.match(/name\s*=\s*["']([^"']+)["']/);
const workerName = workerMatch ? workerMatch[1] : 'desconocido';

// Lógica mejorada: Buscar la base de datos específica del entorno seleccionado
let dbName = 'desconocida';
const envBlockRegex = new RegExp(`\\[env\\.${targetEnv}\\]([\\s\\S]*?)(?=\\n\\[env\\.|$)`, 'i');
const envMatch = wranglerContent.match(envBlockRegex);

if (envMatch) {
  const dbMatch = envMatch[1].match(/database_name\s*=\s*["']([^"']+)["']/) ;
  if (dbMatch) dbName = dbMatch[1];
} else {
  // Fallback al global si no encuentra bloque
  const dbMatch = wranglerContent.match(/database_name\s*=\s*["']([^"']+)["']/);
  if (dbMatch) dbName = dbMatch[1];
}

const filePath = './src/index.ts';
let content = fs.readFileSync(filePath, 'utf8');

const updatedContent = content
  .replace(/const branch = ".*";/, `const branch = "${branch}";`)
  .replace(/const repo = ".*";/, `const repo = "${repo}";`)
  .replace(/const worker = ".*";/, `const worker = "${workerName}";`)
  .replace(/const base = ".*";/, `const base = "${dbName}";`);

fs.writeFileSync(filePath, updatedContent, 'utf8');
console.log(`Entorno [${targetEnv}] verificado -> Rama: [${branch}] | Repo: [${repo}] | Base: [${dbName}]`);