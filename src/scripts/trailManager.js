/**
 * TrailManager - 管理指针移动轨迹的记录和渲染
 */
export class TrailManager {
  constructor(config = {}) {
    this.slowTrail = [];
    this.fastTrail = [];
    this.slowVisitCount = new Map();
    this.fastVisitCount = new Map();
    
    this.config = {
      slowColor: config.slowColor || 'rgba(76, 175, 80, 0.3)',
      fastColor: config.fastColor || 'rgba(244, 67, 54, 0.3)',
      baseOpacity: config.baseOpacity || 0.3,
      intensityMultiplier: config.intensityMultiplier || 0.15
    };
  }

  /**
   * 记录慢指针访问节点
   * @param {number} nodeIndex - 节点索引
   */
  recordSlowVisit(nodeIndex) {
    this.slowTrail.push(nodeIndex);
    const count = this.slowVisitCount.get(nodeIndex) || 0;
    this.slowVisitCount.set(nodeIndex, count + 1);
  }

  /**
   * 记录快指针访问节点
   * @param {number} nodeIndex - 节点索引
   */
  recordFastVisit(nodeIndex) {
    this.fastTrail.push(nodeIndex);
    const count = this.fastVisitCount.get(nodeIndex) || 0;
    this.fastVisitCount.set(nodeIndex, count + 1);
  }

  /**
   * 获取节点的轨迹强度
   * @param {number} nodeIndex - 节点索引
   * @param {'slow' | 'fast'} pointer - 指针类型
   * @returns {number} 轨迹强度 (0-1)
   */
  getTrailIntensity(nodeIndex, pointer) {
    const visitCount = pointer === 'slow' 
      ? this.slowVisitCount.get(nodeIndex) || 0
      : this.fastVisitCount.get(nodeIndex) || 0;
    
    if (visitCount === 0) return 0;
    
    const intensity = this.config.baseOpacity + 
      (visitCount - 1) * this.config.intensityMultiplier;
    return Math.min(intensity, 1);
  }

  /**
   * 重置所有轨迹数据
   */
  reset() {
    this.slowTrail = [];
    this.fastTrail = [];
    this.slowVisitCount.clear();
    this.fastVisitCount.clear();
  }
}

export default TrailManager;
