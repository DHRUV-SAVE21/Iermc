import { mkdir, cp, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
const root = resolve(import.meta.dirname, '..');
const out = resolve(root, 'dist');
await mkdir(out, { recursive: true });
for (const entry of ['index.html', 'src', 'public']) {
  await cp(resolve(root, entry), resolve(out, entry), { recursive: true });
}
await writeFile(resolve(out, '404.html'), await readFile(resolve(root, 'index.html')));
console.log(`Static production build ready: ${out}`);
