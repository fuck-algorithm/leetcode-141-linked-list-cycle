/**
 * InsightPanel - 显示算法原理解释
 */
export class InsightPanel {
  constructor(container) {
    this.container = container;
    this.currentPhase = 'initialization';
    this.isCollapsed = false;
    
    this.insights = new Map([
      ['initialization', {
        title: '🚀 初始化阶段',
        explanation: 'slow 从 head 开始，fast 从 head.next 开始。这样设置是为了让两个指针在环中相遇时，slow 不会在起点就与 fast 相遇。',
        formula: 'slow = head, fast = head.next'
      }],
      ['moving', {
        title: '🏃 移动阶段',
        explanation: '快指针每次移动 2 步，慢指针每次移动 1 步。如果存在环，快指针最终会"追上"慢指针，因为它们的相对速度是 1 步/轮。',
        formula: 'slow = slow.next, fast = fast.next.next'
      }],
      ['meeting', {
        title: '✅ 相遇 - 检测到环！',
        explanation: '快慢指针相遇证明存在环。因为在环中，快指针每轮比慢指针多走 1 步，所以一定会追上慢指针。',
        formula: 'slow === fast → 有环'
      }],
      ['no-cycle', {
        title: '❌ 无环',
        explanation: '快指针到达 null，说明链表有终点，不存在环。如果有环，快指针永远不会到达 null。',
        formula: 'fast === null || fast.next === null → 无环'
      }],
      ['completed', {
        title: '🎉 算法完成',
        explanation: '算法已完成检测。快慢指针法的时间复杂度是 O(n)，空间复杂度是 O(1)。',
        formula: null
      }]
    ]);
    
    this.render();
  }

  /**
   * 更新当前阶段
   * @param {string} phase - 算法阶段
   */
  updatePhase(phase) {
    if (this.insights.has(phase)) {
      this.currentPhase = phase;
      this.render();
    }
  }

  /**
   * 获取当前阶段的解释内容
   * @returns {InsightContent} 解释内容
   */
  getInsight() {
    return this.insights.get(this.currentPhase);
  }

  /**
   * 切换折叠状态
   */
  toggleCollapsed() {
    this.isCollapsed = !this.isCollapsed;
    this.render();
  }

  /**
   * 渲染面板
   */
  render() {
    if (!this.container) return;
    
    const insight = this.getInsight();
    const collapseIcon = this.isCollapsed ? '▶' : '▼';
    
    this.container.innerHTML = `
      <div class="insight-panel ${this.isCollapsed ? 'collapsed' : ''}">
        <div class="insight-header" onclick="window.insightPanel?.toggleCollapsed()">
          <span class="insight-title">${insight.title}</span>
          <span class="insight-toggle">${collapseIcon}</span>
        </div>
        ${!this.isCollapsed ? `
          <div class="insight-content">
            <p class="insight-explanation">${insight.explanation}</p>
            ${insight.formula ? `<code class="insight-formula">${insight.formula}</code>` : ''}
          </div>
        ` : ''}
      </div>
    `;
  }
}

export default InsightPanel;
