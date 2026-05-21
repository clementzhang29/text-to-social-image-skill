# text-to-social-image-skill (English)

A local-first pipeline that converts user text into social-ready image cards with deterministic export order.

## Abstract

`text-to-social-image-skill` compiles long-form content into reproducible visual outputs:
- text/markdown to structured HTML cards
- HTML cards to ordered PNG slices
- batch processing with deterministic folder naming and export summaries

## Why this project exists

Publishing teams frequently hit the same problems:
- manual layout is slow and inconsistent
- image slice order gets messy
- exports are hard to reproduce later

This project solves that with a practical CLI workflow.

## Best-fit scenarios

- turn long content into social carousel images
- export screenshots from static editorial HTML
- batch processing for content operations pipelines

## Current capabilities

- text -> card-style HTML generation
- HTML element-level capture -> ordered PNG
- batch HTML export with one folder per input file
- summary files for auditability and reproducibility

## Quick start

```bash
npm install
```

## Commands

### 1) Text to HTML

```bash
node scripts/text-to-html.mjs \
  --input ./examples/sample-input.txt \
  --output ./out/sample.html \
  --title "Sample Title" \
  --subtitle "Auto typeset"
```

### 2) HTML to images

```bash
node scripts/html-to-images.mjs \
  --input ./out/sample.html \
  --outputDir ./out/sample_images
```

### 3) One-step text to images

```bash
node scripts/text-to-images.mjs \
  --input ./examples/sample-input.txt \
  --outputRoot ./out \
  --title "Sample Title"
```

### 4) Batch HTML export

```bash
node scripts/batch-html-to-images.mjs \
  --inputDir "C:/Users/you/Downloads" \
  --outputRoot "C:/Users/you/Downloads/html_images_export"
```

## Input/Output contract

### Input

- `.txt`, `.md` for auto layout
- `.html`, `.htm` for direct capture

### Output

- ordered images: `001*.png`, `002*.png`, ...
- batch folders: `001_<name>`, `002_<name>`, ...
- per-export summary: `export_summary.txt`
- batch summary: `batch_summary.txt`

## Selector fallback strategy

Current default priority:
- `.xiaohongshu-slice`
- `.xhs-canvas`
- `article`
- `section`
- `body`

If your cards use `.xhs-card`, add it near the top to avoid full-body fallback captures.

## Repository structure

```text
.
├─ SKILL.md
├─ README.md
├─ README_ZH.md
├─ README_EN.md
├─ examples/
└─ scripts/
   ├─ text-to-html.mjs
   ├─ html-to-images.mjs
   ├─ text-to-images.mjs
   ├─ batch-html-to-images.mjs
   └─ lib/utils.mjs
```

## Known limitations

- title generation and pagination are currently basic
- dual-theme templates (Xiaohongshu/WeChat) are planned
- web drag-and-drop UI is not shipped yet

## Roadmap

1. auto title generation from txt/md
2. adaptive pagination by content density
3. theme switch (`xiaohongshu` / `wechat`)
4. minimal web UI (drag-and-drop -> one-click export)
5. optional URL resolver for bookmark enrichment

## FAQ

1. Why did I get only one image?
- Selector mismatch. Your HTML container might not match current selector priority.

2. Why are bookmarks not real URLs in some cases?
- Some sources include site names only, not explicit links.

3. Is export deterministic?
- Naming/order are deterministic. Pixel-level rendering may vary across browser/runtime versions.

## Security & Privacy

- local-first execution by default
- no automatic upstream upload
- review generated media before publishing
- avoid embedding secrets in source content
