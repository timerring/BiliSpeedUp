/**
 * 倍速控制核心模块
 */
import { CONFIG, SELECTORS } from '../config/index.js';
import { saveSpeed, getSavedSpeed } from './storage.js';

/**
 * 设置视频播放速度
 * @param {number} speed - 倍速值
 */
export function setVideoSpeed(speed) {
    const video = document.querySelector(SELECTORS.VIDEO);
    if (video) {
        video.playbackRate = speed;
        saveSpeed(speed);
        updateSpeedDisplay(speed);
    }
}

/**
 * 更新倍速显示
 * @param {number} speed - 倍速值
 */
export function updateSpeedDisplay(speed) {
    const resultDiv = document.querySelector(SELECTORS.PLAYBACK_RATE_RESULT);
    if (resultDiv) {
        resultDiv.textContent = speed === 1 ? '倍速' : `${speed.toFixed(2)}x`;
    }

    // 更新菜单项的激活状态
    const menuItems = document.querySelectorAll(SELECTORS.MENU_ITEM);
    menuItems.forEach(item => {
        const itemValue = parseFloat(item.getAttribute('data-value'));
        if (Math.abs(itemValue - speed) < 0.001) {
            item.classList.add('bpx-state-active');
        } else {
            item.classList.remove('bpx-state-active');
        }
    });

    // 更新自定义输入框的值
    const customInput = document.querySelector(SELECTORS.CUSTOM_SPEED_INPUT);
    if (customInput) {
        customInput.value = speed.toFixed(2);
    }
}

/**
 * 应用保存的倍速
 */
export function applySavedSpeed() {
    const savedSpeed = getSavedSpeed();
    if (savedSpeed !== CONFIG.DEFAULT_SPEED) {
        const video = document.querySelector(SELECTORS.VIDEO);
        if (video) {
            video.playbackRate = savedSpeed;
            updateSpeedDisplay(savedSpeed);
            console.log(`已应用保存的倍速: ${savedSpeed}x`);
        }
    }
}

/**
 * 限制倍速范围
 * @param {number} speed - 倍速值
 * @returns {number} 限制后的倍速值
 */
export function clampSpeed(speed) {
    return Math.max(CONFIG.MIN_SPEED, Math.min(CONFIG.MAX_SPEED, speed));
}
