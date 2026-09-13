const fs = require('fs');
const { execSync } = require('child_process');

const branch = execSync('git branch --show-current').toString().trim();
const repo = execSync('git rev-parse --show-toplevel').toString().trim();

const wranglerContent = fs.readFileSync('wrangler.toml', 'utf8');

const workerMatch = wranglerContent.match(/name\s*=\s*["']([^"']+)["']/);
const workerName = workerMatch ? workerMatch[1] : 'desconocido';

const dbMatch = wranglerContent.match(/database_name\s*=\s*["']([^"']+)["']/);
const dbName = dbMatch ? dbMatch[1] : 'desconocida';

const filePath = './src/index.ts';
let content = fs.readFileSync(filePath, 'utf8');

const updatedContent = content
  .replace(/const branch = ".*";/, `const branch = "${branch}";`)
  .replace(/const repo = ".*";/, `const repo = "${repo}";`)
  .replace(/const worker = ".*";/, `const worker = "${workerName}";`)
  .replace(/const base = ".*";/, `const base = "${dbName}";`);

fs.writeFileSync(filePath, updatedContent, 'utf8');
console.log(`Entorno verificado -> Rama: [${branch}] | Worker: [${workerName}] | Base: [${dbName}]`);