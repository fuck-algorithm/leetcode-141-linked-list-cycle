/**
 * 代码面板组件 - 展示 Java 代码，支持语法高亮和调试效果
 */

import { JAVA_CODE } from './algorithm.js';

export class CodePanel {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.currentLine = -1;
    this.variables = [];
    this.codeLines = [];
    this.lineElements = [];
  }

  /**
   * 初始化代码面板
   */
  initialize() {
    this.codeLines = JAVA_CODE.split('\n');
    this.render();
  }

  /**
   * 渲染代码
   */
  render() {
    if (!this.container) return;

    // 创建带行号的代码显示
    const html = this.codeLines.map((line, index) => {
      const lineNumber = index + 1;
      const escapedLine = this.escapeHtml(line);
      return `<span class="code-line" data-line="${lineNumber}">${escapedLine}</span>`;
    }).join('\n');

    this.container.innerHTML = html;
    this.lineElements = this.container.querySelectorAll('.code-line');

    // 应用 Prism 语法高亮
    if (window.Prism) {
      this.applySyntaxHighlighting();
    }
  }

  /**
   * 应用语法高亮
   */
  applySyntaxHighlighting() {
    this.lineElements.forEach((el, index) => {
      const code = this.codeLines[index];
      const highlighted = window.Prism.highlight(code, window.Prism.languages.java, 'java');
      el.innerHTML = highlighted;
    });
  }

  /**
   * 高亮指定行
   * @param {number} lineNumber - 行号（1-indexed）
   */
  highlightLine(lineNumber) {
    // 移除之前的高亮
    this.lineElements.forEach(el => {
      el.classList.remove('highlighted');
      // 移除变量值显示
      const varDisplay = el.querySelector('.variable-value');
      if (varDisplay) {
        varDisplay.remove();
      }
    });

    this.currentLine = lineNumber;

    // 添加新的高亮
    if (lineNumber > 0 && lineNumber <= this.lineElements.length) {
      const lineEl = this.lineElements[lineNumber - 1];
      lineEl.classList.add('highlighted');
      
      // 滚动到可见区域
      if (lineEl.scrollIntoView) {
        lineEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }

  /**
   * 显示变量值
   * @param {Array} variables - 变量数组 [{name, value, line}]
   */
  showVariables(variables) {
    this.variables = variables;

    // 先清除所有变量显示
    this.lineElements.forEach(el => {
      const varDisplays = el.querySelectorAll('.variable-value');
      varDisplays.forEach(v => v.remove());
    });

    // 按行分组变量
    const varsByLine = {};
    variables.forEach(variable => {
      if (variable.line > 0 && variable.line <= this.lineElements.length) {
        if (!varsByLine[variable.line]) {
          varsByLine[variable.line] = [];
        }
        varsByLine[variable.line].push(variable);
      }
    });

    // 显示新的变量值
    Object.entries(varsByLine).forEach(([line, vars]) => {
      const lineEl = this.lineElements[parseInt(line) - 1];
      vars.forEach(variable => {
        const varSpan = document.createElement('span');
        varSpan.className = 'variable-value';
        varSpan.textContent = `${variable.name} = ${variable.value}`;
        varSpan.dataset.varName = variable.name;
        lineEl.appendChild(varSpan);
      });
    });
  }

  /**
   * 更新显示状态
   * @param {object} step - 算法步骤
   */
  update(step) {
    if (!step) return;
    this.highlightLine(step.codeLine);
    this.showVariables(step.variables || []);
  }

  /**
   * 获取当前高亮行
   * @returns {number}
   */
  getCurrentLine() {
    return this.currentLine;
  }

  /**
   * 获取当前变量
   * @returns {Array}
   */
  getVariables() {
    return this.variables;
  }

  /**
   * HTML 转义
   * @param {string} text
   * @returns {string}
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

export default CodePanel;
