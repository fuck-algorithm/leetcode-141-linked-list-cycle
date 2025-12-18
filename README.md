# LeetCode 141. 环形链表 - 算法可视化

[![Deploy to GitHub Pages](https://github.com/fuck-algorithm/leetcode-141-linked-list-cycle/actions/workflows/deploy.yml/badge.svg)](https://github.com/fuck-algorithm/leetcode-141-linked-list-cycle/actions/workflows/deploy.yml)

一个交互式的环形链表检测算法可视化工具，帮助理解快慢指针算法。

## 在线演示

访问 [GitHub Pages](https://fuck-algorithm.github.io/leetcode-141-linked-list-cycle/) 查看在线演示。

## 功能特性

- 🎯 **代码调试效果** - Java 代码语法高亮，执行行高亮，变量值内联显示
- 🔗 **链表可视化** - SVG 绘制链表节点，快慢指针动画，环形连接展示
- ⌨️ **键盘快捷键** - 左箭头(上一步)、右箭头(下一步)、空格(播放/暂停)
- 📱 **响应式设计** - 适配桌面和移动设备
- 🚀 **自动部署** - 推送代码自动部署到 GitHub Pages

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 运行测试
npm run test

# 代码检查
npm run lint

# 构建生产版本
npm run build
```

## 技术栈

- **构建工具**: Vite
- **语法高亮**: Prism.js
- **可视化**: SVG
- **测试**: Jest + fast-check (属性测试)
- **CI/CD**: GitHub Actions

## 算法说明

使用快慢指针（Floyd 判圈算法）检测链表中是否存在环：
- 慢指针每次移动一步
- 快指针每次移动两步
- 如果存在环，快慢指针最终会相遇

## 加入交流群

扫描页面右下角的二维码，发送 `leetcode` 加入算法交流群。

## License

MIT
