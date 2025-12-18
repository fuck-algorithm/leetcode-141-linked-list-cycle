import { StatusPanel } from '../src/scripts/statusPanel.js';
import fc from 'fast-check';

describe('StatusPanel', () => {
  let panel;
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    panel = new StatusPanel(container);
  });

  describe('基础功能测试', () => {
    test('初始状态', () => {
      expect(panel.slowPosition).toBe(-1);
      expect(panel.fastPosition).toBe(-1);
      expect(panel.iterationCount).toBe(0);
    });

    test('更新状态', () => {
      panel.update({ slowPos: 1, fastPos: 3 }, [3, 2, 0, -4]);
      expect(panel.slowPosition).toBe(1);
      expect(panel.slowValue).toBe(2);
      expect(panel.fastPosition).toBe(3);
      expect(panel.fastValue).toBe(-4);
    });

    test('重置状态', () => {
      panel.update({ slowPos: 1, fastPos: 3, iterationCount: 5 }, [3, 2, 0, -4]);
      panel.reset();
      expect(panel.slowPosition).toBe(-1);
      expect(panel.iterationCount).toBe(0);
    });
  });

  /**
   * **Feature: canvas-info-enhancement, Property 8: Status Panel State Consistency**
   * **Validates: Requirements 7.1, 7.2**
   */
  describe('Property 8: Status Panel State Consistency', () => {
    test('对于任意步骤，状态面板显示值与步骤数据一致', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 20 }),
          fc.integer({ min: 0, max: 20 }),
          fc.array(fc.integer({ min: -100, max: 100 }), { minLength: 1, maxLength: 30 }),
          (slowPos, fastPos, values) => {
            fc.pre(slowPos < values.length && fastPos < values.length);
            
            const p = new StatusPanel(document.createElement('div'));
            p.update({ slowPos, fastPos }, values);
            
            return p.slowPosition === slowPos &&
                   p.fastPosition === fastPos &&
                   p.slowValue === values[slowPos] &&
                   p.fastValue === values[fastPos];
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * **Feature: canvas-info-enhancement, Property 9: Iteration Count Accuracy**
   * **Validates: Requirements 7.4**
   */
  describe('Property 9: Iteration Count Accuracy', () => {
    test('对于任意迭代次数，状态面板准确显示', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 1000 }),
          (iterationCount) => {
            const p = new StatusPanel(document.createElement('div'));
            p.update({ iterationCount });
            return p.iterationCount === iterationCount;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * **Feature: canvas-info-enhancement, Property 10: Speed Ratio Correctness**
   * **Validates: Requirements 5.3**
   */
  describe('Property 10: Speed Ratio Correctness', () => {
    test('对于任意移动次数，速度比计算正确', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 100 }),
          fc.integer({ min: 1, max: 200 }),
          (slowMoves, fastMoves) => {
            const p = new StatusPanel(document.createElement('div'));
            p.update({ slowMoves, fastMoves });
            
            const expectedRatio = fastMoves / slowMoves;
            const actualRatio = p.getSpeedRatio();
            
            return actualRatio === `1:${expectedRatio.toFixed(1)}`;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
