# text-to-social-image-skill

把用户上传的文本自动排版成适合社媒发布的图文卡片，并按顺序导出图片。

## 功能

- 文本 -> 自动排版 HTML 卡片
- HTML -> 按顺序导出 PNG（`001`, `002`, ...）
- 批量模式：每个 HTML 一个文件夹
- 稳定命名 + 导出摘要，方便复现

## 适用场景

- 小红书 / Instagram 轮播图准备
- 长文切图发布
- 编辑流中的 HTML 截图导出

## 安装

```bash
npm install
```

## 命令

### 1) 文本转 HTML

```bash
node scripts/text-to-html.mjs \
  --input ./examples/sample-input.txt \
  --output ./out/sample.html \
  --title "示例标题" \
  --subtitle "自动排版"
```

### 2) HTML 转图片

```bash
node scripts/html-to-images.mjs \
  --input ./out/sample.html \
  --outputDir ./out/sample_images
```

### 3) 一步完成：文本转图片

```bash
node scripts/text-to-images.mjs \
  --input ./examples/sample-input.txt \
  --outputRoot ./out \
  --title "示例标题"
```

### 4) 批量 HTML 导出（每个文件一个文件夹）

```bash
node scripts/batch-html-to-images.mjs \
  --inputDir "C:/Users/you/Downloads" \
  --outputRoot "C:/Users/you/Downloads/html_images_export"
```

## 输出结构

- 批量文件夹：`001_<name>`, `002_<name>`, ...
- 图片命名：`001_<slice>.png`, `002_<slice>.png`, ...
- 单文件摘要：`export_summary.txt`
- 批量摘要：`batch_summary.txt`

## 对 Codex 的触发建议

当用户提出以下需求时应使用该 Skill：
- 上传文本后自动生成图文卡片
- 长内容自动分页切图
- 把 HTML 内容批量导出为有序图片
