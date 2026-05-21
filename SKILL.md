---
name: text-to-social-image-skill
description: Convert uploaded text into social-card HTML and export ordered PNG slices for direct posting. Use when users ask for text-to-image cards, long-post slicing, or HTML-to-image export.
---

# text-to-social-image-skill

Use this skill when the user wants to:
- provide text and auto-generate a polished card layout;
- split long content into multiple image pages;
- export HTML cards into ordered PNG files ready for posting.

## What this skill does

1. Generate `.xiaohongshu-slice` based HTML from plain text.
2. Capture each slice in order with Playwright.
3. Export one folder per source file with deterministic naming.

## Quick start

From the skill root:

```bash
npm install
```

### A) Text to HTML

```bash
node scripts/text-to-html.mjs \
  --input /path/to/input.txt \
  --output /path/to/output.html \
  --title "Your Title" \
  --subtitle "Your Subtitle"
```

### B) HTML to ordered images

```bash
node scripts/html-to-images.mjs \
  --input /path/to/output.html \
  --outputDir /path/to/images_dir
```

### C) One-step text to images

```bash
node scripts/text-to-images.mjs \
  --input /path/to/input.txt \
  --outputRoot /path/to/output_root \
  --title "Your Title"
```

### D) Batch HTML export (one folder per file, sorted)

```bash
node scripts/batch-html-to-images.mjs \
  --inputDir /path/to/html_dir \
  --outputRoot /path/to/export_root
```

## Output conventions

- Slice images are named `001_*.png`, `002_*.png` ...
- Batch mode folders are `001_<name>`, `002_<name>` ... sorted by file name.
- Each output folder contains `export_summary.txt`.

## Notes

- Default selector priority: `.xiaohongshu-slice` -> `.xhs-canvas` -> `article` -> `section` -> `body`.
- Recommended input style: one idea per paragraph for better slice readability.
- If the user asks for custom visual style, edit CSS in `scripts/text-to-html.mjs`.
