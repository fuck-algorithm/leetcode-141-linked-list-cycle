/**
 * StatusPanel - 显示实时算法状态
 */
export class StatusPanel {
  constructor(container) {
    this.container = container;
    this.slowPosition = -1;
    this.slowValue = null;
    this.fastPosition = -1;
    this.fastValue = null;
    this.loopCondition = '';
    this.loopConditionResult = false;
    this.iterationCount = 0;
    this.slowMoves = 0;
    this.fastMoves = 0;
    
    this.render();
  }

  /**
   * 更新状态
   * @param {object} step - 算法步骤
   * @param {number[]} values - 节点值数组
   */
  update(step, values = []) {
    if (step.slowPos !== undefined) {
      this.slowPosition = step.slowPos;
      this.slowValue = step.slowPos >= 0 && step.slowPos < values.length 
        ? values[step.slowPos] 
        : null;
    }
    
    if (step.fastPos !== undefined) {
      this.fastPosition = step.fastPos;
      this.fastValue = step.fastPos >= 0 && step.fastPos < values.length 
        ? values[step.fastPos] 
        : null;
    }
    
    if (step.loopCondition) {
      this.loopCondition = step.loopCondition.expression || '';
      this.loopConditionResult = step.loopCondition.result || false;
    }
    
    if (step.iterationCount !== undefined) {
      this.iterationCount = step.iterationCount;
    }
    
    if (step.slowMoves !== undefined) {
      this.slowMoves = step.slowMoves;
    }
    
    if (step.fastMoves !== undefined) {
      this.fastMoves = step.fastMoves;
    }
    
    this.render();
  }

  /**
   * 获取速度比字符串
   * @returns {string} 速度比
   */
  getSpeedRatio() {
    if (this.slowMoves === 0) return '1:2';
    const ratio = this.fastMoves / this.slowMoves;
    return `1:${ratio.toFixed(1)}`;
  }

  /**
   * 重置状态
   */
  reset() {
    this.slowPosition = -1;
    this.slowValue = null;
    this.fastPosition = -1;
    this.fastValue = null;
    this.loopCondition = '';
    this.loopConditionResult = false;
    this.iterationCount = 0;
    this.slowMoves = 0;
    this.fastMoves = 0;
    this.render();
  }

  /**
   * 渲染面板
   */
  render() {
    if (!this.container) return;
    
    const slowDisplay = this.slowPosition >= 0 
      ? `位置[${this.slowPosition}], 值=${this.slowValue}` 
      : 'null';
    const fastDisplay = this.fastPosition >= 0 
      ? `位置[${this.fastPosition}], 值=${this.fastValue}` 
      : 'null';
    const conditionDisplay = this.loopCondition 
      ? `${this.loopCondition} → ${this.loopConditionResult}` 
      : '-';
    
    this.container.innerHTML = `
      <div class="status-panel">
        <div class="status-header">📊 算法状态</div>
        <div class="status-content">
          <div class="status-item">
            <span class="status-label slow-label">slow:</span>
            <span class="status-value">${slowDisplay}</span>
            <span class="speed-badge slow-speed">1x</span>
          </div>
          <div class="status-item">
            <span class="status-label fast-label">fast:</span>
            <span class="status-value">${fastDisplay}</span>
            <span class="speed-badge fast-speed">2x</span>
          </div>
          <div class="status-item">
            <span class="status-label">循环条件:</span>
            <span class="status-value condition-value">${conditionDisplay}</span>
          </div>
          <div class="status-item">
            <span class="status-label">迭代次数:</span>
            <span class="status-value">${this.iterationCount}</span>
          </div>
          <div class="status-item">
            <span class="status-label">速度比:</span>
            <span class="status-value">${this.getSpeedRatio()}</span>
          </div>
        </div>
      </div>
    `;
  }
}

export default StatusPanel;
