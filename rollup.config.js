import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

const banner = `// ==UserScript==
// @name         BiliSpeedUp
// @namespace    https://github.com/timerring/BiliSpeedUp
// @version      1.0.0
// @description  提供B站多倍速播放功能，支持自定义记忆播放速度、鼠标滚轮调节、触控板调节
// @author       timerring
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/bangumi/play/*
// @grant        none
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';
`;

const footer = `
})();`;

export default [
    // 开发版本（未压缩）
    {
        input: 'src/index.js',
        output: {
            file: 'dist/BiliSpeedUp.js',
            format: 'iife',
            banner: banner,
            footer: footer
        },
        plugins: [
            resolve()
        ]
    },
    // 生产版本（压缩）
    {
        input: 'src/index.js',
        output: {
            file: 'dist/BiliSpeedUp.min.js',
            format: 'iife',
            banner: banner,
            footer: footer
        },
        plugins: [
            resolve(),
            terser({
                format: {
                    comments: false,
                    preamble: banner
                }
            })
        ]
    }
];
