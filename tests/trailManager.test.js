import { TrailManager } from '../src/scripts/trailManager.js';
import fc from 'fast-check';

describe('TrailManager', () => {
  let manager;

  beforeEach(() => {
    manager = new TrailManager();
  });

  describe('基础功能测试', () => {
    test('初始状态轨迹为空', () => {
      expect(manager.slowTrail).toEqual([]);
      expect(manager.fastTrail).toEqual([]);
    });

    test('记录慢指针访问', () => {
      manager.recordSlowVisit(0);
      manager.recordSlowVisit(1);
      expect(manager.slowTrail).toEqual([0, 1]);
    });

    test('记录快指针访问', () => {
      manager.recordFastVisit(0);
      manager.recordFastVisit(2);
      expect(manager.fastTrail).toEqual([0, 2]);
    });

    test('重置清空所有数据', () => {
      manager.recordSlowVisit(0);
      manager.recordFastVisit(1);
      manager.reset();
      expect(manager.slowTrail).toEqual([]);
      expect(manager.fastTrail).toEqual([]);
    });
  });

  /**
   * **Feature: canvas-info-enhancement, Property 1: Pointer Trail Completeness**
   * **Validates: Requirements 1.1, 1.2**
   */
  describe('Property 1: Pointer Trail Completeness', () => {
    test('对于任意访问序列，轨迹包含所有访问的节点且顺序正确', () => {
      fc.assert(
        fc.property(
          fc.array(fc.integer({ min: 0, max: 99 }), { minLength: 0, maxLength: 50 }),
          fc.array(fc.integer({ min: 0, max: 99 }), { minLength: 0, maxLength: 50 }),
          (slowVisits, fastVisits) => {
            const mgr = new TrailManager();
            
            slowVisits.forEach(idx => mgr.recordSlowVisit(idx));
            fastVisits.forEach(idx => mgr.recordFastVisit(idx));
            
            return JSON.stringify(mgr.slowTrail) === JSON.stringify(slowVisits) &&
                   JSON.stringify(mgr.fastTrail) === JSON.stringify(fastVisits);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * **Feature: canvas-info-enhancement, Property 3: Trail Intensity Monotonicity**
   * **Validates: Requirements 1.4**
   */
  describe('Property 3: Trail Intensity Monotonicity', () => {
    test('对于任意节点，访问次数越多强度越高', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 99 }),
          fc.integer({ min: 1, max: 10 }),
          fc.integer({ min: 1, max: 10 }),
          (nodeIndex, visits1, visits2) => {
            const mgr = new TrailManager();
            
            for (let i = 0; i < Math.min(visits1, visits2); i++) {
              mgr.recordSlowVisit(nodeIndex);
            }
            const lowerIntensity = mgr.getTrailIntensity(nodeIndex, 'slow');
            
            for (let i = Math.min(visits1, visits2); i < Math.max(visits1, visits2); i++) {
              mgr.recordSlowVisit(nodeIndex);
            }
            const higherIntensity = mgr.getTrailIntensity(nodeIndex, 'slow');
            
            return higherIntensity >= lowerIntensity;
          }
        ),
        { numRuns: 100 }
      );
    });

    test('未访问节点强度为0', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 99 }),
          (nodeIndex) => {
            const mgr = new TrailManager();
            return mgr.getTrailIntensity(nodeIndex, 'slow') === 0 &&
                   mgr.getTrailIntensity(nodeIndex, 'fast') === 0;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
