/**
 * 首次使用引导系统
 */
import { CONFIG, SELECTORS } from '../config/index.js';
import { isTourShown, markTourShown } from '../core/storage.js';
import { getTourStyles } from './animations.js';
import { createStyle } from '../utils/dom.js';

export class TourGuide {
    constructor() {
        this.steps = [];
        this.currentStep = 0;
        this.overlay = null;
        this.tooltip = null;
        this.highlight = null;
    }

    /**
     * 启动引导
     */
    start() {
        if (isTourShown(CONFIG.TOUR_VERSION)) return;
        
        this.initStyles();
        this.createOverlay();
        this.createTooltip();
        this.defineSteps();
        
        setTimeout(() => this.showStep(0), 1000);
    }

    /**
     * 初始化样式
     */
    initStyles() {
        const style = createStyle(getTourStyles());
        document.head.appendChild(style);
    }

    /**
     * 创建遮罩层
     */
    createOverlay() {
        this.highlight = document.createElement('div');
        this.highlight.className = 'tour-highlight';
        document.body.appendChild(this.highlight);
    }

    /**
     * 创建提示框
     */
    createTooltip() {
        this.tooltip = document.createElement('div');
        this.tooltip.className = 'tour-tooltip';
        document.body.appendChild(this.tooltip);
    }

    /**
     * 定义引导步骤
     */
    defineSteps() {
        this.steps = [
            {
                element: SELECTORS.PLAYBACK_RATE_BTN,
                title: '倍速控制增强',
                content: '👋 欢迎使用倍速增强脚本！<br>这里是倍速控制入口，支持悬停查看菜单。',
                position: 'top'
            },
            {
                element: SELECTORS.CUSTOM_SPEED_INPUT,
                title: '自定义倍速',
                content: '🔢 在这里直接输入任意倍速 (0.07 - 10.0)。<br>支持 0.01 精度，输入后回车即可应用。',
                position: 'right',
                action: () => {
                    const menu = document.querySelector(SELECTORS.PLAYBACK_RATE_MENU);
                    if (menu) {
                        menu.style.display = 'block';
                        menu.style.visibility = 'visible';
                        menu.style.opacity = '1';
                    }
                    const input = document.querySelector(SELECTORS.CUSTOM_SPEED_INPUT);
                    if (input) input.focus();
                }
            },
            {
                element: SELECTORS.PLAYBACK_RATE_MENU,
                title: '滚轮与触控板调节',
                content: `
                    <div class="anim-container">
                        <div class="anim-box">
                            <div class="anim-mouse"><div class="anim-scroll"></div></div>
                            <span class="anim-label">鼠标滚轮</span>
                        </div>
                        <div class="anim-box">
                            <div class="anim-touchpad"><div class="anim-finger"></div></div>
                            <span class="anim-label">触控板滑动</span>
                        </div>
                    </div>
                    上滑/滚动增加倍速，下滑/滚动减少倍速。<br><br>
                    🖱️ <b>鼠标滚轮：</b>在按钮或菜单上滚动，快速调节 (±0.1)。<br>
                    👆 <b>触控板：</b>在按钮或菜单上上下滑动，细腻微调 (±0.02)。<br>
                    💾 <b>自动记忆：</b>您的倍速设置会自动保存，下次观看自动恢复。
                `,
                position: 'left',
                action: () => {
                    const menu = document.querySelector(SELECTORS.PLAYBACK_RATE_MENU);
                    if (menu) {
                        menu.style.display = 'block';
                        menu.style.visibility = 'visible';
                        menu.style.opacity = '1';
                    }
                },
                isLast: true
            }
        ];
    }

    /**
     * 显示指定步骤
     * @param {number} index - 步骤索引
     */
    showStep(index) {
        if (index >= this.steps.length) {
            this.end();
            return;
        }

        this.currentStep = index;
        const step = this.steps[index];
        if (step.action) step.action();

        let target = step.element;
        if (typeof target === 'string') target = document.querySelector(target);

        if (!target && !step.isLast) {
            this.showStep(index + 1);
            return;
        }

        // 强制保持菜单显示
        if (step.element === SELECTORS.PLAYBACK_RATE_MENU || step.element === SELECTORS.CUSTOM_SPEED_INPUT) {
            const menu = document.querySelector(SELECTORS.PLAYBACK_RATE_MENU);
            if (menu) {
                menu.style.display = 'block !important';
                menu.style.visibility = 'visible !important';
                menu.style.opacity = '1 !important';
                menu.classList.add('tour-force-show');
            }
        }

        if (step.position === 'center') {
            this.highlight.style.display = 'none';
            this.tooltip.style.top = '50%';
            this.tooltip.style.left = '50%';
            this.tooltip.style.transform = 'translate(-50%, -50%)';
        } else {
            const rect = target.getBoundingClientRect();
            const scrollY = window.scrollY;
            const scrollX = window.scrollX;

            this.highlight.style.display = 'block';
            this.highlight.style.width = `${rect.width}px`;
            this.highlight.style.height = `${rect.height}px`;
            this.highlight.style.top = `${rect.top + scrollY}px`;
            this.highlight.style.left = `${rect.left + scrollX}px`;

            this.positionTooltip(step.position, rect, scrollY, scrollX);
        }

        this.renderTooltip(step);
    }

    /**
     * 定位提示框
     */
    positionTooltip(position, rect, scrollY, scrollX) {
        if (position === 'top') {
            this.tooltip.style.top = `${rect.top + scrollY - 160}px`;
            this.tooltip.style.left = `${rect.left + scrollX - 100}px`;
            this.tooltip.style.transform = 'none';
        } else if (position === 'right') {
            this.tooltip.style.top = `${rect.top + scrollY}px`;
            this.tooltip.style.left = `${rect.right + scrollX + 20}px`;
            this.tooltip.style.transform = 'none';
        } else if (position === 'left') {
            this.tooltip.style.top = `${rect.top + scrollY}px`;
            this.tooltip.style.left = `${rect.left + scrollX - 320}px`;
            this.tooltip.style.transform = 'none';
        }
    }

    /**
     * 渲染提示框内容
     */
    renderTooltip(step) {
        this.tooltip.innerHTML = `
            <h3>${step.title}</h3>
            <p>${step.content}</p>
            <div class="tour-footer">
                <button class="tour-btn tour-btn-skip" id="tour-skip">跳过</button>
                <button class="tour-btn tour-btn-next" id="tour-next">
                    ${step.isLast ? '完成' : '下一步'}
                </button>
            </div>
        `;

        document.getElementById('tour-next').onclick = () => this.showStep(this.currentStep + 1);
        document.getElementById('tour-skip').onclick = () => this.end();
    }

    /**
     * 结束引导
     */
    end() {
        if (this.highlight) this.highlight.remove();
        if (this.tooltip) this.tooltip.remove();
        markTourShown(CONFIG.TOUR_VERSION);
        
        // 清理强制显示的样式和类名
        const menu = document.querySelector(SELECTORS.PLAYBACK_RATE_MENU);
        if (menu) {
            menu.classList.remove('tour-force-show');
            menu.style.display = '';
            menu.style.visibility = '';
            menu.style.opacity = '';
        }
        
        // 确保菜单关闭
        const btn = document.querySelector(SELECTORS.PLAYBACK_RATE_BTN);
        if (btn) btn.dispatchEvent(new MouseEvent('mouseout'));
    }
}
