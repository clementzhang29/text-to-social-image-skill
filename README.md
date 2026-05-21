# text-to-social-image-skill

## 中文说明

`text-to-social-image-skill` 用于把用户上传文本自动排版成社媒图文卡片，并按顺序导出 PNG 图片，适合直接切图发布。

核心能力：
- 文本 -> 自动排版 HTML（默认生成 `.xiaohongshu-slice` 页面片段）
- HTML -> 按顺序导出 PNG（`001`, `002`, ...）
- 批量处理目录中的 HTML（每个文件一个输出文件夹）
- 导出摘要（`export_summary.txt` / `batch_summary.txt`）便于复现

常用命令：

```bash
npm install

# 文本转 HTML
node scripts/text-to-html.mjs --input ./examples/sample-input.txt --output ./out/sample.html --title "标题"

# HTML 转图片
node scripts/html-to-images.mjs --input ./out/sample.html --outputDir ./out/sample_images

# 文本一步转图片
node scripts/text-to-images.mjs --input ./examples/sample-input.txt --outputRoot ./out --title "标题"

# 批量 HTML 转图片（每个文件一个文件夹）
node scripts/batch-html-to-images.mjs --inputDir "C:/Users/you/Downloads" --outputRoot "C:/Users/you/Downloads/html_images_export"
```

---

## English Description

`text-to-social-image-skill` converts uploaded text into social-media-ready card layouts and exports ordered PNG slices for direct posting.

Key capabilities:
- Text -> auto typeset HTML cards (default `.xiaohongshu-slice` blocks)
- HTML -> ordered PNG export (`001`, `002`, ...)
- Batch export for a directory of HTML files (one folder per source file)
- Export summaries (`export_summary.txt` / `batch_summary.txt`) for reproducibility

Quick commands:

```bash
npm install

# Text to HTML
node scripts/text-to-html.mjs --input ./examples/sample-input.txt --output ./out/sample.html --title "Title"

# HTML to images
node scripts/html-to-images.mjs --input ./out/sample.html --outputDir ./out/sample_images

# One-step text to images
node scripts/text-to-images.mjs --input ./examples/sample-input.txt --outputRoot ./out --title "Title"

# Batch HTML to images (one folder per file)
node scripts/batch-html-to-images.mjs --inputDir "C:/Users/you/Downloads" --outputRoot "C:/Users/you/Downloads/html_images_export"
```
