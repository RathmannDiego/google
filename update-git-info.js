


const fs = require('fs');
const { execSync } = require('child_process');

const targetEnv = process.argv[2] || 'dev';

const branch = execSync('git branch --show-current').toString().trim();
const repoPath = execSync('git rev-parse --show-toplevel').toString().trim();
const repo = repoPath.split(/[/\\]/).pop();

const wranglerContent = fs.readFileSync('wrangler.toml', 'utf8');

const filePath = './src/index.ts';
let content = fs.readFileSync(filePath, 'utf8');

const updatedContent = content
  .replace(/const branch = ".*";/, `const branch = "${branch}";`)
  .replace(/const repo = ".*";/, `const repo = "${repo}";`);

fs.writeFileSync(filePath, updatedContent, 'utf8');
console.log(`Entorno [${targetEnv}] verificado -> Rama: [${branch}] | Repo: [${repo}]`);



