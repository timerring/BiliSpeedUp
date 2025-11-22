/**
 * 构建 Chrome 扩展
 * 自动同步版本号并复制文件
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// 读取 package.json 版本号
const packageJson = JSON.parse(
    fs.readFileSync(path.join(rootDir, 'package.json'), 'utf-8')
);
const version = packageJson.version;

// 更新 manifest.json 版本号
const manifestPath = path.join(rootDir, 'chrome-extension/manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
manifest.version = version;
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');

// 复制脚本文件
const sourceFile = path.join(rootDir, 'dist/BiliSpeedUp.js');
const targetFile = path.join(rootDir, 'chrome-extension/BiliSpeedUp.js');
fs.copyFileSync(sourceFile, targetFile);

console.log(`Chrome 扩展构建完成`);
console.log(`版本号: ${version}`);
console.log(`文件已复制到: chrome-extension/`);
