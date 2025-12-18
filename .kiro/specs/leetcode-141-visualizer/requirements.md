# Requirements Document

## Introduction

本项目是一个 LeetCode 141 环形链表算法的可视化演示工具，部署在 GitHub Pages 上。用户可以通过交互式界面观看算法执行过程，包括代码高亮、变量值展示、链表动画等功能。项目还提供键盘快捷键支持和社区交流入口。

## Glossary

- **Visualizer**: 算法可视化演示系统
- **Debug Effect**: 类似 IDE 调试器的代码执行效果，包括行高亮和变量值展示
- **Control Panel**: 控制算法演示步骤的按钮面板
- **Floating Ball**: 页面右下角的悬浮交互元素
- **Step**: 算法执行的单个步骤
- **Syntax Highlighting**: 代码语法高亮显示

## Requirements

### Requirement 1: 页面标题与导航

**User Story:** As a user, I want to see the problem title matching LeetCode's format with a clickable link, so that I can easily navigate to the original problem.

#### Acceptance Criteria

1. WHEN the page loads THEN the Visualizer SHALL display the title "141. 环形链表" matching LeetCode's format
2. WHEN a user clicks the title THEN the Visualizer SHALL navigate to the LeetCode problem page (https://leetcode.cn/problems/linked-list-cycle/)
3. WHEN the page loads THEN the Visualizer SHALL display a GitHub icon in the top-right corner
4. WHEN a user clicks the GitHub icon THEN the Visualizer SHALL navigate to the repository page (https://github.com/fuck-algorithm/leetcode-141-linked-list-cycle)

### Requirement 2: 代码展示与调试效果

**User Story:** As a user, I want to see the algorithm's Java code with debug-like effects, so that I can understand the execution flow and variable states.

#### Acceptance Criteria

1. WHEN the page loads THEN the Visualizer SHALL display the Java solution code with syntax highlighting
2. WHEN the algorithm executes a step THEN the Visualizer SHALL highlight the currently executing line
3. WHEN a variable value changes THEN the Visualizer SHALL display the variable's current value inline after the corresponding code line
4. WHEN the algorithm step changes THEN the Visualizer SHALL update the highlighted line to match the current execution point
5. WHEN displaying variable values THEN the Visualizer SHALL show values for slow pointer, fast pointer, and their positions

### Requirement 3: 控制面板与键盘快捷键

**User Story:** As a user, I want to control the algorithm visualization with buttons and keyboard shortcuts, so that I can navigate through steps efficiently.

#### Acceptance Criteria

1. WHEN a user clicks the "上一步" button or presses the Left Arrow key THEN the Visualizer SHALL move to the previous algorithm step
2. WHEN a user clicks the "下一步" button or presses the Right Arrow key THEN the Visualizer SHALL move to the next algorithm step
3. WHEN a user clicks the "播放/暂停" button or presses the Space key THEN the Visualizer SHALL toggle between auto-play and pause states
4. WHEN displaying control buttons THEN the Visualizer SHALL show the corresponding keyboard shortcut text on each button (e.g., "上一步 (←)", "下一步 (→)", "播放/暂停 (Space)")
5. WHEN the visualization is at the first step THEN the Visualizer SHALL disable the "上一步" button
6. WHEN the visualization is at the last step THEN the Visualizer SHALL disable the "下一步" button

### Requirement 4: 链表可视化与信息展示

**User Story:** As a user, I want to see a rich visualization of the linked list with algorithm state information, so that I can understand how the cycle detection works.

#### Acceptance Criteria

1. WHEN the page loads THEN the Visualizer SHALL display the linked list as a graphical representation with nodes and arrows
2. WHEN the algorithm executes THEN the Visualizer SHALL visually distinguish the slow pointer and fast pointer positions
3. WHEN a cycle exists THEN the Visualizer SHALL visually indicate the cycle connection in the linked list
4. WHEN displaying the visualization THEN the Visualizer SHALL show current step number, total steps, and algorithm phase description
5. WHEN pointers move THEN the Visualizer SHALL animate the pointer transitions smoothly

### Requirement 5: 社区交流悬浮球

**User Story:** As a user, I want to access the algorithm discussion community easily, so that I can join and discuss with other learners.

#### Acceptance Criteria

1. WHEN the page loads THEN the Visualizer SHALL display a floating ball in the bottom-right corner with a WeChat group icon and "交流群" text
2. WHEN a user hovers over the floating ball THEN the Visualizer SHALL display a QR code image for joining the WeChat group
3. WHEN displaying the QR code THEN the Visualizer SHALL show a prompt text "使用微信扫码发送 leetcode 加入算法交流群"
4. WHEN displaying the QR code image THEN the Visualizer SHALL maintain the original aspect ratio without distortion
5. WHEN the user moves the mouse away from the floating ball THEN the Visualizer SHALL hide the QR code popup

### Requirement 6: GitHub Pages 自动部署

**User Story:** As a developer, I want automatic deployment to GitHub Pages when code is pushed, so that the latest version is always available online.

#### Acceptance Criteria

1. WHEN code is pushed to the main branch THEN the GitHub Action SHALL trigger the build and deployment process
2. WHEN the build process runs THEN the GitHub Action SHALL verify no compilation errors exist
3. WHEN the build process runs THEN the GitHub Action SHALL verify no linter errors exist
4. WHEN all checks pass THEN the GitHub Action SHALL deploy the built files to GitHub Pages
5. IF the build or lint check fails THEN the GitHub Action SHALL report the failure and prevent deployment
