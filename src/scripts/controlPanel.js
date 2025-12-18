/**
 * 控制面板组件 - 按钮、键盘快捷键和进度条
 */

export class ControlPanel {
  constructor(options = {}) {
    this.resetBtn = document.getElementById(options.resetBtnId || 'btn-reset');
    this.prevBtn = document.getElementById(options.prevBtnId || 'btn-prev');
    this.playBtn = document.getElementById(options.playBtnId || 'btn-play');
    this.nextBtn = document.getElementById(options.nextBtnId || 'btn-next');
    this.playIcon = document.getElementById(options.playIconId || 'play-icon');
    
    // 进度条元素
    this.progressBar = document.getElementById('progress-bar');
    this.progressPlayed = document.getElementById('progress-played');
    this.progressHandle = document.getElementById('progress-handle');
    this.progressText = document.getElementById('progress-text');
    
    this.onReset = null;  // 重置回调
    this.onPrevStep = null;
    this.onNextStep = null;
    this.onPlayPause = null;
    this.onSeek = null;  // 跳转到指定步骤的回调
    
    this.isPlaying = false;
    this.canGoPrev = false;
    this.canGoNext = true;
    
    // 进度条状态
    this.currentStep = 0;
    this.totalSteps = 0;
    this.isDragging = false;
    
    this.boundKeyHandler = this.handleKeyDown.bind(this);
  }

  /**
   * 初始化控制面板
   */
  initialize() {
    this.bindButtonEvents();
    this.bindKeyboardEvents();
    this.bindProgressBarEvents();
    this.updateButtonStates();
  }

  /**
   * 绑定按钮事件
   */
  bindButtonEvents() {
    if (this.resetBtn) {
      this.resetBtn.addEventListener('click', () => {
        if (this.onReset) {
          this.onReset();
        }
      });
    }
    
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
      case 'r':
      case 'R':
        event.preventDefault();
        if (this.onReset) {
          this.onReset();
        }
        break;
    }
  }

  /**
   * 绑定进度条事件
   */
  bindProgressBarEvents() {
    if (!this.progressBar || !this.progressHandle) return;
    
    // 点击进度条跳转
    this.progressBar.addEventListener('click', (e) => {
      if (this.isDragging) return;
      this.handleProgressClick(e);
    });
    
    // 拖拽手柄
    this.progressHandle.addEventListener('mousedown', (e) => {
      e.preventDefault();
      this.startDragging(e);
    });
    
    // 触摸支持
    this.progressHandle.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.startDragging(e.touches[0]);
    });
    
    // 全局鼠标/触摸事件
    document.addEventListener('mousemove', (e) => {
      if (this.isDragging) {
        this.handleDrag(e);
      }
    });
    
    document.addEventListener('mouseup', () => {
      if (this.isDragging) {
        this.stopDragging();
      }
    });
    
    document.addEventListener('touchmove', (e) => {
      if (this.isDragging) {
        this.handleDrag(e.touches[0]);
      }
    });
    
    document.addEventListener('touchend', () => {
      if (this.isDragging) {
        this.stopDragging();
      }
    });
  }

  /**
   * 处理进度条点击
   */
  handleProgressClick(e) {
    const rect = this.progressBar.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const step = Math.round(percent * (this.totalSteps - 1));
    
    if (this.onSeek && step !== this.currentStep) {
      this.onSeek(step);
    }
  }

  /**
   * 开始拖拽
   */
  startDragging() {
    this.isDragging = true;
    this.progressHandle.classList.add('dragging');
  }

  /**
   * 处理拖拽
   */
  handleDrag(e) {
    if (!this.isDragging) return;
    
    const rect = this.progressBar.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const step = Math.round(percent * (this.totalSteps - 1));
    
    // 实时更新进度条显示
    this.updateProgressUI(step, this.totalSteps);
    
    if (this.onSeek && step !== this.currentStep) {
      this.currentStep = step;
      this.onSeek(step);
    }
  }

  /**
   * 停止拖拽
   */
  stopDragging() {
    this.isDragging = false;
    this.progressHandle.classList.remove('dragging');
  }

  /**
   * 更新进度条 UI
   */
  updateProgressUI(current, total) {
    if (!this.progressPlayed || !this.progressHandle || !this.progressText) return;
    
    const percent = total > 1 ? (current / (total - 1)) * 100 : 0;
    this.progressPlayed.style.width = `${percent}%`;
    this.progressHandle.style.left = `${percent}%`;
    this.progressText.textContent = `${current + 1} / ${total}`;
  }

  /**
   * 更新进度
   */
  updateProgress(current, total) {
    this.currentStep = current;
    this.totalSteps = total;
    this.updateProgressUI(current, total);
  }

  /**
   * 设置回调函数
   */
  setCallbacks(callbacks) {
    this.onReset = callbacks.onReset || null;
    this.onPrevStep = callbacks.onPrevStep || null;
    this.onNextStep = callbacks.onNextStep || null;
    this.onPlayPause = callbacks.onPlayPause || null;
    this.onSeek = callbacks.onSeek || null;
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
