# text-to-social-image-skill

Convert uploaded text into beautiful, slice-ready social media images.

## Features

- Text -> auto typeset HTML cards
- HTML -> ordered PNG slices (`001`, `002`, ...)
- Batch export: one output folder per HTML file
- Stable naming and export summaries for reproducibility

## Use Cases

- Xiaohongshu / Instagram carousel preparation
- Long-form content split into post-ready images
- Structured HTML screenshot export for editorial workflows

## Install

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

## Output Structure

- Batch folders: `001_<name>`, `002_<name>`, ...
- Images: `001_<slice>.png`, `002_<slice>.png`, ...
- Per-folder summary: `export_summary.txt`
- Batch summary: `batch_summary.txt`

## Skill Trigger (for Codex)

Use this skill when users ask to:
- upload text and generate social image cards,
- auto layout and split long text into image pages,
- export HTML content into ordered image files.
