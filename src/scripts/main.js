/**
 * 主入口文件 - 整合所有组件
 */

import { AlgorithmEngine } from './algorithm.js';
import { StepManager } from './stepManager.js';
import { CodePanel } from './codePanel.js';
import { Visualizer } from './visualizer.js';
import { ControlPanel } from './controlPanel.js';
import { FloatingBall } from './floatingBall.js';

class App {
  constructor() {
    // 示例数据：[3, 2, 0, -4]，环在位置 1
    this.linkedListData = {
      values: [3, 2, 0, -4],
      pos: 1
    };
    
    // 初始化组件
    this.algorithmEngine = new AlgorithmEngine();
    this.stepManager = new StepManager();
    this.codePanel = new CodePanel('code-display');
    this.visualizer = new Visualizer('visualizer-svg', 'step-info', 'phase-description');
    this.controlPanel = new ControlPanel();
    this.floatingBall = new FloatingBall();
  }

  /**
   * 初始化应用
   */
  initialize() {
    // 初始化算法引擎
    this.algorithmEngine.initialize(
      this.linkedListData.values,
      this.linkedListData.pos
    );
    
    // 初始化步骤管理器
    this.stepManager.setTotalSteps(this.algorithmEngine.getTotalSteps());
    
    // 初始化 UI 组件
    this.codePanel.initialize();
    this.visualizer.initialize(
      this.linkedListData.values,
      this.linkedListData.pos
    );
    this.controlPanel.initialize();
    this.floatingBall.initialize();
    
    // 设置回调
    this.setupCallbacks();
    
    // 显示初始状态
    this.updateUI();
    
    console.log('LeetCode 141 环形链表可视化已初始化');
  }

  /**
   * 设置回调函数
   */
  setupCallbacks() {
    // 步骤管理器回调
    this.stepManager.setOnStepChange(() => {
      this.updateUI();
    });
    
    this.stepManager.setOnPlayStateChange(() => {
      this.updateControlPanel();
    });
    
    // 控制面板回调
    this.controlPanel.setCallbacks({
      onPrevStep: () => this.stepManager.prevStep(),
      onNextStep: () => this.stepManager.nextStep(),
      onPlayPause: () => this.stepManager.toggle()
    });
  }

  /**
   * 更新 UI
   */
  updateUI() {
    const currentStep = this.stepManager.currentStep;
    const step = this.algorithmEngine.getStep(currentStep);
    const totalSteps = this.algorithmEngine.getTotalSteps();
    
    if (step) {
      this.codePanel.update(step);
      this.visualizer.update(step, totalSteps);
    }
    
    this.updateControlPanel();
  }

  /**
   * 更新控制面板状态
   */
  updateControlPanel() {
    this.controlPanel.updateState({
      canGoPrev: this.stepManager.canGoPrev(),
      canGoNext: this.stepManager.canGoNext(),
      isPlaying: this.stepManager.isPlaying
    });
  }

  /**
   * 切换示例数据
   * @param {number[]} values - 节点值数组
   * @param {number} pos - 环的位置
   */
  setExample(values, pos) {
    this.linkedListData = { values, pos };
    
    // 重新初始化
    this.algorithmEngine.initialize(values, pos);
    this.stepManager.setTotalSteps(this.algorithmEngine.getTotalSteps());
    this.stepManager.reset();
    this.visualizer.initialize(values, pos);
    
    this.updateUI();
  }
}

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.initialize();
  
  // 暴露到全局，方便调试
  window.app = app;
});
