import { CycleAnalyzer } from '../src/scripts/cycleAnalyzer.js';
import fc from 'fast-check';

describe('CycleAnalyzer', () => {
  let analyzer;

  beforeEach(() => {
    analyzer = new CycleAnalyzer();
  });

  describe('基础功能测试', () => {
    test('无环链表返回正确结构', () => {
      const result = analyzer.analyze([3, 2, 0, -4], -1);
      expect(result.hasCycle).toBe(false);
      expect(result.cycleLength).toBe(0);
      expect(result.tailLength).toBe(4);
      expect(result.cycleNodes).toEqual([]);
      expect(result.tailNodes).toEqual([0, 1, 2, 3]);
    });

    test('有环链表返回正确结构', () => {
      const result = analyzer.analyze([3, 2, 0, -4], 1);
      expect(result.hasCycle).toBe(true);
      expect(result.cycleLength).toBe(3);
      expect(result.tailLength).toBe(1);
      expect(result.cycleNodes).toEqual([1, 2, 3]);
      expect(result.tailNodes).toEqual([0]);
    });

    test('环入口在头节点', () => {
      const result = analyzer.analyze([1, 2, 3], 0);
      expect(result.hasCycle).toBe(true);
      expect(result.cycleLength).toBe(3);
      expect(result.tailLength).toBe(0);
      expect(result.cycleNodes).toEqual([0, 1, 2]);
      expect(result.tailNodes).toEqual([]);
    });
  });

  /**
   * **Feature: canvas-info-enhancement, Property 7: Cycle Structure Calculation**
   * **Validates: Requirements 6.1, 6.2, 6.3**
   */
  describe('Property 7: Cycle Structure Calculation', () => {
    test('对于任意有环链表，cycleLength = totalNodes - pos', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 100 }),
          fc.integer({ min: 0, max: 99 }),
          (totalNodes, cyclePos) => {
            fc.pre(cyclePos < totalNodes);
            const values = Array.from({ length: totalNodes }, (_, i) => i);
            const result = analyzer.analyze(values, cyclePos);
            
            return result.cycleLength === totalNodes - cyclePos;
          }
        ),
        { numRuns: 100 }
      );
    });

    test('对于任意有环链表，tailLength = pos', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 100 }),
          fc.integer({ min: 0, max: 99 }),
          (totalNodes, cyclePos) => {
            fc.pre(cyclePos < totalNodes);
            const values = Array.from({ length: totalNodes }, (_, i) => i);
            const result = analyzer.analyze(values, cyclePos);
            
            return result.tailLength === cyclePos;
          }
        ),
        { numRuns: 100 }
      );
    });

    test('对于任意有环链表，cycleNodes 包含从 pos 到 totalNodes-1 的所有索引', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 100 }),
          fc.integer({ min: 0, max: 99 }),
          (totalNodes, cyclePos) => {
            fc.pre(cyclePos < totalNodes);
            const values = Array.from({ length: totalNodes }, (_, i) => i);
            const result = analyzer.analyze(values, cyclePos);
            
            const expectedCycleNodes = Array.from(
              { length: totalNodes - cyclePos },
              (_, i) => cyclePos + i
            );
            return JSON.stringify(result.cycleNodes) === JSON.stringify(expectedCycleNodes);
          }
        ),
        { numRuns: 100 }
      );
    });

    test('对于任意无环链表，cycleLength = 0 且 tailLength = totalNodes', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 100 }),
          (totalNodes) => {
            const values = Array.from({ length: totalNodes }, (_, i) => i);
            const result = analyzer.analyze(values, -1);
            
            return result.cycleLength === 0 && result.tailLength === totalNodes;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
