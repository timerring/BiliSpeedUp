/**
 * 滚轮和触控板处理模块
 */
import { CONFIG, WHEEL_CONFIG, SELECTORS } from '../config/index.js';
import { setVideoSpeed, clampSpeed } from '../core/speed-control.js';
import { isTouchpad, getScrollDirection } from '../utils/device.js';

/**
 * 为倍速按钮添加滚轮事件监听
 */
export function attachWheelHandler() {
    const playbackBtn = document.querySelector(SELECTORS.PLAYBACK_RATE_BTN);
    if (!playbackBtn || playbackBtn.dataset.customWheelBound) {
        return;
    }

    playbackBtn.dataset.customWheelBound = 'true';
    let touchpadDeltaAccum = 0;

    playbackBtn.addEventListener('wheel', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const video = document.querySelector(SELECTORS.VIDEO);
        if (!video) return;

        let speed = video.playbackRate || CONFIG.DEFAULT_SPEED;
        const isTouch = isTouchpad(e);

        if (isTouch) {
            // 触控板：累积阈值 + 细腻步进
            touchpadDeltaAccum += e.deltaY;
            
            if (Math.abs(touchpadDeltaAccum) < WHEEL_CONFIG.TOUCHPAD_THRESHOLD) {
                return;
            }

            const direction = getScrollDirection(touchpadDeltaAccum);
            touchpadDeltaAccum -= direction * WHEEL_CONFIG.TOUCHPAD_THRESHOLD;
            speed += direction * WHEEL_CONFIG.TOUCHPAD_STEP;
            
            // 触控板四舍五入到 0.02 精度
            speed = Math.round(speed * 50) / 50;
        } else {
            // 鼠标滚轮：直接步进（方向反转：向上增加，向下减少）
            const direction = getScrollDirection(e.deltaY);
            speed -= direction * WHEEL_CONFIG.MOUSE_STEP;  // 使用减法反转方向
            
            // 鼠标滚轮四舍五入到 0.1 精度
            speed = Math.round(speed * 10) / 10;
        }

        speed = clampSpeed(speed);
        setVideoSpeed(speed);
    }, { passive: false });
}
