import { copyFile, lstat, mkdir, readFile, realpath, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import './build-pages.mjs';

const root = await realpath(fileURLToPath(new URL('../', import.meta.url)));
const output = path.resolve(root, 'dist');
const production = process.argv.includes('--production');
const cloudflare = process.argv.includes('--cloudflare');
const files = ['index.html', 'services.html', 'about.html', 'styles.css', 'pages.css', 'app.js', '404.html', 'robots.txt', 'sitemap.xml'];
const assets = ['mark.svg', 'hero-640.webp', 'hero-896.webp', 'before-640.webp', 'before-896.webp', 'social-cover.jpg', 'client-claro.webp', 'client-cencosud.webp', 'client-acueducto.webp', 'client-inamsilco.webp', 'client-olimpica.webp', 'client-jumbo.webp'];

if (path.dirname(output) !== root || path.basename(output) !== 'dist') throw new Error('Unexpected output directory');
const existingOutput = await lstat(output).catch((error) => {
  if (error.code !== 'ENOENT') throw error;
  return null;
});
if (existingOutput?.isSymbolicLink()) throw new Error('The output directory must not be a symbolic link');
await rm(output, { recursive: true, force: true });
await mkdir(path.join(output, 'assets'), { recursive: true });
for (const name of files) {
  let content = await readFile(path.join(root, name), 'utf8');
  if (production && name.endsWith('.html') && name !== '404.html') {
    content = content.replace(/^[ \t]*<meta name="robots" content="noindex, nofollow">\r?\n/m, '');
    content = content.replace(/\s*<p class="preview-note">.*?<\/p>/, '');
  }
  if (production && name === '404.html') content = content.replace('https://beco360.github.io/ingenierosab/', 'https://ingenierosab.com/');
  if (cloudflare && (name.endsWith('.html') || name === 'sitemap.xml')) {
    for (const page of ['services', 'about']) {
      content = content.replaceAll(`https://ingenierosab.com/${page}.html`, `https://ingenierosab.com/${page}`);
      content = content.replaceAll(`href="${page}.html`, `href="/${page}`);
    }
    content = content.replaceAll('href="index.html', 'href="/');
  }
  await writeFile(path.join(output, name), content);
}
for (const name of assets) await copyFile(path.join(root, 'assets', name), path.join(output, 'assets', name));
if (cloudflare) {
  for (const name of ['_headers', '_redirects']) await copyFile(path.join(root, 'deploy', 'cloudflare', name), path.join(output, name));
}
console.log(production ? 'Paquete de producción preparado en dist.' : 'Vista previa empaquetada en dist; conserva noindex.');
if (cloudflare) console.log('Rutas, cabeceras y redirecciones preparadas para Cloudflare Pages.');
