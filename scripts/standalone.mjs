import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
let html = await readFile(resolve(root, 'dist/index.html'), 'utf8');
const script = html.match(/<script[^>]+src="([^"]+)"[^>]*><\/script>/);
const stylesheet = html.match(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"[^>]*>/);
if (!script || !stylesheet) throw new Error('Expected one bundled JavaScript and CSS asset.');
const js = await readFile(resolve(root, 'dist', script[1].replace(/^\//, '')), 'utf8');
const css = await readFile(resolve(root, 'dist', stylesheet[1].replace(/^\//, '')), 'utf8');
const icon = await readFile(resolve(root, 'public/favicon.svg'), 'utf8');
html = html.replace(script[0], () => `<script type="module">${js.replace(/<\/script/gi, '<\\/script')}</script>`);
html = html.replace(stylesheet[0], () => `<style>${css}</style>`);
html = html.replace('href="/favicon.svg"', () => `href="data:image/svg+xml,${encodeURIComponent(icon)}"`);
await writeFile(resolve(root, 'AI-Accessibility-Route-Advisor.html'), html, 'utf8');
console.log('Created AI-Accessibility-Route-Advisor.html — self-contained, no server or internet required to open.');
