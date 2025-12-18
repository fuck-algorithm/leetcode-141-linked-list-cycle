/**
 * 步骤管理器测试
 */
import { StepManager } from '../src/scripts/stepManager.js';
import fc from 'fast-check';

describe('StepManager', () => {
  let manager;

  beforeEach(() => {
    manager = new StepManager(10);
  });

  afterEach(() => {
    manager.destroy();
  });

  /**
   * **Feature: leetcode-141-visualizer, Property 3: Step Navigation Correctness**
   * **Validates: Requirements 3.1, 3.2, 3.5, 3.6**
   * 
   * For any current step index n:
   * - If n > 0, invoking prevStep() SHALL result in step index n-1
   * - If n < totalSteps-1, invoking nextStep() SHALL result in step index n+1
   * - If n == 0, the prev button SHALL be disabled
   * - If n == totalSteps-1, the next button SHALL be disabled
   */
  describe('Property 3: Step Navigation Correctness', () => {
    it('nextStep should increment step when not at end', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 5, max: 100 }),
          fc.integer({ min: 0, max: 98 }),
          (totalSteps, startStep) => {
            const adjustedStart = Math.min(startStep, totalSteps - 2);
            manager.setTotalSteps(totalSteps);
            manager.goToStep(adjustedStart);
            
            const before = manager.currentStep;
            const success = manager.nextStep();
            
            return success && manager.currentStep === before + 1;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('prevStep should decrement step when not at start', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 5, max: 100 }),
          fc.integer({ min: 1, max: 99 }),
          (totalSteps, startStep) => {
            const adjustedStart = Math.min(startStep, totalSteps - 1);
            manager.setTotalSteps(totalSteps);
            manager.goToStep(adjustedStart);
            
            const before = manager.currentStep;
            const success = manager.prevStep();
            
            return success && manager.currentStep === before - 1;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should disable prev at first step', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 100 }),
          (totalSteps) => {
            manager.setTotalSteps(totalSteps);
            manager.goToStep(0);
            
            return !manager.canGoPrev() && !manager.prevStep();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should disable next at last step', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 100 }),
          (totalSteps) => {
            manager.setTotalSteps(totalSteps);
            manager.goToStep(totalSteps - 1);
            
            return !manager.canGoNext() && !manager.nextStep();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('navigation should always stay within bounds', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 5, max: 50 }),
          fc.array(fc.oneof(fc.constant('next'), fc.constant('prev')), { minLength: 1, maxLength: 100 }),
          (totalSteps, actions) => {
            manager.setTotalSteps(totalSteps);
            manager.goToStep(Math.floor(totalSteps / 2));
            
            actions.forEach(action => {
              if (action === 'next') {
                manager.nextStep();
              } else {
                manager.prevStep();
              }
            });
            
            return manager.currentStep >= 0 && manager.currentStep < totalSteps;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * **Feature: leetcode-141-visualizer, Property 4: Play/Pause Toggle Idempotence**
   * **Validates: Requirements 3.3**
   * 
   * For any play state (playing or paused), invoking toggle() twice SHALL return to the original state.
   */
  describe('Property 4: Play/Pause Toggle Idempotence', () => {
    it('double toggle should return to original state', () => {
      fc.assert(
        fc.property(
          fc.boolean(),
          (initialPlaying) => {
            manager.setTotalSteps(10);
            
            if (initialPlaying) {
              manager.play();
            } else {
              manager.pause();
            }
            
            const originalState = manager.isPlaying;
            manager.toggle();
            manager.toggle();
            
            return manager.isPlaying === originalState;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('toggle should invert play state', () => {
      fc.assert(
        fc.property(
          fc.boolean(),
          (initialPlaying) => {
            manager.setTotalSteps(10);
            
            if (initialPlaying) {
              manager.play();
            } else {
              manager.pause();
            }
            
            const before = manager.isPlaying;
            manager.toggle();
            
            return manager.isPlaying !== before;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  // 单元测试
  describe('Unit Tests', () => {
    it('should initialize with correct defaults', () => {
      const m = new StepManager(5);
      expect(m.currentStep).toBe(0);
      expect(m.totalSteps).toBe(5);
      expect(m.isPlaying).toBe(false);
      m.destroy();
    });

    it('goToStep should work within bounds', () => {
      expect(manager.goToStep(5)).toBe(true);
      expect(manager.currentStep).toBe(5);
    });

    it('goToStep should fail outside bounds', () => {
      expect(manager.goToStep(-1)).toBe(false);
      expect(manager.goToStep(100)).toBe(false);
    });

    it('should call onStepChange callback', () => {
      const callback = jest.fn();
      manager.setOnStepChange(callback);
      manager.nextStep();
      expect(callback).toHaveBeenCalledWith(1);
    });

    it('should call onPlayStateChange callback', () => {
      const callback = jest.fn();
      manager.setOnPlayStateChange(callback);
      manager.play();
      expect(callback).toHaveBeenCalledWith(true);
      manager.pause();
      expect(callback).toHaveBeenCalledWith(false);
    });

    it('getState should return correct state', () => {
      manager.goToStep(5);
      const state = manager.getState();
      expect(state.currentStep).toBe(5);
      expect(state.totalSteps).toBe(10);
      expect(state.canGoPrev).toBe(true);
      expect(state.canGoNext).toBe(true);
    });

    it('reset should go back to step 0', () => {
      manager.goToStep(5);
      manager.play();
      manager.reset();
      expect(manager.currentStep).toBe(0);
      expect(manager.isPlaying).toBe(false);
    });
  });
});
