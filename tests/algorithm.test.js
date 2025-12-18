/**
 * 算法引擎测试
 */
import { AlgorithmEngine, CODE_LINES } from '../src/scripts/algorithm.js';
import fc from 'fast-check';

describe('AlgorithmEngine', () => {
  let engine;

  beforeEach(() => {
    engine = new AlgorithmEngine();
  });

  /**
   * **Feature: leetcode-141-visualizer, Property 1: Step-to-Line Mapping Consistency**
   * **Validates: Requirements 2.2, 2.4**
   * 
   * For any algorithm step index within the valid range [0, totalSteps-1],
   * the code panel SHALL highlight exactly the line number specified by that step's codeLine property.
   */
  describe('Property 1: Step-to-Line Mapping Consistency', () => {
    const validCodeLines = Object.values(CODE_LINES);

    it('should have valid code line numbers for all steps with cycle', () => {
      fc.assert(
        fc.property(
          fc.array(fc.integer({ min: -100, max: 100 }), { minLength: 2, maxLength: 10 }),
          (values) => {
            // 创建有环的链表（环指向第一个节点）
            engine.initialize(values, 0);
            const steps = engine.getAllSteps();
            
            return steps.every(step => {
              return typeof step.codeLine === 'number' &&
                     validCodeLines.includes(step.codeLine) &&
                     step.codeLine >= 2 && step.codeLine <= 15;
            });
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should have valid code line numbers for all steps without cycle', () => {
      fc.assert(
        fc.property(
          fc.array(fc.integer({ min: -100, max: 100 }), { minLength: 1, maxLength: 10 }),
          (values) => {
            engine.initialize(values, -1);
            const steps = engine.getAllSteps();
            
            return steps.every(step => {
              return typeof step.codeLine === 'number' &&
                     validCodeLines.includes(step.codeLine);
            });
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  // 单元测试：示例用例
  describe('Unit Tests: Example Cases', () => {
    it('should detect cycle in [3,2,0,-4] with pos=1', () => {
      engine.initialize([3, 2, 0, -4], 1);
      const steps = engine.getAllSteps();
      const lastStep = steps[steps.length - 1];
      
      expect(lastStep.hasCycle).toBe(true);
      expect(lastStep.codeLine).toBe(CODE_LINES.RETURN_TRUE);
    });

    it('should detect cycle in [1,2] with pos=0', () => {
      engine.initialize([1, 2], 0);
      const steps = engine.getAllSteps();
      const lastStep = steps[steps.length - 1];
      
      expect(lastStep.hasCycle).toBe(true);
    });

    it('should detect no cycle in [1] with pos=-1', () => {
      engine.initialize([1], -1);
      const steps = engine.getAllSteps();
      const lastStep = steps[steps.length - 1];
      
      expect(lastStep.hasCycle).toBe(false);
    });

    it('should handle empty list', () => {
      engine.initialize([], -1);
      const steps = engine.getAllSteps();
      const lastStep = steps[steps.length - 1];
      
      expect(lastStep.hasCycle).toBe(false);
    });
  });

  describe('Step Structure Validation', () => {
    it('should have all required fields in each step', () => {
      engine.initialize([3, 2, 0, -4], 1);
      const steps = engine.getAllSteps();
      
      steps.forEach((step, index) => {
        expect(step).toHaveProperty('stepNumber');
        expect(step).toHaveProperty('codeLine');
        expect(step).toHaveProperty('slowPos');
        expect(step).toHaveProperty('fastPos');
        expect(step).toHaveProperty('variables');
        expect(step).toHaveProperty('description');
        expect(step).toHaveProperty('hasCycle');
        expect(step.stepNumber).toBe(index);
        expect(Array.isArray(step.variables)).toBe(true);
        expect(typeof step.description).toBe('string');
        expect(step.description.length).toBeGreaterThan(0);
      });
    });
  });
});
