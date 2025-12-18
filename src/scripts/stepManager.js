/**
 * 步骤管理器 - 管理算法演示的步骤导航和自动播放
 */

export class StepManager {
  constructor(totalSteps = 0) {
    this.currentStep = 0;
    this.totalSteps = totalSteps;
    this.isPlaying = false;
    this.playSpeed = 1000; // 毫秒
    this.playTimer = null;
    this.onStepChange = null;
    this.onPlayStateChange = null;
  }

  /**
   * 设置总步骤数
   * @param {number} total - 总步骤数
   */
  setTotalSteps(total) {
    this.totalSteps = total;
    this.currentStep = 0;
  }

  /**
   * 跳转到指定步骤
   * @param {number} step - 目标步骤
   * @returns {boolean} 是否成功跳转
   */
  goToStep(step) {
    if (step < 0 || step >= this.totalSteps) {
      return false;
    }
    this.currentStep = step;
    this._notifyStepChange();
    return true;
  }

  /**
   * 下一步
   * @returns {boolean} 是否成功
   */
  nextStep() {
    if (!this.canGoNext()) {
      return false;
    }
    this.currentStep++;
    this._notifyStepChange();
    return true;
  }

  /**
   * 上一步
   * @returns {boolean} 是否成功
   */
  prevStep() {
    if (!this.canGoPrev()) {
      return false;
    }
    this.currentStep--;
    this._notifyStepChange();
    return true;
  }

  /**
   * 是否可以前进
   * @returns {boolean}
   */
  canGoNext() {
    return this.currentStep < this.totalSteps - 1;
  }

  /**
   * 是否可以后退
   * @returns {boolean}
   */
  canGoPrev() {
    return this.currentStep > 0;
  }

  /**
   * 开始自动播放
   */
  play() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this._notifyPlayStateChange();
    this._startPlayTimer();
  }

  /**
   * 暂停自动播放
   */
  pause() {
    if (!this.isPlaying) return;
    this.isPlaying = false;
    this._notifyPlayStateChange();
    this._stopPlayTimer();
  }

  /**
   * 切换播放/暂停状态
   */
  toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  /**
   * 设置播放速度
   * @param {number} speed - 毫秒
   */
  setPlaySpeed(speed) {
    this.playSpeed = speed;
    if (this.isPlaying) {
      this._stopPlayTimer();
      this._startPlayTimer();
    }
  }

  /**
   * 设置步骤变化回调
   * @param {Function} callback
   */
  setOnStepChange(callback) {
    this.onStepChange = callback;
  }

  /**
   * 设置播放状态变化回调
   * @param {Function} callback
   */
  setOnPlayStateChange(callback) {
    this.onPlayStateChange = callback;
  }

  /**
   * 获取当前状态
   * @returns {object}
   */
  getState() {
    return {
      currentStep: this.currentStep,
      totalSteps: this.totalSteps,
      isPlaying: this.isPlaying,
      canGoPrev: this.canGoPrev(),
      canGoNext: this.canGoNext()
    };
  }

  /**
   * 重置到初始状态
   */
  reset() {
    this.pause();
    this.currentStep = 0;
    this._notifyStepChange();
  }

  /**
   * 销毁管理器
   */
  destroy() {
    this._stopPlayTimer();
    this.onStepChange = null;
    this.onPlayStateChange = null;
  }

  // 私有方法
  _startPlayTimer() {
    this.playTimer = setInterval(() => {
      if (!this.nextStep()) {
        this.pause();
      }
    }, this.playSpeed);
  }

  _stopPlayTimer() {
    if (this.playTimer) {
      clearInterval(this.playTimer);
      this.playTimer = null;
    }
  }

  _notifyStepChange() {
    if (this.onStepChange) {
      this.onStepChange(this.currentStep);
    }
  }

  _notifyPlayStateChange() {
    if (this.onPlayStateChange) {
      this.onPlayStateChange(this.isPlaying);
    }
  }
}

export default StepManager;
