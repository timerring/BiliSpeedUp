// B站倍速播放增强 - 浏览器控制台版本
// 使用方法：打开B站视频页面，按 F12 打开控制台，控制台里复制此代码粘贴运行即可

(function() {
    'use strict';

    // 配置项
    const CONFIG = {
        STORAGE_KEY: 'bilibili_custom_speed',
        DEFAULT_SPEED: 1.0,
        MIN_SPEED: 0.07,
        MAX_SPEED: 10.0,
        SPEED_STEP: 0.01,
        CHECK_INTERVAL: 1000,
        MAX_RETRIES: 30
    };

    // 获取保存的倍速
    function getSavedSpeed() {
        try {
            const saved = localStorage.getItem(CONFIG.STORAGE_KEY);
            return saved ? parseFloat(saved) : CONFIG.DEFAULT_SPEED;
        } catch (e) {
            console.error('获取保存的倍速失败:', e);
            return CONFIG.DEFAULT_SPEED;
        }
    }

    // 保存倍速
    function saveSpeed(speed) {
        try {
            localStorage.setItem(CONFIG.STORAGE_KEY, speed.toString());
        } catch (e) {
            console.error('保存倍速失败:', e);
        }
    }

    // 设置视频播放速度
    function setVideoSpeed(speed) {
        const video = document.querySelector('video');
        if (video) {
            video.playbackRate = speed;
            saveSpeed(speed);
            updateSpeedDisplay(speed);
        }
    }

    // 更新倍速显示
    function updateSpeedDisplay(speed) {
        const resultDiv = document.querySelector('.bpx-player-ctrl-playbackrate-result');
        if (resultDiv) {
            resultDiv.textContent = speed === 1 ? '倍速' : `${speed.toFixed(2)}x`;
        }

        // 更新菜单项的激活状态
        const menuItems = document.querySelectorAll('.bpx-player-ctrl-playbackrate-menu-item');
        menuItems.forEach(item => {
            const itemValue = parseFloat(item.getAttribute('data-value'));
            if (Math.abs(itemValue - speed) < 0.001) {
                item.classList.add('bpx-state-active');
            } else {
                item.classList.remove('bpx-state-active');
            }
        });

        // 更新自定义输入框的值
        const customInput = document.getElementById('custom-speed-input');
        if (customInput) {
            customInput.value = speed.toFixed(2);
        }

        // 更新滑块的值
        const customSlider = document.getElementById('custom-speed-slider');
        if (customSlider) {
            customSlider.value = speed;
        }
    }

    // 创建自定义倍速控制元素
    function createCustomSpeedControl() {
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

        // 创建输入框和滑块容器
        const controlsContainer = document.createElement('div');
        controlsContainer.style.cssText = 'display: flex; flex-direction: column; gap: 6px;';

        // 创建头部容器：输入框 + 滑块
        const headerRow = document.createElement('div');
        headerRow.style.cssText = 'display: flex; align-items: center; gap: 6px; justify-content: center;';

        // 创建输入框
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

        input.onmouseover = () => {
            input.style.background = '#3a3a3a';
        };
        input.onmouseout = () => {
            input.style.background = '#212121';
        };

        // 事件处理
        const applySpeedFromInput = () => {
            let speed = parseFloat(input.value);
            if (isNaN(speed)) {
                speed = CONFIG.DEFAULT_SPEED;
            }
            speed = Math.max(CONFIG.MIN_SPEED, Math.min(CONFIG.MAX_SPEED, speed));
            input.value = speed.toFixed(2);
            setVideoSpeed(speed);
        };

        input.onkeypress = (e) => {
            if (e.key === 'Enter') {
                e.stopPropagation();
                applySpeedFromInput();
            }
        };

        input.onblur = () => {
            applySpeedFromInput();
        };

        // 阻止点击事件冒泡，避免关闭菜单
        customItem.onclick = (e) => {
            e.stopPropagation();
        };

        // 组装元素（仅输入框）
        headerRow.appendChild(input);
        controlsContainer.appendChild(headerRow);
        customItem.appendChild(controlsContainer);

        return customItem;
    }

    // 增强现有的倍速菜单
    function enhanceSpeedMenu() {
        const menu = document.querySelector('.bpx-player-ctrl-playbackrate-menu');
        if (!menu) return false;

        // 检查是否已经添加过自定义控件
        if (menu.querySelector('.custom-speed-item')) {
            return true;
        }

        // 添加自定义倍速控制，并插入到 2.0x 选项上方
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

        // 为倍速按钮添加滚轮调节事件（鼠标步进 0.1，触控板更细腻）
        const playbackBtn = document.querySelector('.bpx-player-ctrl-btn.bpx-player-ctrl-playbackrate');
        if (playbackBtn && !playbackBtn.dataset.customWheelBound) {
            playbackBtn.dataset.customWheelBound = 'true';
            let touchpadDeltaAccum = 0;
            playbackBtn.addEventListener('wheel', (e) => {
                e.preventDefault();
                e.stopPropagation();

                const video = document.querySelector('video');
                if (!video) return;

                let speed = video.playbackRate || CONFIG.DEFAULT_SPEED;
                let deltaY = e.deltaY;

                // deltaMode === 0 (DOM_DELTA_PIXEL) 通常是触控板
                // deltaMode === 1 (DOM_DELTA_LINE) 通常是鼠标滚轮
                const isTouchpad = e.deltaMode === 0 && Math.abs(e.deltaY) < 50;
                if (isTouchpad) {
                    // 触控板：向上滚动（deltaY < 0）加速，向下滚动（deltaY > 0）减速

                    // 累积触控板滚动量，只有累计到一定阈值时才调整一次倍速，降低灵敏度
                    const threshold = 30;      // 阈值越大，滑动越多才会生效
                    const touchpadStep = 0.02; // 每次调整的倍速步进

                    touchpadDeltaAccum += deltaY;
                    if (Math.abs(touchpadDeltaAccum) < threshold) {
                        return;
                    }

                    // 注意：在当前环境中，向上滑动时 deltaY 为正，向下滑动为负
                    const direction = touchpadDeltaAccum > 0 ? 1 : -1;
                    touchpadDeltaAccum -= direction * threshold;
                    speed += direction * touchpadStep;
                } else {
                    const wheelStep = 0.1;
                    // 鼠标滚轮：向下滚（deltaY > 0）减速，向上滚（deltaY < 0）加速
                    if (deltaY > 0) {
                        speed -= wheelStep;
                    } else if (deltaY < 0) {
                        speed += wheelStep;
                    } else {
                        return;
                    }
                }

                speed = Math.max(CONFIG.MIN_SPEED, Math.min(CONFIG.MAX_SPEED, speed));
                // 触控板四舍五入到 0.02 精度，鼠标滚轮四舍五入到 0.1 精度
                speed = isTouchpad ? Math.round(speed * 50) / 50 : Math.round(speed * 10) / 10;

                setVideoSpeed(speed);
            }, { passive: false });
        }

        console.log('B站倍速增强已加载');
        return true;
    }

    // 应用保存的倍速
    function applySavedSpeed() {
        const savedSpeed = getSavedSpeed();
        if (savedSpeed !== CONFIG.DEFAULT_SPEED) {
            const video = document.querySelector('video');
            if (video) {
                video.playbackRate = savedSpeed;
                updateSpeedDisplay(savedSpeed);
                console.log(`已应用保存的倍速: ${savedSpeed}x`);
            }
        }
    }

    /*
     * 首次使用引导模块 (Tour Guide)
     */
    class TourGuide {
        constructor() {
            this.steps = [];
            this.currentStep = 0;
            this.overlay = null;
            this.tooltip = null;
            this.storageKey = 'bilibili_speed_tour_shown_v1'; 
        }

        start() {
            if (localStorage.getItem(this.storageKey)) return;
            
            this.initStyles();
            this.createOverlay();
            this.createTooltip();
            
            this.steps = [
                {
                    element: '.bpx-player-ctrl-playbackrate',
                    title: '倍速控制增强',
                    content: '👋 欢迎使用倍速增强脚本！<br>这里是倍速控制入口，支持悬停查看菜单。',
                    position: 'top'
                },
                {
                    element: '#custom-speed-input',
                    title: '自定义倍速',
                    content: '🔢 在这里直接输入任意倍速 (0.07 - 10.0)。<br>支持 0.01 精度，输入后回车即可应用。',
                    position: 'right',
                    action: () => {
                        // 强制显示菜单
                        const menu = document.querySelector('.bpx-player-ctrl-playbackrate-menu');
                        if (menu) {
                            menu.style.display = 'block';
                            menu.style.visibility = 'visible';
                            menu.style.opacity = '1';
                        }
                        // 聚焦输入框
                        const input = document.querySelector('#custom-speed-input');
                        if (input) input.focus();
                    }
                },
                {
                    element: '.bpx-player-ctrl-playbackrate-menu',
                    title: '滚轮与触控板调节',
                    content: '🖱️ <b>鼠标滚轮：</b>在按钮或菜单上滚动，快速调节 (±0.1)。<br>👆 <b>触控板：</b>在按钮或菜单上上下滑动，细腻微调 (±0.02)。<br>上滑加速，下滑减速。<br><br>💾 <b>自动记忆：</b>您的倍速设置会自动保存，下次观看自动恢复。',
                    position: 'left',
                    action: () => {
                        // 确保菜单显示
                        const menu = document.querySelector('.bpx-player-ctrl-playbackrate-menu');
                        if (menu) {
                            menu.style.display = 'block';
                            menu.style.visibility = 'visible';
                            menu.style.opacity = '1';
                        }
                    },
                    isLast: true
                }
            ];

            setTimeout(() => this.showStep(0), 1000);
        }

        initStyles() {
            const style = document.createElement('style');
            style.textContent = `
                .tour-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.6); z-index: 99999; pointer-events: auto; transition: opacity 0.3s; }
                .tour-highlight { position: absolute; box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.6); z-index: 99998; border-radius: 4px; pointer-events: none; transition: all 0.3s ease; border: 2px solid #00aeec; }
                .tour-tooltip { position: absolute; background: #212121; color: #fff; padding: 16px; border-radius: 8px; width: 280px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3); z-index: 100000; font-size: 14px; line-height: 1.6; border: 1px solid #3a3a3a; transition: all 0.3s ease; }
                .tour-tooltip h3 { margin: 0 0 8px 0; color: #00aeec; font-size: 16px; font-weight: bold; }
                .tour-tooltip p { margin: 0 0 16px 0; color: #e0e0e0; }
                .tour-footer { display: flex; justify-content: flex-end; gap: 10px; }
                .tour-btn { padding: 6px 12px; border-radius: 4px; cursor: pointer; border: none; font-size: 12px; transition: background 0.2s; }
                .tour-btn-skip { background: transparent; color: #999; }
                .tour-btn-skip:hover { color: #ccc; }
                .tour-btn-next { background: #00aeec; color: #fff; }
                .tour-btn-next:hover { background: #008bbd; }
            `;
            document.head.appendChild(style);
        }

        createOverlay() {
            this.highlight = document.createElement('div');
            this.highlight.className = 'tour-highlight';
            document.body.appendChild(this.highlight);
        }

        createTooltip() {
            this.tooltip = document.createElement('div');
            this.tooltip.className = 'tour-tooltip';
            document.body.appendChild(this.tooltip);
        }

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

                if (step.position === 'top') {
                    this.tooltip.style.top = `${rect.top + scrollY - 160}px`;
                    this.tooltip.style.left = `${rect.left + scrollX - 100}px`;
                    this.tooltip.style.transform = 'none';
                } else if (step.position === 'right') {
                    this.tooltip.style.top = `${rect.top + scrollY}px`;
                    this.tooltip.style.left = `${rect.right + scrollX + 20}px`;
                    this.tooltip.style.transform = 'none';
                } else if (step.position === 'left') {
                    this.tooltip.style.top = `${rect.top + scrollY}px`;
                    this.tooltip.style.left = `${rect.left + scrollX - 300}px`; // 提示框宽度 280 + 间距 20
                    this.tooltip.style.transform = 'none';
                }
            }

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

        end() {
            if (this.highlight) this.highlight.remove();
            if (this.tooltip) this.tooltip.remove();
            localStorage.setItem(this.storageKey, 'true');
            
            // 确保菜单关闭
            const btn = document.querySelector('.bpx-player-ctrl-playbackrate');
            if (btn) btn.dispatchEvent(new MouseEvent('mouseout'));
            const menu = document.querySelector('.bpx-player-ctrl-playbackrate-menu');
            if (menu) {
                menu.style.display = '';
                menu.style.visibility = '';
                menu.style.opacity = '';
            }
        }
    }

    // 初始化
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
                
                // 监听视频元素变化，以处理切换视频的情况
                const observer = new MutationObserver(() => {
                    applySavedSpeed();
                });
                
                const video = document.querySelector('video');
                if (video) {
                    observer.observe(video.parentElement, {
                        childList: true,
                        subtree: true
                    });
                }
            }
            
            // 超过最大重试次数则停止
            if (retries >= CONFIG.MAX_RETRIES) {
                clearInterval(checkAndInit);
                console.warn('B站倍速增强加载失败：未找到播放器控制元素');
            }
        }, CONFIG.CHECK_INTERVAL);
    }

    // 检查是否在B站视频页面
    if (location.hostname.includes('bilibili.com') && 
        (location.pathname.includes('/video/') || location.pathname.includes('/bangumi/play/'))) {
        console.log('开始加载 B站倍速增强...');
        init();
    } else {
        console.warn('请在 B站视频页面运行此脚本');
    }

})();
