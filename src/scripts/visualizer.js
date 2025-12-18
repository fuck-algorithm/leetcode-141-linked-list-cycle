/**
 * 链表可视化组件 - 使用 SVG 绘制链表和指针动画
 */

import { TrailManager } from './trailManager.js';
import { VisitCounter } from './visitCounter.js';
import { DistanceCalculator } from './distanceCalculator.js';
import { CycleAnalyzer } from './cycleAnalyzer.js';

export class Visualizer {
  constructor(svgId, stepInfoId, descriptionId) {
    this.svg = document.getElementById(svgId);
    this.stepInfoEl = document.getElementById(stepInfoId);
    this.descriptionEl = document.getElementById(descriptionId);
    
    this.nodes = [];
    this.values = [];
    this.cyclePos = -1;
    this.slowPos = -1;
    this.fastPos = -1;
    this.currentStep = 0;
    this.totalSteps = 0;
    
    // 统计信息
    this.slowMoves = 0;
    this.fastMoves = 0;
    this.hasCycleResult = null;
    
    // 增强组件
    this.trailManager = new TrailManager({
      slowColor: 'rgba(76, 175, 80, 0.3)',
      fastColor: 'rgba(244, 67, 54, 0.3)'
    });
    this.visitCounter = new VisitCounter();
    this.distanceCalculator = new DistanceCalculator();
    this.cycleAnalyzer = new CycleAnalyzer();
    this.cycleInfo = null;
    
    // 布局参数
    this.nodeRadius = 25;
    this.nodeSpacing = 80;
    this.startX = 60;
    this.startY = 80;
    this.svgHeight = 220;
    
    // 颜色
    this.colors = {
      node: '#2196f3',
      nodeText: '#ffffff',
      arrow: '#666666',
      slow: '#4caf50',
      fast: '#f44336',
      cycle: '#ff9800',
      highlight: '#ffeb3b',
      meetPoint: '#9c27b0'
    };
    
    // 创建信息面板
    this.createInfoPanel();
  }

  /**
   * 创建信息面板（HTML元素）
   */
  createInfoPanel() {
    const container = this.svg?.parentElement;
    if (!container) return;
    
    // 检查是否已存在
    if (container.querySelector('.visualizer-info-panel')) return;
    
    const infoPanel = document.createElement('div');
    infoPanel.className = 'visualizer-info-panel';
    infoPanel.innerHTML = `
      <div class="info-row">
        <div class="legend">
          <span class="legend-item"><span class="legend-color" style="background:#4caf50"></span>慢指针 (slow) <span class="speed-badge">1x</span></span>
          <span class="legend-item"><span class="legend-color" style="background:#f44336"></span>快指针 (fast) <span class="speed-badge">2x</span></span>
          <span class="legend-item"><span class="legend-color" style="background:#ff9800"></span>环连接</span>
        </div>
        <div class="stats">
          <span class="stat-item slow-stat">慢指针: <strong>0</strong> 步</span>
          <span class="stat-item fast-stat">快指针: <strong>0</strong> 步</span>
          <span class="stat-item distance-stat">距离: <strong>-</strong></span>
        </div>
      </div>
      <div class="algorithm-status detecting">
        <span class="status-icon">🔍</span>
        <span class="status-text">等待开始...</span>
      </div>
      <div class="cycle-info-panel" style="display:none;">
        <span class="cycle-info-item">🔄 尾部: <strong class="tail-length">0</strong> 节点</span>
        <span class="cycle-info-item">环长: <strong class="cycle-length">0</strong> 节点</span>
      </div>
    `;
    
    container.insertBefore(infoPanel, this.svg);
    
    this.slowStatEl = infoPanel.querySelector('.slow-stat strong');
    this.fastStatEl = infoPanel.querySelector('.fast-stat strong');
    this.distanceStatEl = infoPanel.querySelector('.distance-stat strong');
    this.statusEl = infoPanel.querySelector('.algorithm-status');
    this.statusIconEl = infoPanel.querySelector('.status-icon');
    this.statusTextEl = infoPanel.querySelector('.status-text');
    this.cycleInfoPanel = infoPanel.querySelector('.cycle-info-panel');
    this.tailLengthEl = infoPanel.querySelector('.tail-length');
    this.cycleLengthEl = infoPanel.querySelector('.cycle-length');
  }


  /**
   * 初始化可视化
   * @param {number[]} values - 节点值数组
   * @param {number} cyclePos - 环的位置
   */
  initialize(values, cyclePos) {
    this.values = values;
    this.nodes = values.map((val, index) => ({
      val,
      index,
      x: this.startX + index * this.nodeSpacing,
      y: this.startY
    }));
    this.cyclePos = cyclePos;
    this.slowMoves = 0;
    this.fastMoves = 0;
    this.hasCycleResult = null;
    
    // 重置增强组件
    this.trailManager.reset();
    this.visitCounter.reset();
    this.cycleInfo = this.cycleAnalyzer.analyze(values, cyclePos);
    
    this.render();
    this.updateInfoPanel();
  }

  /**
   * 更新显示状态
   * @param {object} step - 算法步骤
   * @param {number} totalSteps - 总步骤数
   */
  update(step, totalSteps) {
    if (!step) return;
    
    // 更新指针位置
    this.slowPos = step.slowPos;
    this.fastPos = step.fastPos;
    this.currentStep = step.stepNumber;
    this.totalSteps = totalSteps;
    this.hasCycleResult = step.hasCycle;
    
    // 统计移动次数并记录轨迹
    if (step.description && step.description.includes('慢指针移动')) {
      this.slowMoves++;
      if (step.slowPos >= 0) {
        this.trailManager.recordSlowVisit(step.slowPos);
        this.visitCounter.incrementSlowVisit(step.slowPos);
      }
    }
    if (step.description && step.description.includes('快指针移动')) {
      this.fastMoves++;
      if (step.fastPos >= 0) {
        this.trailManager.recordFastVisit(step.fastPos);
        this.visitCounter.incrementFastVisit(step.fastPos);
      }
    }
    
    // 初始化时记录起始位置
    if (step.stepNumber === 1 && step.description && step.description.includes('初始化')) {
      if (step.slowPos >= 0) {
        this.trailManager.recordSlowVisit(step.slowPos);
        this.visitCounter.incrementSlowVisit(step.slowPos);
      }
      if (step.fastPos >= 0) {
        this.trailManager.recordFastVisit(step.fastPos);
        this.visitCounter.incrementFastVisit(step.fastPos);
      }
    }
    
    // 重置统计（如果回到开始）
    if (step.stepNumber === 0) {
      this.slowMoves = 0;
      this.fastMoves = 0;
      this.trailManager.reset();
      this.visitCounter.reset();
    }
    
    this.render();
    this.updateStepInfo(step.stepNumber + 1, totalSteps);
    this.updateDescription(step.description);
    this.updateInfoPanel();
  }

  /**
   * 更新信息面板
   */
  updateInfoPanel() {
    if (this.slowStatEl) {
      this.slowStatEl.textContent = this.slowMoves;
    }
    if (this.fastStatEl) {
      this.fastStatEl.textContent = this.fastMoves;
    }
    
    // 更新距离显示
    if (this.distanceStatEl) {
      if (this.slowPos >= 0 && this.fastPos >= 0) {
        const distance = this.distanceCalculator.calculateLinearDistance(this.slowPos, this.fastPos);
        if (distance === 0) {
          this.distanceStatEl.textContent = '0 (相遇!)';
          this.distanceStatEl.parentElement.classList.add('highlight');
        } else {
          this.distanceStatEl.textContent = distance;
          this.distanceStatEl.parentElement.classList.remove('highlight');
        }
      } else {
        this.distanceStatEl.textContent = '-';
      }
    }
    
    // 更新环形结构信息
    if (this.cycleInfoPanel && this.cycleInfo) {
      if (this.cycleInfo.hasCycle) {
        this.cycleInfoPanel.style.display = 'flex';
        if (this.tailLengthEl) this.tailLengthEl.textContent = this.cycleInfo.tailLength;
        if (this.cycleLengthEl) this.cycleLengthEl.textContent = this.cycleInfo.cycleLength;
      } else {
        this.cycleInfoPanel.style.display = 'none';
      }
    }
    
    if (this.statusEl && this.statusIconEl && this.statusTextEl) {
      this.statusEl.className = 'algorithm-status';
      if (this.hasCycleResult === true) {
        this.statusEl.classList.add('found');
        this.statusIconEl.textContent = '✅';
        this.statusTextEl.textContent = '检测到环！快慢指针在节点相遇';
      } else if (this.hasCycleResult === false) {
        this.statusEl.classList.add('not-found');
        this.statusIconEl.textContent = '❌';
        this.statusTextEl.textContent = '无环，快指针到达链表末尾';
      } else {
        this.statusEl.classList.add('detecting');
        this.statusIconEl.textContent = '🔍';
        this.statusTextEl.textContent = '检测中...';
      }
    }
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
    this.svg.setAttribute('viewBox', `0 0 ${width} ${this.svgHeight}`);
    
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
      
      // 判断是否是相遇点
      const isMeetPoint = this.slowPos === this.fastPos && 
                          this.slowPos === index && 
                          this.hasCycleResult === true;
      
      // 判断是否在环内
      const isInCycle = this.cycleInfo && this.cycleInfo.hasCycle && 
                        this.cycleInfo.cycleNodes.includes(index);
      
      // 渲染轨迹背景
      const slowIntensity = this.trailManager.getTrailIntensity(index, 'slow');
      const fastIntensity = this.trailManager.getTrailIntensity(index, 'fast');
      
      if (slowIntensity > 0) {
        const slowTrail = this.createSvgElement('circle', {
          r: this.nodeRadius + 4,
          fill: 'none',
          stroke: `rgba(76, 175, 80, ${slowIntensity})`,
          'stroke-width': 3
        });
        group.appendChild(slowTrail);
      }
      
      if (fastIntensity > 0) {
        const fastTrail = this.createSvgElement('circle', {
          r: this.nodeRadius + 8,
          fill: 'none',
          stroke: `rgba(244, 67, 54, ${fastIntensity})`,
          'stroke-width': 2
        });
        group.appendChild(fastTrail);
      }
      
      // 相遇点特殊效果
      if (isMeetPoint) {
        const meetGlow = this.createSvgElement('circle', {
          r: this.nodeRadius + 12,
          fill: 'none',
          stroke: this.colors.meetPoint,
          'stroke-width': 3,
          'stroke-dasharray': '4,2'
        });
        group.appendChild(meetGlow);
      }
      
      // 节点圆圈
      const nodeColor = isMeetPoint ? this.colors.meetPoint : 
                        (isInCycle ? '#e91e63' : this.colors.node);
      const circle = this.createSvgElement('circle', {
        r: this.nodeRadius,
        fill: nodeColor,
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
        y: this.nodeRadius + 16,
        'text-anchor': 'middle',
        fill: '#999',
        'font-size': '11'
      });
      indexText.textContent = `[${index}]`;
      group.appendChild(indexText);
      
      // 访问次数标签
      const slowVisits = this.visitCounter.getSlowVisitCount(index);
      const fastVisits = this.visitCounter.getFastVisitCount(index);
      if (slowVisits > 0 || fastVisits > 0) {
        const visitText = this.createSvgElement('text', {
          y: this.nodeRadius + 28,
          'text-anchor': 'middle',
          fill: '#666',
          'font-size': '9'
        });
        const parts = [];
        if (slowVisits > 0) parts.push(`s:${slowVisits}`);
        if (fastVisits > 0) parts.push(`f:${fastVisits}`);
        visitText.textContent = parts.join(' ');
        group.appendChild(visitText);
      }
      
      // 环入口标记
      if (index === this.cyclePos) {
        const cycleLabel = this.createSvgElement('text', {
          y: this.nodeRadius + 40,
          'text-anchor': 'middle',
          fill: this.colors.cycle,
          'font-size': '10',
          'font-weight': 'bold'
        });
        cycleLabel.textContent = '环入口';
        group.appendChild(cycleLabel);
      }
      
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
    
    // 定义环形箭头标记 - 增大箭头尺寸
    const defs = this.svg.querySelector('defs') || this.createSvgElement('defs');
    if (!this.svg.querySelector('#cycle-arrowhead')) {
      const marker = this.createSvgElement('marker', {
        id: 'cycle-arrowhead',
        markerWidth: '14',
        markerHeight: '10',
        refX: '12',
        refY: '5',
        orient: 'auto'
      });
      const polygon = this.createSvgElement('polygon', {
        points: '0 0, 14 5, 0 10',
        fill: this.colors.cycle
      });
      marker.appendChild(polygon);
      defs.appendChild(marker);
      if (!this.svg.querySelector('defs')) {
        this.svg.appendChild(defs);
      }
    }
    
    // 绘制曲线箭头 - 增加线条宽度，使用实线而非虚线
    const path = this.createSvgElement('path', {
      d: this.getCyclePathD(lastNode, targetNode),
      fill: 'none',
      stroke: this.colors.cycle,
      'stroke-width': 3,
      'marker-end': 'url(#cycle-arrowhead)'
    });
    this.svg.appendChild(path);
    
    // 添加环形标签 - 增大字体和调整位置
    const labelX = (lastNode.x + targetNode.x) / 2;
    const labelY = this.startY + 110;
    const label = this.createSvgElement('text', {
      x: labelX,
      y: labelY,
      'text-anchor': 'middle',
      fill: this.colors.cycle,
      'font-size': '14',
      'font-weight': 'bold'
    });
    label.textContent = '环';
    this.svg.appendChild(label);
  }

  /**
   * 获取环形路径 - 增大曲线幅度
   */
  getCyclePathD(from, to) {
    const startX = from.x;
    const startY = from.y + this.nodeRadius;
    const endX = to.x;
    const endY = to.y + this.nodeRadius;
    // 增大曲线幅度，从 60 改为 100，使环形箭头更明显
    const curveY = this.startY + 100;
    
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
    const offsetY = label === 'slow' ? -45 : -65;
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
