/**
 * 设备识别工具
 */
import { WHEEL_CONFIG } from '../config/index.js';

/**
 * 判断是否为触控板
 * @param {WheelEvent} event - 滚轮事件
 * @returns {boolean}
 */
export function isTouchpad(event) {
    // deltaMode === 0 (DOM_DELTA_PIXEL) 通常是触控板
    // deltaMode === 1 (DOM_DELTA_LINE) 通常是鼠标滚轮
    return event.deltaMode === 0 && Math.abs(event.deltaY) < WHEEL_CONFIG.TOUCHPAD_DELTA_LIMIT;
}

/**
 * 获取滚动方向
 * @param {number} deltaY - 滚动增量
 * @returns {number} 1 表示向下，-1 表示向上
 */
export function getScrollDirection(deltaY) {
    return deltaY > 0 ? 1 : -1;
}
