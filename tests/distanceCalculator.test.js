import { DistanceCalculator } from '../src/scripts/distanceCalculator.js';
import fc from 'fast-check';

describe('DistanceCalculator', () => {
  let calculator;

  beforeEach(() => {
    calculator = new DistanceCalculator();
  });

  describe('基础功能测试', () => {
    test('线性距离计算', () => {
      expect(calculator.calculateLinearDistance(0, 3)).toBe(3);
      expect(calculator.calculateLinearDistance(2, 5)).toBe(3);
      expect(calculator.calculateLinearDistance(5, 2)).toBe(3);
    });

    test('相同位置距离为0', () => {
      expect(calculator.calculateLinearDistance(2, 2)).toBe(0);
    });

    test('无效位置返回-1', () => {
      expect(calculator.calculateLinearDistance(-1, 3)).toBe(-1);
      expect(calculator.calculateLinearDistance(3, -1)).toBe(-1);
    });

    test('环内距离计算', () => {
      const result = calculator.calculateCycleAwareDistance(1, 3, 1, 4);
      expect(result.isInCycle).toBe(true);
      expect(result.forwardDistance).toBe(2);
    });
  });

  /**
   * **Feature: canvas-info-enhancement, Property 6: Distance Calculation Correctness**
   * **Validates: Requirements 3.1, 3.4**
   */
  describe('Property 6: Distance Calculation Correctness', () => {
    test('对于任意两个位置，线性距离等于位置差的绝对值', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 100 }),
          fc.integer({ min: 0, max: 100 }),
          (pos1, pos2) => {
            const distance = calculator.calculateLinearDistance(pos1, pos2);
            return distance === Math.abs(pos1 - pos2);
          }
        ),
        { numRuns: 100 }
      );
    });

    test('对于环内两个位置，环距离不超过环长度的一半', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 3, max: 50 }),
          fc.integer({ min: 0, max: 49 }),
          (totalNodes, cyclePos) => {
            fc.pre(cyclePos < totalNodes);
            const cycleLength = totalNodes - cyclePos;
            fc.pre(cycleLength >= 2);
            
            const slowPos = cyclePos + Math.floor(Math.random() * cycleLength);
            const fastPos = cyclePos + Math.floor(Math.random() * cycleLength);
            
            const result = calculator.calculateCycleAwareDistance(
              slowPos, fastPos, cyclePos, totalNodes
            );
            
            return result.cycleDistance <= Math.floor(cycleLength / 2) + 1;
          }
        ),
        { numRuns: 100 }
      );
    });

    test('对于非环内位置，isInCycle 为 false', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 2, max: 50 }),
          fc.integer({ min: 1, max: 49 }),
          (totalNodes, cyclePos) => {
            fc.pre(cyclePos < totalNodes && cyclePos > 0);
            
            const slowPos = Math.floor(Math.random() * cyclePos);
            const fastPos = Math.floor(Math.random() * cyclePos);
            
            const result = calculator.calculateCycleAwareDistance(
              slowPos, fastPos, cyclePos, totalNodes
            );
            
            return result.isInCycle === false;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
