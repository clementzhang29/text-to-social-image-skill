import path from 'node:path';
import fs from 'node:fs/promises';
import { listHtmlFiles, ensureDir, slugFromPath } from './lib/utils.mjs';

function parseArgs(argv) {
  const result = {};
  for (let i = 2; i < argv.length; i += 1) {
    const current = argv[i];
    if (!current.startsWith('--')) continue;
    const key = current.slice(2);
    const next = argv[i + 1];
    if (next && !next.startsWith('--')) {
      result[key] = next;
      i += 1;
    } else {
      result[key] = 'true';
    }
  }
  return result;
}

async function runNode(scriptPath, args) {
  const { spawn } = await import('node:child_process');
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [scriptPath, ...args], { stdio: 'inherit' });
    child.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Command failed: ${scriptPath} (exit ${code})`));
    });
    child.on('error', reject);
  });
}

async function main() {
  const args = parseArgs(process.argv);
  const inputDir = args.inputDir;
  const outputRoot = args.outputRoot;
  const scale = args.scale || '2';
  const padding = args.padding || '2';

  if (!inputDir || !outputRoot) {
    console.error('Usage: node scripts/batch-html-to-images.mjs --inputDir <dir> --outputRoot <dir> [--scale 2] [--padding 2]');
    process.exit(1);
  }

  const htmlFiles = await listHtmlFiles(path.resolve(inputDir));
  if (htmlFiles.length === 0) {
    console.log('No .html/.htm files found in input directory.');
    return;
  }

  await ensureDir(path.resolve(outputRoot));
  const current = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:\/)/, '$1'));
  const htmlToImages = path.join(current, 'html-to-images.mjs');

  const rows = [];

  for (let i = 0; i < htmlFiles.length; i += 1) {
    const full = htmlFiles[i];
    const idx = String(i + 1).padStart(3, '0');
    const name = slugFromPath(full);
    const outDir = path.join(path.resolve(outputRoot), `${idx}_${name}`);
    await ensureDir(outDir);

    await runNode(htmlToImages, [
      '--input', full,
      '--outputDir', outDir,
      '--scale', String(scale),
      '--padding', String(padding)
    ]);

    rows.push(`${idx}\t${full}\t${outDir}`);
  }

  await fs.writeFile(path.join(path.resolve(outputRoot), 'batch_summary.txt'), `${rows.join('\n')}\n`, 'utf8');
  console.log(`Batch completed: ${path.resolve(outputRoot)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
