import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const html = await readFile(resolve(root, 'AI-Accessibility-Route-Advisor.html'), 'utf8');
if (/<script[^>]+src=|<link[^>]+rel="stylesheet"/i.test(html)) {
  throw new Error('Pages requires the self-contained production build.');
}
await mkdir(resolve(root, 'docs'), { recursive: true });
await writeFile(resolve(root, 'docs/index.html'), html, 'utf8');
await writeFile(resolve(root, 'docs/.nojekyll'), '', 'utf8');
console.log('GitHub Pages build ready in docs/ (all assets embedded).');
