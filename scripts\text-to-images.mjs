import path from 'node:path';
import fs from 'node:fs/promises';
import { ensureDir, slugFromPath } from './lib/utils.mjs';

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
  const input = args.input;
  const outputRoot = args.outputRoot;
  const title = args.title || '图文内容';
  const subtitle = args.subtitle || 'Auto typeset for social image slices';
  const maxParagraphsPerSlice = args.maxParagraphsPerSlice || '6';

  if (!input || !outputRoot) {
    console.error('Usage: node scripts/text-to-images.mjs --input <txt> --outputRoot <dir> [--title <title>] [--subtitle <subtitle>] [--maxParagraphsPerSlice 6]');
    process.exit(1);
  }

  const base = slugFromPath(input);
  const folder = path.join(path.resolve(outputRoot), base);
  await ensureDir(folder);

  const htmlPath = path.join(folder, `${base}.html`);
  const imagesDir = path.join(folder, 'images');
  await ensureDir(imagesDir);

  const current = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:\/)/, '$1'));
  const textToHtml = path.join(current, 'text-to-html.mjs');
  const htmlToImages = path.join(current, 'html-to-images.mjs');

  await runNode(textToHtml, [
    '--input', path.resolve(input),
    '--output', htmlPath,
    '--title', title,
    '--subtitle', subtitle,
    '--maxParagraphsPerSlice', String(maxParagraphsPerSlice)
  ]);

  await runNode(htmlToImages, [
    '--input', htmlPath,
    '--outputDir', imagesDir,
    '--scale', String(args.scale || 2),
    '--padding', String(args.padding || 2)
  ]);

  const usage = [
    `input=${path.resolve(input)}`,
    `html=${htmlPath}`,
    `images=${imagesDir}`
  ];
  await fs.writeFile(path.join(folder, 'pipeline_summary.txt'), `${usage.join('\n')}\n`, 'utf8');

  console.log(`Pipeline completed: ${folder}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
