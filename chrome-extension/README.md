# BiliSpeedUp

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Install](https://img.shields.io/badge/Install-UserScript-green.svg)](https://github.com/timerring/BiliSpeedUp/raw/main/dist/BiliSpeedUp.user.js)

B站视频倍速播放增强脚本，支持自定义倍速、智能记忆、多种调节方式。

Bilibili video playback speed enhancement script with custom speed control, intelligent memory, and multiple adjustment methods.

## 快速安装

### 方式一：Tampermonkey 一键安装

1. 安装 [Tampermonkey](https://www.tampermonkey.net/) 浏览器扩展
2. 点击安装脚本：[安装 BiliSpeedUp](https://github.com/timerring/BiliSpeedUp/raw/main/dist/BiliSpeedUp.user.js)
3. 打开 B站视频页面即可使用

### 方式二：Chrome 扩展安装

1. 下载 Chrome 扩展文件：[BiliSpeedUp-v1.0.0.zip](https://github.com/timerring/BiliSpeedUp/releases/latest)
2. 解压 ZIP 文件到本地目录
3. 打开 Chrome 浏览器，访问 `chrome://extensions/`
4. 开启右上角的「开发者模式」
5. 点击「加载已解压的扩展程序」
6. 选择解压后的扩展目录
7. 扩展安装完成，打开 B站视频页面即可使用

### 方式三：从源码构建

```bash
git clone https://github.com/timerring/BiliSpeedUp.git
cd BiliSpeedUp
npm install

# 构建 UserScript 版本
npm run build:userscript

# 构建 Chrome 扩展版本
npm run build:extension

# 构建所有版本
npm run build:all
```

生成的文件：
- `dist/BiliSpeedUp.user.js` - UserScript 版本，可直接安装到 Tampermonkey
- `chrome-extension/` - Chrome 扩展目录，可加载到 Chrome

## 核心特性

### 1. 精确倍速控制

- **超宽倍速范围**：支持 0.07x 到 10x 的任意倍速设置
- **高精度调节**：0.01 的精度步进，满足精细化播放需求
- **输入框直接输入**：支持键盘输入任意倍速值，按回车即可应用
- **实时生效**：倍速调整立即应用到当前视频播放

### 2. 多种调节方式

#### 鼠标滚轮调节
- 在倍速按钮或菜单上滚动鼠标滚轮
- 向上滚动增加倍速（每次 +0.1）
- 向下滚动减少倍速（每次 -0.1）
- 适合快速调整到目标倍速

#### 触控板滑动调节
- 在倍速按钮或菜单上双指上下滑动
- 向上滑动增加倍速（每次 +0.02）
- 向下滑动减少倍速（每次 -0.02）
- 采用累积阈值算法，提供更细腻的调节体验

#### 智能设备识别
- 自动区分鼠标滚轮和触控板事件
- 通过 `deltaMode` 和 `deltaY` 幅度判断设备类型
- 为不同输入设备提供差异化的调节步进

### 3. 智能记忆功能

- **自动保存**：倍速设置自动保存到浏览器本地存储（localStorage）
- **自动恢复**：下次打开视频时自动应用上次的倍速设置
- **跨视频同步**：在同一网站内切换视频，倍速设置保持一致
- **持久化存储**：即使关闭浏览器，倍速设置也会被保留

### 4. 首次使用引导

- **分步引导系统**：首次使用时自动显示交互式引导
- **功能演示**：逐步介绍倍速按钮、输入框、滚轮/触控板调节功能
- **动画演示**：包含鼠标滚轮和触控板操作的可视化动画
- **版本控制**：支持版本更新时重新显示引导
- **永久记忆**：完成引导后不再打扰用户

### 5. 用户界面设计

- **深色主题**：完美融入 B站原生播放器的深色风格
- **简洁布局**：在倍速菜单底部添加自定义输入框
- **视觉一致**：字体大小、间距、颜色与原生 UI 保持一致
- **悬浮菜单**：不影响视频观看体验
- **实时反馈**：倍速调整时显示当前倍速值

### 6. 视频监听机制

- **自动检测**：使用 MutationObserver 监听视频元素变化
- **自动应用**：新视频加载时自动应用保存的倍速
- **SPA 支持**：支持 B站单页应用的路由跳转
- **兼容性好**：适配 B站视频页面和番剧页面

## 使用方法

### 基础操作

1. **打开倍速菜单**
   - 点击播放器右下角的「倍速」按钮
   - 或将鼠标悬停在倍速按钮上

2. **输入框调节**
   - 在自定义输入框中输入想要的倍速值（例如：3.5）
   - 按回车键或点击输入框外部应用

3. **鼠标滚轮调节**
   - 将鼠标悬停在倍速按钮或菜单上
   - 向上滚动增加倍速（+0.1）
   - 向下滚动减少倍速（-0.1）

4. **触控板调节**
   - 将鼠标悬停在倍速按钮或菜单上
   - 双指向上滑动增加倍速（+0.02）
   - 双指向下滑动减少倍速（-0.02）

## 技术实现

### 项目结构

```
BiliSpeedUp/
├── src/
│   ├── config/           # 配置常量
│   │   └── index.js      # 倍速范围、步进、选择器等配置
│   ├── core/             # 核心功能
│   │   ├── storage.js    # localStorage 存储管理
│   │   ├── speed-control.js  # 倍速设置和更新逻辑
│   │   └── video-monitor.js  # 视频元素监听
│   ├── ui/               # 用户界面
│   │   ├── speed-input.js    # 自定义输入框
│   │   ├── wheel-handler.js  # 滚轮和触控板事件处理
│   │   └── menu-enhancer.js  # 菜单增强
│   ├── tour/             # 引导系统
│   │   ├── tour-guide.js     # 引导逻辑
│   │   └── animations.js     # CSS 动画样式
│   ├── utils/            # 工具函数
│   │   ├── device.js     # 设备识别
│   │   └── dom.js        # DOM 操作工具
│   └── index.js          # 主入口文件
├── dist/                 # 构建输出
│   ├── BiliSpeedUp.js        # 开发版
│   ├── BiliSpeedUp.min.js    # 生产版
│   └── BiliSpeedUp.user.js   # UserScript 版本
├── scripts/              # 构建脚本
│   └── build-userscript.js   # UserScript 文件生成
├── package.json          # 项目配置
└── rollup.config.js      # Rollup 打包配置
```

### 核心技术

#### 1. 模块化架构
- 采用 ES6 模块化开发
- 使用 Rollup 打包成单文件
- 清晰的职责分离和依赖管理

#### 2. DOM 操作
- 自动检测 B站播放器的倍速控制元素
- 动态注入自定义控制面板
- 实时更新倍速显示状态

#### 3. 事件处理
- 使用 `WheelEvent.deltaMode` 识别鼠标滚轮和触控板
- 累积阈值算法降低触控板灵敏度
- 防抖处理避免频繁触发

#### 4. 数据持久化
- 使用 `localStorage` 保存用户倍速偏好
- 版本化存储引导完成状态
- 自动清理过期数据

#### 5. 视频监听
- 使用 `MutationObserver` 监听视频元素变化
- 自动应用保存的倍速设置
- 支持视频切换和 SPA 路由跳转


## 配置说明

脚本支持以下配置（在 `src/config/index.js` 中）：

```javascript
export const CONFIG = {
    STORAGE_KEY: 'bilibili_custom_speed',  // 本地存储键名
    DEFAULT_SPEED: 1.0,                     // 默认倍速
    MIN_SPEED: 0.07,                        // 最小倍速
    MAX_SPEED: 10.0,                        // 最大倍速
    SPEED_STEP: 0.01,                       // 调整步长
    CHECK_INTERVAL: 1000,                   // 检测间隔（毫秒）
    MAX_RETRIES: 30,                        // 最大重试次数
    TOUR_VERSION: '1.0.0'                   // 引导版本号
};

export const WHEEL_CONFIG = {
    MOUSE_STEP: 0.1,           // 鼠标滚轮步进
    TOUCHPAD_STEP: 0.02,       // 触控板步进
    TOUCHPAD_THRESHOLD: 30,    // 触控板累积阈值
    TOUCHPAD_DELTA_LIMIT: 50   // 触控板判断阈值
};
```

## 兼容性

- B站视频页面（`bilibili.com/video/*`）
- B站番剧页面（`bilibili.com/bangumi/play/*`）

## 更新日志

### v1.0.0 (2025-11-20)

- 首次发布
- 支持自定义倍速（0.07x ~ 10x）
- 支持倍速记忆功能
- 支持鼠标滚轮调节（±0.1）
- 支持触控板滑动调节（±0.02）
- 智能识别鼠标滚轮和触控板
- 首次使用交互式引导
- 鼠标和触控板操作动画演示
- 深色主题 UI 设计
- 版本化引导控制

## 贡献指南

欢迎提交 Issue 和 Pull Request！

### 贡献流程

1. Fork 本仓库
2. 创建特性分支（`git checkout -b feature/AmazingFeature`）
3. 提交更改（`git commit -m 'Add some AmazingFeature'`）
4. 推送到分支（`git push origin feature/AmazingFeature`）
5. 开启 Pull Request

## 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件
