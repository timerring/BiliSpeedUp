/**
 * 视频监听模块
 */
import { SELECTORS } from '../config/index.js';
import { applySavedSpeed } from './speed-control.js';

/**
 * 启动视频监听
 * 监听视频元素变化，自动应用保存的倍速
 */
export function startVideoMonitor() {
    const observer = new MutationObserver(() => {
        applySavedSpeed();
    });

    const video = document.querySelector(SELECTORS.VIDEO);
    if (video && video.parentElement) {
        observer.observe(video.parentElement, {
            childList: true,
            subtree: true
        });
    }

    return observer;
}
