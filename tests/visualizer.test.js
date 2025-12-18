/**
 * 可视化组件测试
 */
import { Visualizer } from '../src/scripts/visualizer.js';
import fc from 'fast-check';

describe('Visualizer', () => {
  let visualizer;
  let svg;
  let stepInfo;
  let description;

  beforeEach(() => {
    // 创建模拟 DOM
    svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.id = 'visualizer-svg';
    document.body.appendChild(svg);
    
    stepInfo = document.createElement('span');
    stepInfo.id = 'step-info';
    document.body.appendChild(stepInfo);
    
    description = document.createElement('div');
    description.id = 'phase-description';
    document.body.appendChild(description);
    
    visualizer = new Visualizer('visualizer-svg', 'step-info', 'phase-description');
  });

  afterEach(() => {
    document.body.removeChild(svg);
    document.body.removeChild(stepInfo);
    document.body.removeChild(description);
  });

  /**
   * **Feature: leetcode-141-visualizer, Property 5: Pointer Visualization Distinction**
   * **Validates: Requirements 4.2**
   * 
   * For any algorithm step where slow pointer and fast pointer are at different positions,
   * the visualizer SHALL render them with visually distinct markers (different colors or shapes).
   */
  describe('Property 5: Pointer Visualization Distinction', () => {
    it('should have distinct colors for slow and fast pointers', () => {
      fc.assert(
        fc.property(
          fc.array(fc.integer({ min: -100, max: 100 }), { minLength: 3, maxLength: 10 }),
          fc.integer({ min: 0, max: 2 }),
          fc.integer({ min: 0, max: 2 }),
          (values, slowIdx, fastIdx) => {
            const slow = Math.min(slowIdx, values.length - 1);
            const fast = Math.min(fastIdx, values.length - 1);
            
            visualizer.initialize(values, -1);
            visualizer.update({
              stepNumber: 0,
              slowPos: slow,
              fastPos: fast,
              description: 'test'
            }, 1);
            
            // 验证指针颜色不同
            return visualizer.hasDistinctPointerMarkers();
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * **Feature: leetcode-141-visualizer, Property 6: Cycle Visualization Correctness**
   * **Validates: Requirements 4.3**
   * 
   * For any linked list data where pos >= 0, the visualizer SHALL render a visual connection
   * (arrow) from the last node back to the node at index pos.
   */
  describe('Property 6: Cycle Visualization Correctness', () => {
    it('should visualize cycle when pos >= 0', () => {
      fc.assert(
        fc.property(
          fc.array(fc.integer({ min: -100, max: 100 }), { minLength: 2, maxLength: 10 }),
          fc.integer({ min: 0, max: 9 }),
          (values, pos) => {
            const validPos = Math.min(pos, values.length - 1);
            visualizer.initialize(values, validPos);
            
            return visualizer.hasCycleVisualization();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should not visualize cycle when pos < 0', () => {
      fc.assert(
        fc.property(
          fc.array(fc.integer({ min: -100, max: 100 }), { minLength: 1, maxLength: 10 }),
          (values) => {
            visualizer.initialize(values, -1);
            
            return !visualizer.hasCycleVisualization();
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * **Feature: leetcode-141-visualizer, Property 7: Step Information Completeness**
   * **Validates: Requirements 4.4**
   * 
   * For any algorithm step, the visualizer SHALL display:
   * - Current step number (1-indexed for user display)
   * - Total number of steps
   * - A non-empty phase description string
   */
  describe('Property 7: Step Information Completeness', () => {
    it('should display complete step information', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 99 }),
          fc.integer({ min: 1, max: 100 }),
          fc.string({ minLength: 1, maxLength: 50 }),
          (stepNum, totalSteps, desc) => {
            const validStepNum = Math.min(stepNum, totalSteps - 1);
            
            visualizer.initialize([1, 2, 3], -1);
            visualizer.update({
              stepNumber: validStepNum,
              slowPos: 0,
              fastPos: 1,
              description: desc
            }, totalSteps);
            
            const state = visualizer.getState();
            const stepInfoText = stepInfo.textContent;
            const descText = description.textContent;
            
            // 验证步骤信息包含当前步骤和总步骤
            const hasStepNum = stepInfoText.includes(String(validStepNum + 1));
            const hasTotalSteps = stepInfoText.includes(String(totalSteps));
            const hasDescription = descText.length > 0;
            
            return hasStepNum && hasTotalSteps && hasDescription;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * **Feature: canvas-info-enhancement, Property 2: Trail Color Distinction**
   * **Validates: Requirements 1.3**
   */
  describe('Property 2: Trail Color Distinction', () => {
    it('should have distinct trail colors for slow and fast pointers', () => {
      fc.assert(
        fc.property(
          fc.array(fc.integer({ min: -100, max: 100 }), { minLength: 3, maxLength: 10 }),
          (values) => {
            visualizer.initialize(values, -1);
            
            const slowColor = visualizer.trailManager.config.slowColor;
            const fastColor = visualizer.trailManager.config.fastColor;
            
            return slowColor !== fastColor;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * **Feature: leetcode-141-visualizer, Property 8: Node Spacing Minimum**
   * **Validates: Requirements 4.6**
   * 
   * For any linked list visualization with cyclePos >= 0, the node spacing SHALL be
   * at least 100px to ensure the cycle connection arrow is clearly visible.
   */
  describe('Property 8: Node Spacing Minimum', () => {
    it('should have node spacing of at least 100px for cyclic linked lists', () => {
      fc.assert(
        fc.property(
          fc.array(fc.integer({ min: -100, max: 100 }), { minLength: 2, maxLength: 10 }),
          fc.integer({ min: 0, max: 9 }),
          (values, pos) => {
            const validPos = Math.min(pos, values.length - 1);
            visualizer.initialize(values, validPos);
            
            // 验证节点间距至少为 100px
            return visualizer.nodeSpacing >= 100;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should maintain minimum spacing for all linked lists', () => {
      fc.assert(
        fc.property(
          fc.array(fc.integer({ min: -100, max: 100 }), { minLength: 1, maxLength: 15 }),
          fc.integer({ min: -1, max: 14 }),
          (values, pos) => {
            const validPos = pos >= 0 ? Math.min(pos, values.length - 1) : -1;
            visualizer.initialize(values, validPos);
            
            // 验证节点间距至少为 100px
            return visualizer.nodeSpacing >= 100;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  // 单元测试
  describe('Unit Tests', () => {
    it('should initialize with nodes', () => {
      visualizer.initialize([3, 2, 0, -4], 1);
      expect(visualizer.nodes.length).toBe(4);
      expect(visualizer.cyclePos).toBe(1);
    });

    it('should render empty state for empty list', () => {
      visualizer.initialize([], -1);
      expect(svg.querySelector('text').textContent).toBe('空链表');
    });

    it('should update pointer positions', () => {
      visualizer.initialize([1, 2, 3], -1);
      visualizer.update({
        stepNumber: 1,
        slowPos: 0,
        fastPos: 2,
        description: '测试'
      }, 5);
      
      const state = visualizer.getState();
      expect(state.slowPos).toBe(0);
      expect(state.fastPos).toBe(2);
    });

    it('should update step info text', () => {
      visualizer.initialize([1, 2], -1);
      visualizer.update({
        stepNumber: 2,
        slowPos: 0,
        fastPos: 1,
        description: '测试描述'
      }, 10);
      
      expect(stepInfo.textContent).toBe('步骤: 3 / 10');
      expect(description.textContent).toBe('测试描述');
    });

    it('should create SVG elements correctly', () => {
      const rect = visualizer.createSvgElement('rect', { x: 10, y: 20 });
      expect(rect.tagName).toBe('rect');
      expect(rect.getAttribute('x')).toBe('10');
    });
  });
});
