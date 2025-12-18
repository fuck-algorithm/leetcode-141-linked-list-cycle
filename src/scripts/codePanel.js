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
    this.wrapperEl = null;
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

    // 创建包装容器
    this.wrapperEl = document.createElement('div');
    this.wrapperEl.className = 'code-wrapper';

    // 创建带行号的代码显示
    this.codeLines.forEach((line, index) => {
      const lineNumber = index + 1;
      
      // 创建行容器
      const lineContainer = document.createElement('div');
      lineContainer.className = 'code-line-container';
      lineContainer.dataset.line = lineNumber;
      
      // 创建行号
      const lineNumEl = document.createElement('span');
      lineNumEl.className = 'line-number';
      lineNumEl.textContent = lineNumber;
      
      // 创建代码内容
      const codeEl = document.createElement('span');
      codeEl.className = 'code-content';
      
      // 应用语法高亮
      if (window.Prism && window.Prism.languages.java) {
        codeEl.innerHTML = window.Prism.highlight(line, window.Prism.languages.java, 'java');
      } else {
        codeEl.textContent = line;
      }
      
      // 创建变量值容器
      const varContainer = document.createElement('span');
      varContainer.className = 'variable-container';
      
      lineContainer.appendChild(lineNumEl);
      lineContainer.appendChild(codeEl);
      lineContainer.appendChild(varContainer);
      
      this.wrapperEl.appendChild(lineContainer);
    });

    // 清空并添加新内容
    this.container.innerHTML = '';
    this.container.appendChild(this.wrapperEl);
    
    this.lineElements = this.wrapperEl.querySelectorAll('.code-line-container');
  }

  /**
   * 高亮指定行
   * @param {number} lineNumber - 行号（1-indexed）
   */
  highlightLine(lineNumber) {
    // 移除之前的高亮
    this.lineElements.forEach(el => {
      el.classList.remove('highlighted');
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
      const varContainer = el.querySelector('.variable-container');
      if (varContainer) {
        varContainer.innerHTML = '';
      }
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
      const varContainer = lineEl.querySelector('.variable-container');
      if (varContainer) {
        vars.forEach(variable => {
          const varSpan = document.createElement('span');
          varSpan.className = 'variable-value';
          varSpan.textContent = `${variable.name} = ${variable.value}`;
          varSpan.dataset.varName = variable.name;
          varContainer.appendChild(varSpan);
        });
      }
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
