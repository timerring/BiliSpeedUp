/**
 * DOM 工具函数
 */

/**
 * 等待元素出现
 * @param {string} selector - 选择器
 * @param {number} timeout - 超时时间（毫秒）
 * @returns {Promise<Element>}
 */
export function waitForElement(selector, timeout = 30000) {
    return new Promise((resolve, reject) => {
        const element = document.querySelector(selector);
        if (element) {
            resolve(element);
            return;
        }

        const observer = new MutationObserver(() => {
            const element = document.querySelector(selector);
            if (element) {
                observer.disconnect();
                resolve(element);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        setTimeout(() => {
            observer.disconnect();
            reject(new Error(`Element ${selector} not found within ${timeout}ms`));
        }, timeout);
    });
}

/**
 * 创建样式元素
 * @param {string} css - CSS 内容
 * @returns {HTMLStyleElement}
 */
export function createStyle(css) {
    const style = document.createElement('style');
    style.textContent = css;
    return style;
}

/**
 * 检查页面是否为 B站视频页面
 * @returns {boolean}
 */
export function isBilibiliVideoPage() {
    return location.hostname.includes('bilibili.com') && 
           (location.pathname.includes('/video/') || location.pathname.includes('/bangumi/play/'));
}
