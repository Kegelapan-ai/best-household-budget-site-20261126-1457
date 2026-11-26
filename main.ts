// KasRumah — make.fun entry program (Node 22, standard library only).
//
// The site lives in app/ beside this file: plain static files a desktop
// browser loads offline (app/index.html plus its ES modules and one
// stylesheet, no library, no network request). This program hands it in: it
// copies app/ and screenshots/ into the output directory and writes
// /output/dossier.json, the summary the judge reads, with the vendored
// make.fun library.
//
// Open it locally with `node serve.ts`, then open http://localhost:8080.
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

if (!existsSync(join(here, 'app', 'index.html'))) {
  throw new Error('app/index.html is missing — build the site before handing it in');
}
if (!existsSync(join(here, 'screenshots')) || !existsSync(join(here, 'screenshots', '1-dashboard.jpg'))) {
  throw new Error('screenshots/ is missing the cover — take the screenshots before handing it in');
}
// The gate refuses a screenshot over 256 KiB: catch an oversized one here,
// before the entry is handed in, instead of after it is graded.
for (const shot of readdirSync(join(here, 'screenshots'))) {
  const bytes = statSync(join(here, 'screenshots', shot)).size;
  if (bytes > 262144) {
    throw new Error(`screenshots/${shot} is ${bytes} bytes — over the 256 KiB gate cap`);
  }
}

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
}

// The scorer's own caps (reference/gate.json): only text_max_bytes shapes
// the bytes; the others refuse an entry the scorer would refuse (more than
// 4 screenshots or one over 256 KiB; more than 993 files and directories in
// app/ or 16 MiB of app files, in all: app/ counts beside /output's own
// 1000-entry cap, its screenshots/ and dossier.json).
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);

console.log(`KasRumah handed in to ${out}`);
