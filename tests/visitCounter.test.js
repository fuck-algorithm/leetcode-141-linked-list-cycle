import { VisitCounter } from '../src/scripts/visitCounter.js';
import fc from 'fast-check';

describe('VisitCounter', () => {
  let counter;

  beforeEach(() => {
    counter = new VisitCounter();
  });

  describe('基础功能测试', () => {
    test('初始状态计数为0', () => {
      expect(counter.getSlowVisitCount(0)).toBe(0);
      expect(counter.getFastVisitCount(0)).toBe(0);
    });

    test('增加慢指针访问计数', () => {
      counter.incrementSlowVisit(0);
      counter.incrementSlowVisit(0);
      expect(counter.getSlowVisitCount(0)).toBe(2);
    });

    test('增加快指针访问计数', () => {
      counter.incrementFastVisit(1);
      expect(counter.getFastVisitCount(1)).toBe(1);
    });

    test('isRevisited 检测重复访问', () => {
      counter.incrementSlowVisit(0);
      expect(counter.isRevisited(0)).toBe(false);
      counter.incrementSlowVisit(0);
      expect(counter.isRevisited(0)).toBe(true);
    });
  });

  /**
   * **Feature: canvas-info-enhancement, Property 4: Visit Count Accuracy**
   * **Validates: Requirements 2.1, 2.2**
   */
  describe('Property 4: Visit Count Accuracy', () => {
    test('对于任意访问序列，计数等于实际访问次数', () => {
      fc.assert(
        fc.property(
          fc.array(fc.integer({ min: 0, max: 20 }), { minLength: 0, maxLength: 100 }),
          fc.array(fc.integer({ min: 0, max: 20 }), { minLength: 0, maxLength: 100 }),
          (slowVisits, fastVisits) => {
            const cnt = new VisitCounter();
            
            const expectedSlow = new Map();
            const expectedFast = new Map();
            
            slowVisits.forEach(idx => {
              cnt.incrementSlowVisit(idx);
              expectedSlow.set(idx, (expectedSlow.get(idx) || 0) + 1);
            });
            
            fastVisits.forEach(idx => {
              cnt.incrementFastVisit(idx);
              expectedFast.set(idx, (expectedFast.get(idx) || 0) + 1);
            });
            
            for (const [idx, expected] of expectedSlow) {
              if (cnt.getSlowVisitCount(idx) !== expected) return false;
            }
            
            for (const [idx, expected] of expectedFast) {
              if (cnt.getFastVisitCount(idx) !== expected) return false;
            }
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * **Feature: canvas-info-enhancement, Property 5: Visit Count Reset Completeness**
   * **Validates: Requirements 2.4**
   */
  describe('Property 5: Visit Count Reset Completeness', () => {
    test('对于任意访问序列，重置后所有计数为零', () => {
      fc.assert(
        fc.property(
          fc.array(fc.integer({ min: 0, max: 20 }), { minLength: 1, maxLength: 50 }),
          fc.array(fc.integer({ min: 0, max: 20 }), { minLength: 1, maxLength: 50 }),
          (slowVisits, fastVisits) => {
            const cnt = new VisitCounter();
            
            slowVisits.forEach(idx => cnt.incrementSlowVisit(idx));
            fastVisits.forEach(idx => cnt.incrementFastVisit(idx));
            
            cnt.reset();
            
            const allIndices = new Set([...slowVisits, ...fastVisits]);
            for (const idx of allIndices) {
              if (cnt.getSlowVisitCount(idx) !== 0) return false;
              if (cnt.getFastVisitCount(idx) !== 0) return false;
            }
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
