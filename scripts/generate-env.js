import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const basePath = path.resolve(__dirname, '..', 'env.base.json');
const outPath = path.resolve(__dirname, '..', 'env.sam.json');
const examplePath = path.resolve(__dirname, '..', 'env.base.example.json');

function maskValue(val) {
  if (typeof val !== 'string') return val;
  if (val.length === 0) return '';
  // keep protocol for URLs (e.g. postgresql://) but mask rest
  if (/^\w+:\/\//.test(val)) {
    try {
      const idx = val.indexOf('://');
      const protocol = val.substring(0, idx + 3);
      return protocol + '<REDACTED>';
    } catch (e) {
      return '<REDACTED>';
    }
  }
  return '<REDACTED>';
}

const args = process.argv.slice(2);
const makeExample = args.includes('--example');

if (!fs.existsSync(basePath)) {
  console.error('Missing', basePath);
  process.exit(1);
}

const base = JSON.parse(fs.readFileSync(basePath, 'utf8'));
const functions = base.Functions || [];
const globals = base.Globals || {};

const out = {};
functions.forEach((fn) => {
  out[fn] = { ...globals };
});

fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
console.log('Generated', outPath);

if (makeExample) {
  const example = {
    Globals: {},
    Functions: base.Functions || []
  };
  Object.keys(globals).forEach((k) => {
    example.Globals[k] = maskValue(globals[k]);
  });
  fs.writeFileSync(examplePath, JSON.stringify(example, null, 2));
  console.log('Generated example', examplePath);
}
