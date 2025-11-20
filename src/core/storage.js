/**
 * 本地存储管理模块
 */
import { CONFIG } from '../config/index.js';

/**
 * 获取保存的倍速
 * @returns {number} 保存的倍速值
 */
export function getSavedSpeed() {
    try {
        const saved = localStorage.getItem(CONFIG.STORAGE_KEY);
        return saved ? parseFloat(saved) : CONFIG.DEFAULT_SPEED;
    } catch (e) {
        console.error('获取保存的倍速失败:', e);
        return CONFIG.DEFAULT_SPEED;
    }
}

/**
 * 保存倍速
 * @param {number} speed - 倍速值
 */
export function saveSpeed(speed) {
    try {
        localStorage.setItem(CONFIG.STORAGE_KEY, speed.toString());
    } catch (e) {
        console.error('保存倍速失败:', e);
    }
}

/**
 * 检查引导是否已显示
 * @param {string} version - 引导版本号
 * @returns {boolean}
 */
export function isTourShown(version) {
    const key = `bilibili_speed_tour_shown_v${version}`;
    return !!localStorage.getItem(key);
}

/**
 * 标记引导已显示
 * @param {string} version - 引导版本号
 */
export function markTourShown(version) {
    const key = `bilibili_speed_tour_shown_v${version}`;
    localStorage.setItem(key, 'true');
}
