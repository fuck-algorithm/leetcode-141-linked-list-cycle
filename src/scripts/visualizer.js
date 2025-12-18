/**
 * 链表可视化组件 - 使用 SVG 绘制链表和指针动画
 */

export class Visualizer {
  constructor(svgId, stepInfoId, descriptionId) {
    this.svg = document.getElementById(svgId);
    this.stepInfoEl = document.getElementById(stepInfoId);
    this.descriptionEl = document.getElementById(descriptionId);
    
    this.nodes = [];
    this.cyclePos = -1;
    this.slowPos = -1;
    this.fastPos = -1;
    this.currentStep = 0;
    this.totalSteps = 0;
    
    // 布局参数
    this.nodeRadius = 25;
    this.nodeSpacing = 80;
    this.startX = 60;
    this.startY = 100;
    
    // 颜色
    this.colors = {
      node: '#2196f3',
      nodeText: '#ffffff',
      arrow: '#666666',
      slow: '#4caf50',
      fast: '#f44336',
      cycle: '#ff9800',
      highlight: '#ffeb3b'
    };
  }

  /**
   * 初始化可视化
   * @param {number[]} values - 节点值数组
   * @param {number} cyclePos - 环的位置
   */
  initialize(values, cyclePos) {
    this.nodes = values.map((val, index) => ({
      val,
      index,
      x: this.startX + index * this.nodeSpacing,
      y: this.startY
    }));
    this.cyclePos = cyclePos;
    this.render();
  }

  /**
   * 更新显示状态
   * @param {object} step - 算法步骤
   * @param {number} totalSteps - 总步骤数
   */
  update(step, totalSteps) {
    if (!step) return;
    
    this.slowPos = step.slowPos;
    this.fastPos = step.fastPos;
    this.currentStep = step.stepNumber;
    this.totalSteps = totalSteps;
    
    this.render();
    this.updateStepInfo(step.stepNumber + 1, totalSteps);
    this.updateDescription(step.description);
  }


  /**
   * 渲染 SVG
   */
  render() {
    if (!this.svg) return;
    
    // 清空 SVG
    this.svg.innerHTML = '';
    
    if (this.nodes.length === 0) {
      this.renderEmptyState();
      return;
    }
    
    // 设置 SVG 尺寸
    const width = Math.max(400, this.nodes.length * this.nodeSpacing + 100);
    this.svg.setAttribute('viewBox', `0 0 ${width} 200`);
    
    // 绘制箭头（先绘制，这样节点会覆盖在上面）
    this.renderArrows();
    
    // 绘制环形连接
    if (this.cyclePos >= 0) {
      this.renderCycleArrow();
    }
    
    // 绘制节点
    this.renderNodes();
    
    // 绘制指针
    this.renderPointers();
  }

  /**
   * 渲染空状态
   */
  renderEmptyState() {
    const text = this.createSvgElement('text', {
      x: '50%',
      y: '50%',
      'text-anchor': 'middle',
      'dominant-baseline': 'middle',
      fill: '#999',
      'font-size': '16'
    });
    text.textContent = '空链表';
    this.svg.appendChild(text);
  }

  /**
   * 渲染节点
   */
  renderNodes() {
    this.nodes.forEach((node, index) => {
      const group = this.createSvgElement('g', {
        transform: `translate(${node.x}, ${node.y})`
      });
      
      // 节点圆圈
      const circle = this.createSvgElement('circle', {
        r: this.nodeRadius,
        fill: this.colors.node,
        stroke: this.getNodeStroke(index),
        'stroke-width': this.getNodeStrokeWidth(index)
      });
      group.appendChild(circle);
      
      // 节点值
      const text = this.createSvgElement('text', {
        'text-anchor': 'middle',
        'dominant-baseline': 'middle',
        fill: this.colors.nodeText,
        'font-size': '14',
        'font-weight': 'bold'
      });
      text.textContent = node.val;
      group.appendChild(text);
      
      // 索引标签
      const indexText = this.createSvgElement('text', {
        y: this.nodeRadius + 18,
        'text-anchor': 'middle',
        fill: '#999',
        'font-size': '12'
      });
      indexText.textContent = `[${index}]`;
      group.appendChild(indexText);
      
      this.svg.appendChild(group);
    });
  }

  /**
   * 获取节点边框颜色
   */
  getNodeStroke(index) {
    if (index === this.slowPos && index === this.fastPos) {
      return this.colors.highlight;
    }
    if (index === this.slowPos) {
      return this.colors.slow;
    }
    if (index === this.fastPos) {
      return this.colors.fast;
    }
    return 'transparent';
  }

  /**
   * 获取节点边框宽度
   */
  getNodeStrokeWidth(index) {
    if (index === this.slowPos || index === this.fastPos) {
      return 4;
    }
    return 0;
  }

  /**
   * 渲染箭头
   */
  renderArrows() {
    // 定义箭头标记
    const defs = this.createSvgElement('defs');
    const marker = this.createSvgElement('marker', {
      id: 'arrowhead',
      markerWidth: '10',
      markerHeight: '7',
      refX: '9',
      refY: '3.5',
      orient: 'auto'
    });
    const polygon = this.createSvgElement('polygon', {
      points: '0 0, 10 3.5, 0 7',
      fill: this.colors.arrow
    });
    marker.appendChild(polygon);
    defs.appendChild(marker);
    this.svg.appendChild(defs);
    
    // 绘制节点间的箭头
    for (let i = 0; i < this.nodes.length - 1; i++) {
      const from = this.nodes[i];
      const to = this.nodes[i + 1];
      
      const line = this.createSvgElement('line', {
        x1: from.x + this.nodeRadius,
        y1: from.y,
        x2: to.x - this.nodeRadius - 5,
        y2: to.y,
        stroke: this.colors.arrow,
        'stroke-width': 2,
        'marker-end': 'url(#arrowhead)'
      });
      this.svg.appendChild(line);
    }
  }

  /**
   * 渲染环形连接箭头
   */
  renderCycleArrow() {
    if (this.cyclePos < 0 || this.nodes.length === 0) return;
    
    const lastNode = this.nodes[this.nodes.length - 1];
    const targetNode = this.nodes[this.cyclePos];
    
    // 定义环形箭头标记
    const defs = this.svg.querySelector('defs') || this.createSvgElement('defs');
    if (!this.svg.querySelector('#cycle-arrowhead')) {
      const marker = this.createSvgElement('marker', {
        id: 'cycle-arrowhead',
        markerWidth: '10',
        markerHeight: '7',
        refX: '9',
        refY: '3.5',
        orient: 'auto'
      });
      const polygon = this.createSvgElement('polygon', {
        points: '0 0, 10 3.5, 0 7',
        fill: this.colors.cycle
      });
      marker.appendChild(polygon);
      defs.appendChild(marker);
      if (!this.svg.querySelector('defs')) {
        this.svg.appendChild(defs);
      }
    }
    
    // 绘制曲线箭头
    const path = this.createSvgElement('path', {
      d: this.getCyclePathD(lastNode, targetNode),
      fill: 'none',
      stroke: this.colors.cycle,
      'stroke-width': 2,
      'stroke-dasharray': '5,3',
      'marker-end': 'url(#cycle-arrowhead)'
    });
    this.svg.appendChild(path);
    
    // 添加环形标签
    const labelX = (lastNode.x + targetNode.x) / 2;
    const labelY = this.startY + 70;
    const label = this.createSvgElement('text', {
      x: labelX,
      y: labelY,
      'text-anchor': 'middle',
      fill: this.colors.cycle,
      'font-size': '12',
      'font-weight': 'bold'
    });
    label.textContent = '环';
    this.svg.appendChild(label);
  }

  /**
   * 获取环形路径
   */
  getCyclePathD(from, to) {
    const startX = from.x;
    const startY = from.y + this.nodeRadius;
    const endX = to.x;
    const endY = to.y + this.nodeRadius;
    const curveY = this.startY + 60;
    
    return `M ${startX} ${startY} Q ${(startX + endX) / 2} ${curveY} ${endX} ${endY}`;
  }

  /**
   * 渲染指针标记
   */
  renderPointers() {
    if (this.slowPos >= 0 && this.slowPos < this.nodes.length) {
      this.renderPointer(this.nodes[this.slowPos], 'slow', this.colors.slow);
    }
    if (this.fastPos >= 0 && this.fastPos < this.nodes.length) {
      this.renderPointer(this.nodes[this.fastPos], 'fast', this.colors.fast);
    }
  }

  /**
   * 渲染单个指针
   */
  renderPointer(node, label, color) {
    const offsetY = label === 'slow' ? -50 : -70;
    const group = this.createSvgElement('g', {
      transform: `translate(${node.x}, ${node.y + offsetY})`
    });
    
    // 指针标签背景
    const rect = this.createSvgElement('rect', {
      x: -20,
      y: -10,
      width: 40,
      height: 20,
      rx: 4,
      fill: color
    });
    group.appendChild(rect);
    
    // 指针标签文字
    const text = this.createSvgElement('text', {
      'text-anchor': 'middle',
      'dominant-baseline': 'middle',
      fill: 'white',
      'font-size': '11',
      'font-weight': 'bold'
    });
    text.textContent = label;
    group.appendChild(text);
    
    // 指向节点的线
    const line = this.createSvgElement('line', {
      x1: 0,
      y1: 10,
      x2: 0,
      y2: -offsetY - this.nodeRadius - 5,
      stroke: color,
      'stroke-width': 2
    });
    group.appendChild(line);
    
    this.svg.appendChild(group);
  }

  /**
   * 更新步骤信息
   */
  updateStepInfo(current, total) {
    if (this.stepInfoEl) {
      this.stepInfoEl.textContent = `步骤: ${current} / ${total}`;
    }
  }

  /**
   * 更新描述
   */
  updateDescription(description) {
    if (this.descriptionEl) {
      this.descriptionEl.textContent = description || '';
    }
  }

  /**
   * 创建 SVG 元素
   */
  createSvgElement(tag, attrs = {}) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    Object.entries(attrs).forEach(([key, value]) => {
      el.setAttribute(key, value);
    });
    return el;
  }

  /**
   * 获取当前状态
   */
  getState() {
    return {
      slowPos: this.slowPos,
      fastPos: this.fastPos,
      cyclePos: this.cyclePos,
      currentStep: this.currentStep,
      totalSteps: this.totalSteps
    };
  }

  /**
   * 检查指针是否有不同的视觉标记
   */
  hasDistinctPointerMarkers() {
    return this.colors.slow !== this.colors.fast;
  }

  /**
   * 检查是否显示了环形连接
   */
  hasCycleVisualization() {
    return this.cyclePos >= 0;
  }
}

export default Visualizer;
