/**
 * 代码面板组件测试
 */
import { CodePanel } from '../src/scripts/codePanel.js';
import fc from 'fast-check';

// Mock Prism
global.window = {
  Prism: {
    highlight: (code) => code,
    languages: { java: {} }
  }
};

describe('CodePanel', () => {
  let panel;
  let container;

  beforeEach(() => {
    // 创建模拟 DOM
    container = document.createElement('code');
    container.id = 'code-display';
    document.body.appendChild(container);
    
    panel = new CodePanel('code-display');
    panel.initialize();
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  /**
   * **Feature: leetcode-141-visualizer, Property 2: Variable State Display Consistency**
   * **Validates: Requirements 2.3**
   * 
   * For any algorithm step that contains variable state changes, the code panel SHALL display
   * each variable's value inline after its corresponding code line, and the displayed values
   * SHALL match the step's variables array.
   */
  describe('Property 2: Variable State Display Consistency', () => {
    it('should display variables on correct lines', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              name: fc.constantFrom('slow', 'fast', 'head', 'temp'),
              value: fc.stringOf(fc.constantFrom('a', 'b', '1', '2'), { minLength: 1, maxLength: 5 }),
              line: fc.integer({ min: 1, max: 15 })
            }),
            { minLength: 1, maxLength: 3 }
          ),
          (variables) => {
            panel.showVariables(variables);
            
            // 验证每个变量都显示在正确的行
            return variables.every(variable => {
              if (variable.line < 1 || variable.line > panel.lineElements.length) {
                return true; // 超出范围的行不显示
              }
              const lineEl = panel.lineElements[variable.line - 1];
              const varDisplays = lineEl.querySelectorAll('.variable-value');
              // 检查是否有任何一个变量显示包含该变量名
              return Array.from(varDisplays).some(el => el.dataset.varName === variable.name);
            });
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should clear previous variables when showing new ones', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 10 }),
          fc.integer({ min: 1, max: 10 }),
          (line1, line2) => {
            // 确保两行不同
            const actualLine2 = line1 === line2 ? (line2 % 10) + 1 : line2;
            
            const firstVars = [{ name: 'oldVar', value: 'old', line: line1 }];
            const secondVars = [{ name: 'newVar', value: 'new', line: actualLine2 }];
            
            panel.showVariables(firstVars);
            panel.showVariables(secondVars);
            
            // 验证第一组变量已被清除
            const line1El = panel.lineElements[line1 - 1];
            const oldVarDisplay = line1El.querySelector('[data-var-name="oldVar"]');
            
            // 旧变量应该被清除
            return oldVarDisplay === null;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  // 单元测试
  describe('Unit Tests', () => {
    it('should initialize with code lines', () => {
      expect(panel.codeLines.length).toBeGreaterThan(0);
      expect(panel.lineElements.length).toBe(panel.codeLines.length);
    });

    it('should highlight specified line', () => {
      panel.highlightLine(5);
      expect(panel.getCurrentLine()).toBe(5);
      expect(panel.lineElements[4].classList.contains('highlighted')).toBe(true);
    });

    it('should remove previous highlight when highlighting new line', () => {
      panel.highlightLine(5);
      panel.highlightLine(8);
      expect(panel.lineElements[4].classList.contains('highlighted')).toBe(false);
      expect(panel.lineElements[7].classList.contains('highlighted')).toBe(true);
    });

    it('should show variable values', () => {
      const variables = [
        { name: 'slow', value: '节点(3)', line: 6 },
        { name: 'fast', value: '节点(2)', line: 7 }
      ];
      panel.showVariables(variables);
      
      const slowVar = panel.lineElements[5].querySelector('.variable-value');
      const fastVar = panel.lineElements[6].querySelector('.variable-value');
      
      expect(slowVar).not.toBeNull();
      expect(fastVar).not.toBeNull();
      expect(slowVar.textContent).toContain('slow');
      expect(fastVar.textContent).toContain('fast');
    });

    it('should update with step data', () => {
      const step = {
        codeLine: 8,
        variables: [{ name: 'slow', value: '节点(0)', line: 6 }]
      };
      panel.update(step);
      
      expect(panel.getCurrentLine()).toBe(8);
      expect(panel.getVariables()).toEqual(step.variables);
    });

    it('should escape HTML in code', () => {
      const escaped = panel.escapeHtml('<script>alert("xss")</script>');
      expect(escaped).not.toContain('<script>');
    });
  });
});
