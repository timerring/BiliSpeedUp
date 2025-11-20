/**
 * 引导动画样式
 */

/**
 * 获取引导系统的 CSS 样式
 * @returns {string}
 */
export function getTourStyles() {
    return `
        .tour-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.6); z-index: 99999; pointer-events: none; transition: opacity 0.3s; }
        .tour-highlight { position: absolute; box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.6); z-index: 99998; border-radius: 4px; pointer-events: none; transition: all 0.3s ease; border: 2px solid #00aeec; }
        .tour-tooltip { position: absolute; background: #212121; color: #fff; padding: 16px; border-radius: 8px; width: 280px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3); z-index: 100000; font-size: 14px; line-height: 1.6; border: 1px solid #3a3a3a; transition: all 0.3s ease; pointer-events: none; }
        .tour-tooltip h3 { margin: 0 0 8px 0; color: #00aeec; font-size: 16px; font-weight: bold; }
        .tour-tooltip p { margin: 0 0 16px 0; color: #e0e0e0; }
        .tour-footer { display: flex; justify-content: flex-end; gap: 10px; pointer-events: auto; }
        .tour-btn { padding: 6px 12px; border-radius: 4px; cursor: pointer; border: none; font-size: 12px; transition: background 0.2s; pointer-events: auto; }
        .tour-btn-skip { background: transparent; color: #999; }
        .tour-btn-skip:hover { color: #ccc; }
        .tour-btn-next { background: #00aeec; color: #fff; }
        .tour-btn-next:hover { background: #008bbd; }

        /* 动画样式 */
        .anim-container { display: flex; gap: 20px; margin-bottom: 15px; justify-content: center; }
        .anim-box { display: flex; flex-direction: column; align-items: center; gap: 8px; }
        .anim-label { font-size: 12px; color: #999; }
        
        /* 鼠标图标 */
        .anim-mouse {
            width: 24px; height: 38px;
            border: 2px solid #fff; border-radius: 12px;
            position: relative;
        }
        .anim-scroll {
            width: 4px; height: 6px; background: #00aeec;
            border-radius: 2px; position: absolute;
            left: 50%; transform: translateX(-50%);
            top: 6px;
            animation: scroll-wheel 1.5s infinite;
        }
        @keyframes scroll-wheel {
            0% { top: 6px; opacity: 1; }
            100% { top: 20px; opacity: 0; }
        }

        /* 触控板图标 */
        .anim-touchpad {
            width: 38px; height: 38px;
            border: 2px solid #fff; border-radius: 4px;
            position: relative; overflow: hidden;
        }
        .anim-finger {
            width: 8px; height: 8px; background: #00aeec;
            border-radius: 50%; position: absolute;
            left: 50%; top: 60%;
            transform: translate(-50%, -50%);
            animation: scroll-touch 1.5s infinite;
            box-shadow: 0 0 0 4px rgba(0, 174, 236, 0.3);
        }
        @keyframes scroll-touch {
            0% { top: 70%; opacity: 0; }
            20% { top: 70%; opacity: 1; }
            80% { top: 30%; opacity: 1; }
            100% { top: 30%; opacity: 0; }
        }

        /* 强制显示菜单样式 */
        .tour-force-show {
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
        }
    `;
}
