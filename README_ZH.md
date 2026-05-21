# text-to-social-image-skill（中文）

用于把用户上传文本自动排版为社媒图文卡片，并导出为可直接发布的有序图片。

## 一句话摘要

把“文字内容”编译成“可复现的图文切片产物”，服务于小红书、公众号封面图文、长文轮播等发布流程。

## 项目背景与价值

内容团队在发布图文时常见问题：
- 手工排版耗时高，格式不稳定
- 切图顺序混乱，重复返工
- 缺乏可复现导出记录

本项目提供一条本地可执行流水线：
- 文本 -> 自动排版 HTML
- HTML -> 有序截图 PNG
- 批量目录 -> 统一命名 + 摘要日志

## 适用场景

- 长文拆分为多张社媒卡片
- 设计稿/静态 HTML 批量截图导出
- 编辑流程中的版本化交付（按序编号）

## 当前能力

- 文本转卡片 HTML（默认 `.xiaohongshu-slice`）
- HTML 元素级导出 PNG（有序）
- 批量 HTML 导出（每个文件一个文件夹）
- 产物摘要文件（`export_summary.txt` / `batch_summary.txt`）

## 快速开始

```bash
npm install
```

## 命令说明

### 1) 文本 -> HTML

```bash
node scripts/text-to-html.mjs \
  --input ./examples/sample-input.txt \
  --output ./out/sample.html \
  --title "示例标题" \
  --subtitle "自动排版"
```

### 2) HTML -> 图片

```bash
node scripts/html-to-images.mjs \
  --input ./out/sample.html \
  --outputDir ./out/sample_images
```

### 3) 一步完成：文本 -> 图片

```bash
node scripts/text-to-images.mjs \
  --input ./examples/sample-input.txt \
  --outputRoot ./out \
  --title "示例标题"
```

### 4) 批量 HTML 导出

```bash
node scripts/batch-html-to-images.mjs \
  --inputDir "C:/Users/you/Downloads" \
  --outputRoot "C:/Users/you/Downloads/html_images_export"
```

## 输入输出规范

### 输入

- `txt/md`：用于自动排版
- `html/htm`：用于直接截图导出

### 输出

- 图片命名：`001*.png`, `002*.png`, ...
- 批量文件夹：`001_<name>`, `002_<name>`, ...
- 单文件导出摘要：`export_summary.txt`
- 批量导出摘要：`batch_summary.txt`

## 选择器策略

当前默认优先级：
- `.xiaohongshu-slice`
- `.xhs-canvas`
- `article`
- `section`
- `body`

提示：若你的页面主卡片是 `.xhs-card`，建议优先加入该选择器，避免退化成整页截图。

## 目录结构

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

## 已知限制

- 当前标题与分页策略偏基础，尚未引入语义级自动摘要分段
- 主题模板切换尚未完成（计划支持小红书/公众号双主题）
- 当前主要通过 CLI 使用，Web 界面仍在计划中

## 路线图

1. 自动标题生成（基于 txt/md 内容）
2. 智能分页策略（按段落密度/字符预算）
3. 主题模板切换（小红书 / 公众号）
4. 最小 Web 界面（拖拽上传 -> 一键导出）
5. 书签/链接增强流程（站点名 -> 官网 URL 补全）

## 常见问题

1. 为什么只导出 1 张图？
- 通常是页面容器选择器未命中，脚本退化成 `body` 截图。请检查 HTML 卡片类名并调整选择器优先级。

2. 为什么书签里没有真实链接？
- 某些输入只有站点名称，没有显式 URL。需要额外做“站点名到 URL”的解析步骤。

3. 导出是否可复现？
- 命名和顺序可复现；但跨浏览器版本渲染细节可能略有差异。

## 安全与隐私

- 默认本地执行，不上传源文档
- 发布前建议人工复核图片内容
- 不建议在输入内容中包含敏感密钥
