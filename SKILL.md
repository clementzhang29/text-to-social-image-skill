---
name: text-to-social-image-skill
description: Convert uploaded text/markdown/HTML into ordered social image slices. Use for auto layout, long-post splitting, and reproducible HTML-to-image export workflows.
---

# text-to-social-image-skill

Use this skill when users ask to:
- upload text and generate post-ready image cards;
- split long content into ordered image pages;
- export local HTML content as reproducible PNG slices;
- batch export multiple HTML files into one-folder-per-file outputs.

## Workflow summary

1. Optional: convert text/markdown into card-style HTML.
2. Detect slice container selector from the HTML DOM.
3. Capture each slice in order with Playwright.
4. Write deterministic outputs and export summaries.

## Supported commands

### Text -> HTML

```bash
node scripts/text-to-html.mjs \
  --input /path/to/input.txt \
  --output /path/to/output.html \
  --title "Your Title" \
  --subtitle "Your Subtitle"
```

### HTML -> ordered images

```bash
node scripts/html-to-images.mjs \
  --input /path/to/output.html \
  --outputDir /path/to/images_dir
```

### One-step text -> images

```bash
node scripts/text-to-images.mjs \
  --input /path/to/input.txt \
  --outputRoot /path/to/output_root \
  --title "Your Title"
```

### Batch HTML export

```bash
node scripts/batch-html-to-images.mjs \
  --inputDir /path/to/html_dir \
  --outputRoot /path/to/export_root
```

## Output conventions

- Image names: `001*.png`, `002*.png`, ...
- Batch folders: `001_<name>`, `002_<name>`, ... (sorted)
- Per-output summary: `export_summary.txt`
- Batch summary: `batch_summary.txt`

## Selector strategy

Current selector fallback order:
- `.xiaohongshu-slice`
- `.xhs-canvas`
- `article`
- `section`
- `body`

If a page uses `.xhs-card` or other custom containers, add that selector near the front.

## Scope and current status

### Stable now

- text to HTML card generation
- ordered HTML slice export
- deterministic batch export

### Planned next

- auto title generation from uploaded txt/md
- adaptive pagination strategy
- dual theme templates (`xiaohongshu` / `wechat`)
- minimal web drag-and-drop UI

## References

- Project overview: `README.md`
- Chinese guide: `README_ZH.md`
- English guide: `README_EN.md`
