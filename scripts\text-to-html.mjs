import fs from 'node:fs/promises';
import path from 'node:path';
import { chunkParagraphs, sanitizeName, ensureDir } from './lib/utils.mjs';

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

function escapeHtml(input) {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderHtml({ title, subtitle, slices }) {
  const cards = slices
    .map((paragraphs, i) => {
      const body = paragraphs
        .map((p) => `<p>${escapeHtml(p)}</p>`)
        .join('\n');
      const index = String(i + 1).padStart(2, '0');
      return `
      <article class="xiaohongshu-slice" data-slice="${index}">
        <header class="card-header">
          <div class="badge">${index}</div>
          <h2>${escapeHtml(title)}</h2>
          <div class="subtitle">${escapeHtml(subtitle || '')}</div>
        </header>
        <section class="card-body">
          ${body}
        </section>
      </article>`;
    })
    .join('\n');

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
  <style>
    :root {
      --bg: linear-gradient(150deg, #f6efe6 0%, #f3f0eb 42%, #e7ecef 100%);
      --paper: #fffdf9;
      --ink: #222220;
      --muted: #6a665f;
      --line: #ded6ca;
      --accent: #e36c3d;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 24px 0 80px;
      font-family: "Noto Serif SC", "Source Han Serif SC", "PingFang SC", serif;
      background: var(--bg);
      color: var(--ink);
    }
    .wrap {
      width: min(960px, 92vw);
      margin: 0 auto;
      display: grid;
      gap: 24px;
    }
    .xiaohongshu-slice {
      width: 100%;
      min-height: 1320px;
      background: var(--paper);
      border: 1px solid var(--line);
      border-radius: 24px;
      box-shadow: 0 24px 50px rgba(16, 20, 24, 0.08);
      overflow: hidden;
      position: relative;
      padding: 44px 54px;
      page-break-inside: avoid;
    }
    .xiaohongshu-slice::before {
      content: "";
      position: absolute;
      inset: 0;
      background:
        radial-gradient(circle at 10% -10%, rgba(227,108,61,0.08), transparent 35%),
        radial-gradient(circle at 110% 120%, rgba(47,101,133,0.08), transparent 30%);
      pointer-events: none;
    }
    .card-header {
      position: relative;
      z-index: 1;
      border-bottom: 1px solid var(--line);
      padding-bottom: 24px;
      margin-bottom: 24px;
    }
    .badge {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      display: grid;
      place-items: center;
      font-family: "IBM Plex Mono", "Consolas", monospace;
      font-size: 13px;
      color: white;
      background: var(--accent);
      margin-bottom: 16px;
      letter-spacing: 0.06em;
    }
    h2 {
      margin: 0;
      font-size: 42px;
      line-height: 1.2;
      letter-spacing: 0.01em;
      font-weight: 700;
    }
    .subtitle {
      margin-top: 10px;
      font-size: 18px;
      color: var(--muted);
      letter-spacing: 0.03em;
    }
    .card-body {
      position: relative;
      z-index: 1;
      display: grid;
      gap: 18px;
      align-content: start;
    }
    .card-body p {
      margin: 0;
      font-size: 30px;
      line-height: 1.56;
      letter-spacing: 0.004em;
      white-space: pre-wrap;
    }
    @media (max-width: 900px) {
      .xiaohongshu-slice { min-height: 1180px; padding: 34px 34px; }
      h2 { font-size: 34px; }
      .card-body p { font-size: 26px; }
    }
  </style>
</head>
<body>
  <main class="wrap">
    ${cards}
  </main>
</body>
</html>`;
}

async function main() {
  const args = parseArgs(process.argv);
  const input = args.input;
  const output = args.output;
  const title = args.title || '图文内容';
  const subtitle = args.subtitle || 'Auto typeset for image slicing';
  const max = Number(args.maxParagraphsPerSlice || 6);

  if (!input || !output) {
    console.error('Usage: node scripts/text-to-html.mjs --input <txt> --output <html> [--title <title>] [--subtitle <subtitle>] [--maxParagraphsPerSlice 6]');
    process.exit(1);
  }

  const raw = await fs.readFile(input, 'utf8');
  const slices = chunkParagraphs(raw, Number.isFinite(max) && max > 0 ? max : 6);
  const html = renderHtml({ title: sanitizeName(title), subtitle, slices });

  await ensureDir(path.dirname(output));
  await fs.writeFile(output, html, 'utf8');

  console.log(`HTML generated: ${output}`);
  console.log(`Slices: ${slices.length}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
