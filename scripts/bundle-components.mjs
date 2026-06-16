import { readdirSync, readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import esbuild from 'esbuild';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dir = resolve(__dirname, '../playground/js/app-components');
const outfile = resolve(__dirname, '../playground/js/app-components-bundle.js');

const files = readdirSync(dir)
  .filter(f => f.endsWith('.js') && f !== 'app-components-bundle.js')
  .sort();

const contents = files
  .map(f => `// --- ${f} ---\n${readFileSync(resolve(dir, f), 'utf-8')}`)
  .join('\n\n');

await esbuild.build({
  stdin: {
    contents,
    resolveDir: dir,
  },
  outfile,
  bundle: false,
  format: 'esm',
  minify: false,
  minifyWhitespace: true,
  minifySyntax: true,
  charset: 'utf8',
  banner: { js: '// Auto-generated bundle - Do not edit manually\n// Generated: ' + new Date().toISOString() },
});

console.log(`✓ Bundled ${files.length} components → app-components-bundle.js`);
