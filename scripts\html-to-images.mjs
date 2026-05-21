import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';
import { ensureDir } from './lib/utils.mjs';

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

function clampMin(value, min) {
  return value < min ? min : value;
}

async function chooseSliceSelector(page) {
  const candidates = ['.xiaohongshu-slice', '.xhs-canvas', 'article', 'section'];
  for (const selector of candidates) {
    const count = await page.locator(selector).count();
    if (count > 0) return { selector, count };
  }
  return { selector: 'body', count: 1 };
}

async function screenshotOne(page, locator, outPath, padding) {
  await locator.scrollIntoViewIfNeeded();
  const box = await locator.boundingBox();
  if (!box) return false;

  const x = clampMin(box.x - padding, 0);
  const y = clampMin(box.y - padding, 0);
  const width = box.width + padding * 2;
  const height = box.height + padding * 2;

  if (width <= 1 || height <= 1) return false;

  await page.screenshot({
    path: outPath,
    type: 'png',
    omitBackground: false,
    clip: { x, y, width, height }
  });

  return true;
}

async function main() {
  const args = parseArgs(process.argv);
  const input = args.input;
  const outputDir = args.outputDir;
  const scale = Number(args.scale || 2);
  const padding = Number(args.padding || 2);

  if (!input || !outputDir) {
    console.error('Usage: node scripts/html-to-images.mjs --input <html> --outputDir <dir> [--scale 2] [--padding 2]');
    process.exit(1);
  }

  await ensureDir(outputDir);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1600, height: 1200 },
    deviceScaleFactor: Number.isFinite(scale) && scale > 0 ? scale : 2
  });

  const url = `file:///${path.resolve(input).replace(/\\/g, '/')}`;
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(250);

  const { selector, count } = await chooseSliceSelector(page);
  const locator = page.locator(selector);

  const rows = [];
  let exported = 0;
  for (let i = 0; i < count; i += 1) {
    const el = locator.nth(i);
    const idx = String(i + 1).padStart(3, '0');
    const dataSlice = await el.getAttribute('data-slice');
    const suffix = dataSlice ? `_${String(dataSlice).replace(/[\\/:*?"<>|]/g, '_')}` : '';
    const fileName = `${idx}${suffix}.png`;
    const target = path.join(outputDir, fileName);

    const ok = await screenshotOne(page, el, target, Number.isFinite(padding) ? Math.max(0, padding) : 2);
    if (ok) {
      exported += 1;
      const stat = await fs.stat(target);
      rows.push(`${fileName}\t${stat.size}`);
    }
  }

  await browser.close();

  const summary = [
    `input=${path.resolve(input)}`,
    `selector=${selector}`,
    `count=${count}`,
    `exported=${exported}`,
    'files:',
    ...rows
  ];
  await fs.writeFile(path.join(outputDir, 'export_summary.txt'), `${summary.join('\n')}\n`, 'utf8');

  console.log(`Done: ${outputDir}`);
  console.log(`Exported: ${exported}/${count}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
