/**
 * 倍速输入框组件
 */
import { CONFIG, SELECTORS } from '../config/index.js';
import { getSavedSpeed } from '../core/storage.js';
import { setVideoSpeed, clampSpeed } from '../core/speed-control.js';

/**
 * 创建自定义倍速输入框
 * @returns {HTMLElement}
 */
export function createSpeedInput() {
    const input = document.createElement('input');
    input.type = 'number';
    input.id = 'custom-speed-input';
    input.min = CONFIG.MIN_SPEED;
    input.max = CONFIG.MAX_SPEED;
    input.step = CONFIG.SPEED_STEP;
    input.value = getSavedSpeed().toFixed(2);
    input.style.cssText = `
        width: 52px;
        padding: 4px 6px;
        border: 1px solid #3a3a3a;
        border-radius: 4px;
        font-size: 14px;
        text-align: center;
        color: #fff;
        background: #212121;
        appearance: textfield;
        -moz-appearance: textfield;
        -webkit-appearance: none;
    `;

    // 悬停效果
    input.onmouseover = () => {
        input.style.background = '#3a3a3a';
    };
    input.onmouseout = () => {
        input.style.background = '#212121';
    };

    // 应用倍速
    const applySpeed = () => {
        let speed = parseFloat(input.value);
        if (isNaN(speed)) {
            speed = CONFIG.DEFAULT_SPEED;
        }
        speed = clampSpeed(speed);
        input.value = speed.toFixed(2);
        setVideoSpeed(speed);
    };

    // 回车应用
    input.onkeypress = (e) => {
        if (e.key === 'Enter') {
            e.stopPropagation();
            applySpeed();
        }
    };

    // 失焦应用
    input.onblur = applySpeed;

    return input;
}

/**
 * 创建自定义倍速控制容器
 * @returns {HTMLElement}
 */
export function createCustomSpeedControl() {
    const customItem = document.createElement('li');
    customItem.className = 'bpx-player-ctrl-playbackrate-menu-item custom-speed-item';
    customItem.style.cssText = `
        padding: 8px 10px;
        cursor: default;
        background: transparent;
        margin-top: 0;
        border-top: none;
        display: flex;
        align-items: center;
        justify-content: center;
    `;

    const controlsContainer = document.createElement('div');
    controlsContainer.style.cssText = 'display: flex; flex-direction: column; gap: 6px;';

    const headerRow = document.createElement('div');
    headerRow.style.cssText = 'display: flex; align-items: center; gap: 6px; justify-content: center;';

    const input = createSpeedInput();
    headerRow.appendChild(input);
    controlsContainer.appendChild(headerRow);
    customItem.appendChild(controlsContainer);

    // 阻止点击事件冒泡
    customItem.onclick = (e) => {
        e.stopPropagation();
    };

    return customItem;
}
