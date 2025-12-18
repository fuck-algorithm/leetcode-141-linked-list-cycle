/**
 * 数据输入面板组件 - 支持自定义数据、样例数据和随机生成
 */

export class DataInputPanel {
  constructor(containerId, onDataChange) {
    this.container = document.getElementById(containerId);
    this.onDataChange = onDataChange;
    
    // 预设样例数据
    this.examples = [
      { name: '示例1', values: [3, 2, 0, -4], pos: 1, desc: '4节点，环在位置1' },
      { name: '示例2', values: [1, 2], pos: 0, desc: '2节点，环在位置0' },
      { name: '示例3', values: [1], pos: -1, desc: '单节点，无环' },
      { name: '示例4', values: [1, 2, 3, 4, 5], pos: 2, desc: '5节点，环在位置2' },
      { name: '示例5', values: [1, 2, 3, 4, 5, 6], pos: 0, desc: '6节点，环在头部' }
    ];
  }

  /**
   * 初始化面板
   */
  initialize() {
    if (!this.container) return;
    
    this.render();
    this.bindEvents();
  }

  /**
   * 渲染面板
   */
  render() {
    this.container.innerHTML = `
      <div class="data-input-panel">
        <div class="panel-section custom-section">
          <span class="section-title">📝 自定义:</span>
          <div class="input-group">
            <div class="input-row">
              <label class="input-label">数组</label>
              <input type="text" id="values-input" class="data-input values-input" placeholder="3,2,0,-4" />
            </div>
            <div class="input-row">
              <label class="input-label">环位置</label>
              <input type="number" id="pos-input" class="data-input pos-input" placeholder="-1" min="-1" />
            </div>
            <button id="btn-apply" class="action-btn apply-btn">应用</button>
          </div>
        </div>
        
        <div class="section-divider"></div>
        
        <div class="panel-section">
          <span class="section-title">📚 样例:</span>
          <div class="examples-grid" id="examples-grid"></div>
        </div>
        
        <div class="section-divider"></div>
        
        <div class="panel-section">
          <span class="section-title">🎲 随机:</span>
          <div class="random-controls">
            <input type="number" id="random-count" class="data-input count-input" value="5" min="2" max="10" title="节点数量" />
            <button id="btn-random" class="action-btn random-btn">生成</button>
          </div>
        </div>
      </div>
    `;
    
    this.renderExamples();
  }

  /**
   * 渲染样例按钮
   */
  renderExamples() {
    const grid = document.getElementById('examples-grid');
    if (!grid) return;
    
    grid.innerHTML = this.examples.map((ex, index) => `
      <button class="example-btn" data-index="${index}" title="${ex.desc}: [${ex.values.join(',')}] pos=${ex.pos}">
        <span class="example-name">${ex.name}</span>
      </button>
    `).join('');
  }

  /**
   * 绑定事件
   */
  bindEvents() {
    // 应用自定义数据
    const applyBtn = document.getElementById('btn-apply');
    if (applyBtn) {
      applyBtn.addEventListener('click', () => this.applyCustomData());
    }
    
    // 样例数据点击
    const examplesGrid = document.getElementById('examples-grid');
    if (examplesGrid) {
      examplesGrid.addEventListener('click', (e) => {
        const btn = e.target.closest('.example-btn');
        if (btn) {
          const index = parseInt(btn.dataset.index);
          this.applyExample(index);
        }
      });
    }
    
    // 随机生成
    const randomBtn = document.getElementById('btn-random');
    if (randomBtn) {
      randomBtn.addEventListener('click', () => this.generateRandom());
    }
    
    // 回车键应用数据
    const valuesInput = document.getElementById('values-input');
    const posInput = document.getElementById('pos-input');
    if (valuesInput) {
      valuesInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.applyCustomData();
      });
    }
    if (posInput) {
      posInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.applyCustomData();
      });
    }
  }

  /**
   * 应用自定义数据
   */
  applyCustomData() {
    const valuesInput = document.getElementById('values-input');
    const posInput = document.getElementById('pos-input');
    
    if (!valuesInput || !posInput) return;
    
    const valuesStr = valuesInput.value.trim();
    const posStr = posInput.value.trim();
    
    if (!valuesStr) {
      this.showError('请输入节点值数组');
      return;
    }
    
    // 解析节点值
    const values = valuesStr.split(',').map(s => {
      const num = parseInt(s.trim());
      return isNaN(num) ? null : num;
    });
    
    if (values.includes(null)) {
      this.showError('节点值必须是有效的整数');
      return;
    }
    
    if (values.length === 0) {
      this.showError('至少需要一个节点');
      return;
    }
    
    // 解析环位置
    const pos = posStr === '' ? -1 : parseInt(posStr);
    if (isNaN(pos)) {
      this.showError('环入口位置必须是整数');
      return;
    }
    
    if (pos < -1 || pos >= values.length) {
      this.showError(`环入口位置必须在 -1 到 ${values.length - 1} 之间`);
      return;
    }
    
    this.applyData(values, pos);
  }

  /**
   * 应用样例数据
   */
  applyExample(index) {
    const example = this.examples[index];
    if (!example) return;
    
    // 更新输入框显示
    const valuesInput = document.getElementById('values-input');
    const posInput = document.getElementById('pos-input');
    if (valuesInput) valuesInput.value = example.values.join(',');
    if (posInput) posInput.value = example.pos;
    
    this.applyData(example.values, example.pos);
  }

  /**
   * 生成随机有环链表
   */
  generateRandom() {
    const countInput = document.getElementById('random-count');
    let count = countInput ? parseInt(countInput.value) : 5;
    
    // 限制范围
    count = Math.max(2, Math.min(10, count));
    
    // 生成随机节点值
    const values = [];
    for (let i = 0; i < count; i++) {
      values.push(Math.floor(Math.random() * 20) - 10); // -10 到 9 的随机数
    }
    
    // 随机生成环位置（保证有环）
    const pos = Math.floor(Math.random() * count);
    
    // 更新输入框显示
    const valuesInput = document.getElementById('values-input');
    const posInput = document.getElementById('pos-input');
    if (valuesInput) valuesInput.value = values.join(',');
    if (posInput) posInput.value = pos;
    
    this.applyData(values, pos);
  }

  /**
   * 应用数据
   */
  applyData(values, pos) {
    if (this.onDataChange) {
      this.onDataChange(values, pos);
    }
  }

  /**
   * 显示错误提示
   */
  showError(message) {
    // 简单的错误提示
    alert(message);
  }
}

export default DataInputPanel;
