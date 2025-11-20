/**
 * 菜单增强模块
 */
import { SELECTORS } from '../config/index.js';
import { setVideoSpeed } from '../core/speed-control.js';
import { createCustomSpeedControl } from './speed-input.js';
import { attachWheelHandler } from './wheel-handler.js';

/**
 * 增强倍速菜单
 * @returns {boolean} 是否成功增强
 */
export function enhanceSpeedMenu() {
    const menu = document.querySelector(SELECTORS.PLAYBACK_RATE_MENU);
    if (!menu) return false;

    // 检查是否已经添加过自定义控件
    if (menu.querySelector(SELECTORS.CUSTOM_SPEED_ITEM)) {
        return true;
    }

    // 添加自定义倍速控制
    const customControl = createCustomSpeedControl();
    const twoXItem = menu.querySelector('.bpx-player-ctrl-playbackrate-menu-item[data-value="2"]');
    const firstItem = menu.querySelector('.bpx-player-ctrl-playbackrate-menu-item:not(.custom-speed-item)');
    
    if (twoXItem) {
        menu.insertBefore(customControl, twoXItem);
    } else if (firstItem) {
        menu.insertBefore(customControl, firstItem);
    } else {
        menu.appendChild(customControl);
    }

    // 为现有的倍速选项添加点击事件
    const menuItems = menu.querySelectorAll('.bpx-player-ctrl-playbackrate-menu-item:not(.custom-speed-item)');
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            const speed = parseFloat(item.getAttribute('data-value'));
            setVideoSpeed(speed);
        });
    });

    // 为倍速按钮添加滚轮调节事件
    attachWheelHandler();

    console.log('B站倍速增强已加载');
    return true;
}
