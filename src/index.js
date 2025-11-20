/**
 * B站倍速播放增强 - 主入口
 * @author timerring
 * @version 1.0.0
 */

import { CONFIG } from './config/index.js';
import { applySavedSpeed } from './core/speed-control.js';
import { startVideoMonitor } from './core/video-monitor.js';
import { enhanceSpeedMenu } from './ui/menu-enhancer.js';
import { TourGuide } from './tour/tour-guide.js';
import { isBilibiliVideoPage } from './utils/dom.js';

/**
 * 初始化脚本
 */
function init() {
    let retries = 0;
    
    const checkAndInit = setInterval(() => {
        retries++;
        
        // 尝试增强菜单
        if (enhanceSpeedMenu()) {
            // 应用保存的倍速
            setTimeout(applySavedSpeed, 500);
            
            // 启动引导（如果是首次）
            setTimeout(() => new TourGuide().start(), 1500);
            
            clearInterval(checkAndInit);
            
            // 启动视频监听
            startVideoMonitor();
        }
        
        // 超过最大重试次数则停止
        if (retries >= CONFIG.MAX_RETRIES) {
            clearInterval(checkAndInit);
            console.warn('B站倍速增强加载失败：未找到播放器控制元素');
        }
    }, CONFIG.CHECK_INTERVAL);
}

/**
 * 主函数
 */
function main() {
    // 检查是否在B站视频页面
    if (isBilibiliVideoPage()) {
        console.log('开始加载 B站倍速增强...');
        init();
    } else {
        console.warn('请在 B站视频页面运行此脚本');
    }
}

// 启动脚本
main();
