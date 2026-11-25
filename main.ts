// News-image entry: writes the bundled front-page image to the output path.
// Node 22, standard library only. It reads no network and no environment
// value besides the output directory, so every run writes identical bytes.
//
// Local check:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const IMAGE_NAME = 'entry.png';

// The image sits beside this file in the repository.
const sourcePath = join(dirname(fileURLToPath(import.meta.url)), IMAGE_NAME);

// The grader sets MAKEFUN_OUTPUT_DIR; outside it, /output is the default.
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const outputPath = join(outputDir, IMAGE_NAME);

mkdirSync(outputDir, { recursive: true });
const bytes = readFileSync(sourcePath);
writeFileSync(outputPath, bytes);

// Read the copy back and confirm it matches the source byte for byte,
// so a partial or failed write can never pass silently.
const written = readFileSync(outputPath);
if (!written.equals(bytes)) {
  throw new Error(`entry.png mismatch: wrote ${written.length} bytes, expected ${bytes.length}`);
}

console.log(`wrote ${outputPath} (${bytes.length} bytes)`);
