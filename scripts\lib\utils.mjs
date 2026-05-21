import fs from 'node:fs/promises';
import path from 'node:path';

export function sanitizeName(input) {
  return String(input)
    .trim()
    .replace(/[\\/:*?"<>|]/g, '_')
    .replace(/\s+/g, ' ')
    .slice(0, 120);
}

export function slugFromPath(filePath) {
  const base = path.parse(filePath).name;
  const safe = sanitizeName(base) || 'untitled';
  return safe;
}

export function chunkParagraphs(text, maxParagraphsPerSlice = 6) {
  const paragraphs = text
    .replace(/\r\n/g, '\n')
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  if (paragraphs.length === 0) return [['']];

  const slices = [];
  for (let i = 0; i < paragraphs.length; i += maxParagraphsPerSlice) {
    slices.push(paragraphs.slice(i, i + maxParagraphsPerSlice));
  }
  return slices;
}

export async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

export async function readTextFile(filePath) {
  return fs.readFile(filePath, 'utf8');
}

export async function listHtmlFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  return entries
    .filter((e) => e.isFile())
    .map((e) => e.name)
    .filter((name) => /\.(htm|html)$/i.test(name))
    .sort((a, b) => a.localeCompare(b, 'zh-CN'))
    .map((name) => path.join(dir, name));
}
