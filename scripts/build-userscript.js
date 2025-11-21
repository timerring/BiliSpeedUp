/**
 * 构建 UserScript 文件
 * 将 dist/BiliSpeedUp.js 转换为 BiliSpeedUp.user.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// 从 package.json 读取版本号
const packageJson = JSON.parse(
    fs.readFileSync(path.join(rootDir, 'package.json'), 'utf-8')
);
const version = packageJson.version;

// UserScript 头部
const header = `// ==UserScript==
// @name         BiliSpeedUp
// @name:zh-CN   B站视频倍速工具
// @namespace    https://github.com/timerring/BiliSpeedUp
// @version      ${version}
// @description  提供B站多倍速播放功能，支持自定义记忆播放速度、鼠标滚轮调节、触控板调节、记忆倍速
// @author       timerring
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/bangumi/play/*
// @grant        none
// @license      MIT
// @homepage     https://github.com/timerring/BiliSpeedUp
// @supportURL   https://github.com/timerring/BiliSpeedUp/issues
// @updateURL    https://github.com/timerring/BiliSpeedUp/raw/main/BiliSpeedUp.user.js
// @downloadURL  https://github.com/timerring/BiliSpeedUp/raw/main/BiliSpeedUp.user.js
// ==/UserScript==

`;

// 读取构建后的文件
const distFile = path.join(rootDir, 'dist/BiliSpeedUp.js');
const outputFile = path.join(rootDir, 'dist/BiliSpeedUp.user.js');

try {
    let content = fs.readFileSync(distFile, 'utf-8');
    
    // 移除 dist 文件中的 UserScript 头部（如果有）
    content = content.replace(/\/\/ ==UserScript==[\s\S]*?\/\/ ==\/UserScript==\s*\n*/g, '');
    
    // 组合新的 UserScript 文件
    const userscript = header + content;
    
    // 写入文件
    fs.writeFileSync(outputFile, userscript, 'utf-8');
    
    console.log('UserScript 文件生成成功: BiliSpeedUp.user.js');
    console.log(`文件大小: ${(userscript.length / 1024).toFixed(2)} KB`);
} catch (error) {
    console.error('生成 UserScript 文件失败:', error);
    process.exit(1);
}
