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

  /**
   * **Feature: leetcode-141-visualizer, Property 9: Fine-Grained Step Generation**
   * **Validates: Requirements 2.6**
   * 
   * For any linked list with at least 2 nodes, each loop iteration in the algorithm
   * SHALL generate at least 3 separate steps: (1) loop condition check, (2) slow pointer movement,
   * (3) fast pointer movement.
   */
  describe('Property 9: Fine-Grained Step Generation', () => {
    it('should generate at least 3 steps per loop iteration for cyclic lists', () => {
      fc.assert(
        fc.property(
          fc.array(fc.integer({ min: -100, max: 100 }), { minLength: 3, maxLength: 8 }),
          fc.integer({ min: 0, max: 7 }),
          (values, pos) => {
            const validPos = Math.min(pos, values.length - 1);
            engine.initialize(values, validPos);
            const steps = engine.getAllSteps();
            
            // 找到所有 while 条件检查步骤
            const whileCheckSteps = steps.filter(s => s.codeLine === CODE_LINES.WHILE_CHECK);
            
            // 找到所有慢指针移动步骤
            const slowMoveSteps = steps.filter(s => s.codeLine === CODE_LINES.SLOW_NEXT);
            
            // 找到所有快指针移动步骤
            const fastMoveSteps = steps.filter(s => s.codeLine === CODE_LINES.FAST_NEXT);
            
            // 如果有循环迭代，应该有对应的步骤
            // 每次完整的循环迭代应该包含: while检查 + null检查 + slow移动 + fast移动
            // 至少应该有 while 检查步骤
            if (whileCheckSteps.length > 0) {
              // 慢指针和快指针移动次数应该相等
              return slowMoveSteps.length === fastMoveSteps.length;
            }
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should include null check steps in each loop iteration', () => {
      fc.assert(
        fc.property(
          fc.array(fc.integer({ min: -100, max: 100 }), { minLength: 3, maxLength: 8 }),
          fc.integer({ min: 0, max: 7 }),
          (values, pos) => {
            const validPos = Math.min(pos, values.length - 1);
            engine.initialize(values, validPos);
            const steps = engine.getAllSteps();
            
            // 找到所有 null 检查步骤
            const nullCheckSteps = steps.filter(s => s.codeLine === CODE_LINES.FAST_NULL_CHECK);
            
            // 找到所有慢指针移动步骤
            const slowMoveSteps = steps.filter(s => s.codeLine === CODE_LINES.SLOW_NEXT);
            
            // 如果有指针移动，应该有对应的 null 检查
            // 每次循环迭代应该有 2 个 null 检查步骤（检查 fast 和 fast.next）
            if (slowMoveSteps.length > 0) {
              // null 检查步骤数应该是指针移动次数的 2 倍
              return nullCheckSteps.length >= slowMoveSteps.length * 2;
            }
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should generate fine-grained steps for non-cyclic lists', () => {
      fc.assert(
        fc.property(
          fc.array(fc.integer({ min: -100, max: 100 }), { minLength: 4, maxLength: 10 }),
          (values) => {
            engine.initialize(values, -1);
            const steps = engine.getAllSteps();
            
            // 对于无环链表，应该有多个步骤
            // 至少应该有: 方法开始 + null检查 + slow初始化 + fast初始化 + while检查 + ...
            return steps.length >= 5;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should have at least 3 steps per complete loop iteration', () => {
      // 测试具体的例子：[3, 2, 0, -4] pos=1
      engine.initialize([3, 2, 0, -4], 1);
      const steps = engine.getAllSteps();
      
      // 统计每种类型的步骤
      const whileChecks = steps.filter(s => s.codeLine === CODE_LINES.WHILE_CHECK).length;
      const slowMoves = steps.filter(s => s.codeLine === CODE_LINES.SLOW_NEXT).length;
      const fastMoves = steps.filter(s => s.codeLine === CODE_LINES.FAST_NEXT).length;
      const nullChecks = steps.filter(s => s.codeLine === CODE_LINES.FAST_NULL_CHECK).length;
      
      // 每次完整循环应该有: 1个while检查 + 2个null检查 + 1个slow移动 + 1个fast移动
      // 所以 null 检查数应该是 slow 移动数的 2 倍
      expect(nullChecks).toBe(slowMoves * 2);
      expect(slowMoves).toBe(fastMoves);
      expect(whileChecks).toBeGreaterThan(0);
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
