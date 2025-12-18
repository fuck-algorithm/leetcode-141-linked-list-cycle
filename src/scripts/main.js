/**
 * 主入口文件 - 整合所有组件
 */

import { AlgorithmEngine } from './algorithm.js';
import { StepManager } from './stepManager.js';
import { CodePanel } from './codePanel.js';
import { Visualizer } from './visualizer.js';
import { ControlPanel } from './controlPanel.js';
import { FloatingBall } from './floatingBall.js';
import { InsightPanel } from './insightPanel.js';
import { StatusPanel } from './statusPanel.js';
import { DataInputPanel } from './dataInputPanel.js';

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
    
    // 增强组件
    this.insightPanel = null;
    this.statusPanel = null;
    this.dataInputPanel = null;
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
    
    // 初始化增强面板
    this.initializeEnhancedPanels();
    
    // 初始化数据输入面板
    this.initializeDataInputPanel();
    
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
      onReset: () => this.reset(),
      onPrevStep: () => this.stepManager.prevStep(),
      onNextStep: () => this.stepManager.nextStep(),
      onPlayPause: () => this.stepManager.toggle(),
      onSeek: (step) => this.stepManager.goToStep(step)
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
      this.updateEnhancedPanels(step);
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
    
    // 更新进度条
    this.controlPanel.updateProgress(
      this.stepManager.currentStep,
      this.algorithmEngine.getTotalSteps()
    );
  }

  /**
   * 初始化数据输入面板
   */
  initializeDataInputPanel() {
    this.dataInputPanel = new DataInputPanel('data-input-container', (values, pos) => {
      this.setExample(values, pos);
    });
    this.dataInputPanel.initialize();
  }

  /**
   * 初始化增强面板
   */
  initializeEnhancedPanels() {
    const visualizerContainer = document.querySelector('.visualizer-container');
    if (!visualizerContainer) return;
    
    // 创建状态面板容器
    const statusContainer = document.createElement('div');
    statusContainer.id = 'status-panel-container';
    visualizerContainer.appendChild(statusContainer);
    this.statusPanel = new StatusPanel(statusContainer);
    
    // 创建原理提示面板容器
    const insightContainer = document.createElement('div');
    insightContainer.id = 'insight-panel-container';
    visualizerContainer.appendChild(insightContainer);
    this.insightPanel = new InsightPanel(insightContainer);
    
    // 暴露到全局以支持折叠功能
    window.insightPanel = this.insightPanel;
  }

  /**
   * 更新增强面板
   * @param {object} step - 当前步骤
   */
  updateEnhancedPanels(step) {
    if (!step) return;
    
    // 更新状态面板
    if (this.statusPanel) {
      this.statusPanel.update({
        slowPos: step.slowPos,
        fastPos: step.fastPos,
        iterationCount: Math.floor(step.stepNumber / 3),
        slowMoves: this.visualizer.slowMoves,
        fastMoves: this.visualizer.fastMoves,
        loopCondition: {
          expression: 'slow !== fast',
          result: step.slowPos !== step.fastPos
        }
      }, this.linkedListData.values);
    }
    
    // 更新原理提示面板
    if (this.insightPanel) {
      let phase = 'moving';
      if (step.stepNumber <= 1) {
        phase = 'initialization';
      } else if (step.hasCycle === true) {
        phase = 'meeting';
      } else if (step.hasCycle === false) {
        phase = 'no-cycle';
      }
      this.insightPanel.updatePhase(phase);
    }
  }

  /**
   * 重置到初始状态
   */
  reset() {
    // 停止播放
    if (this.stepManager.isPlaying) {
      this.stepManager.stop();
    }
    
    // 重置步骤管理器
    this.stepManager.reset();
    
    // 重新初始化可视化组件
    this.visualizer.initialize(
      this.linkedListData.values,
      this.linkedListData.pos
    );
    
    // 更新 UI
    this.updateUI();
    
    console.log('已重置到初始状态');
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
