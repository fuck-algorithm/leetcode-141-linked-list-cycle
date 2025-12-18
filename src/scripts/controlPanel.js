/**
 * 控制面板组件 - 按钮和键盘快捷键
 */

export class ControlPanel {
  constructor(options = {}) {
    this.prevBtn = document.getElementById(options.prevBtnId || 'btn-prev');
    this.playBtn = document.getElementById(options.playBtnId || 'btn-play');
    this.nextBtn = document.getElementById(options.nextBtnId || 'btn-next');
    this.playIcon = document.getElementById(options.playIconId || 'play-icon');
    
    this.onPrevStep = null;
    this.onNextStep = null;
    this.onPlayPause = null;
    
    this.isPlaying = false;
    this.canGoPrev = false;
    this.canGoNext = true;
    
    this.boundKeyHandler = this.handleKeyDown.bind(this);
  }

  /**
   * 初始化控制面板
   */
  initialize() {
    this.bindButtonEvents();
    this.bindKeyboardEvents();
    this.updateButtonStates();
  }

  /**
   * 绑定按钮事件
   */
  bindButtonEvents() {
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => {
        if (this.onPrevStep && this.canGoPrev) {
          this.onPrevStep();
        }
      });
    }
    
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => {
        if (this.onNextStep && this.canGoNext) {
          this.onNextStep();
        }
      });
    }
    
    if (this.playBtn) {
      this.playBtn.addEventListener('click', () => {
        if (this.onPlayPause) {
          this.onPlayPause();
        }
      });
    }
  }

  /**
   * 绑定键盘事件
   */
  bindKeyboardEvents() {
    document.addEventListener('keydown', this.boundKeyHandler);
  }

  /**
   * 处理键盘按下事件
   * @param {KeyboardEvent} event
   */
  handleKeyDown(event) {
    // 如果焦点在输入框中，不处理快捷键
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
      return;
    }
    
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        if (this.onPrevStep && this.canGoPrev) {
          this.onPrevStep();
        }
        break;
      case 'ArrowRight':
        event.preventDefault();
        if (this.onNextStep && this.canGoNext) {
          this.onNextStep();
        }
        break;
      case ' ':
        event.preventDefault();
        if (this.onPlayPause) {
          this.onPlayPause();
        }
        break;
    }
  }

  /**
   * 设置回调函数
   */
  setCallbacks(callbacks) {
    this.onPrevStep = callbacks.onPrevStep || null;
    this.onNextStep = callbacks.onNextStep || null;
    this.onPlayPause = callbacks.onPlayPause || null;
  }

  /**
   * 更新按钮状态
   * @param {object} state - { canGoPrev, canGoNext, isPlaying }
   */
  updateState(state) {
    this.canGoPrev = state.canGoPrev;
    this.canGoNext = state.canGoNext;
    this.isPlaying = state.isPlaying;
    this.updateButtonStates();
  }

  /**
   * 更新按钮 UI 状态
   */
  updateButtonStates() {
    if (this.prevBtn) {
      this.prevBtn.disabled = !this.canGoPrev;
    }
    
    if (this.nextBtn) {
      this.nextBtn.disabled = !this.canGoNext;
    }
    
    if (this.playBtn && this.playIcon) {
      const btnText = this.playBtn.querySelector('.btn-text');
      if (this.isPlaying) {
        this.playIcon.textContent = '⏸';
        if (btnText) btnText.textContent = '暂停 (Space)';
      } else {
        this.playIcon.textContent = '▶';
        if (btnText) btnText.textContent = '播放 (Space)';
      }
    }
  }

  /**
   * 获取当前状态
   */
  getState() {
    return {
      canGoPrev: this.canGoPrev,
      canGoNext: this.canGoNext,
      isPlaying: this.isPlaying
    };
  }

  /**
   * 销毁控制面板
   */
  destroy() {
    document.removeEventListener('keydown', this.boundKeyHandler);
  }
}

export default ControlPanel;
