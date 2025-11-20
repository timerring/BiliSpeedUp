/**
 * 配置常量
 */
export const CONFIG = {
    STORAGE_KEY: 'bilibili_custom_speed',
    DEFAULT_SPEED: 1.0,
    MIN_SPEED: 0.07,
    MAX_SPEED: 10.0,
    SPEED_STEP: 0.01,
    CHECK_INTERVAL: 1000,
    MAX_RETRIES: 30,
    // 引导功能版本控制，修改版本号重新显示引导
    TOUR_VERSION: '1.0.0'
};

/**
 * 滚轮和触控板配置
 */
export const WHEEL_CONFIG = {
    MOUSE_STEP: 0.1,           // 鼠标滚轮步进
    TOUCHPAD_STEP: 0.02,       // 触控板步进
    TOUCHPAD_THRESHOLD: 30,    // 触控板累积阈值
    TOUCHPAD_DELTA_LIMIT: 50   // 触控板判断阈值
};

/**
 * 选择器常量
 */
export const SELECTORS = {
    VIDEO: 'video',
    PLAYBACK_RATE_BTN: '.bpx-player-ctrl-btn.bpx-player-ctrl-playbackrate',
    PLAYBACK_RATE_MENU: '.bpx-player-ctrl-playbackrate-menu',
    PLAYBACK_RATE_RESULT: '.bpx-player-ctrl-playbackrate-result',
    MENU_ITEM: '.bpx-player-ctrl-playbackrate-menu-item',
    CUSTOM_SPEED_INPUT: '#custom-speed-input',
    CUSTOM_SPEED_ITEM: '.custom-speed-item'
};
