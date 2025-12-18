/**
 * 悬浮球组件 - 微信群入口
 */

export class FloatingBall {
  constructor(options = {}) {
    this.container = document.getElementById(options.containerId || 'floating-ball');
    this.popup = document.getElementById(options.popupId || 'qr-popup');
    this.qrImage = options.qrImage || './assets/wechat-qr.png';
    this.promptText = options.promptText || '使用微信扫码发送 leetcode 加入算法交流群';
  }

  /**
   * 初始化悬浮球
   */
  initialize() {
    // 悬浮球的显示/隐藏由 CSS :hover 处理
    // 这里可以添加额外的交互逻辑
    this.setupAccessibility();
  }

  /**
   * 设置无障碍支持
   */
  setupAccessibility() {
    if (this.container) {
      this.container.setAttribute('role', 'button');
      this.container.setAttribute('aria-label', '加入算法交流群');
      this.container.setAttribute('tabindex', '0');
      
      // 键盘支持
      this.container.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.togglePopup();
        }
      });
    }
  }

  /**
   * 切换弹窗显示
   */
  togglePopup() {
    if (this.popup) {
      const isVisible = this.popup.style.opacity === '1';
      this.popup.style.opacity = isVisible ? '0' : '1';
      this.popup.style.visibility = isVisible ? 'hidden' : 'visible';
    }
  }

  /**
   * 显示弹窗
   */
  showPopup() {
    if (this.popup) {
      this.popup.style.opacity = '1';
      this.popup.style.visibility = 'visible';
    }
  }

  /**
   * 隐藏弹窗
   */
  hidePopup() {
    if (this.popup) {
      this.popup.style.opacity = '0';
      this.popup.style.visibility = 'hidden';
    }
  }

  /**
   * 获取状态
   */
  getState() {
    return {
      qrImage: this.qrImage,
      promptText: this.promptText,
      isPopupVisible: this.popup ? this.popup.style.opacity === '1' : false
    };
  }
}

export default FloatingBall;
