/**
 * VisitCounter - 统计每个节点被各指针访问的次数
 */
export class VisitCounter {
  constructor() {
    this.slowVisits = new Map();
    this.fastVisits = new Map();
  }

  /**
   * 增加慢指针对节点的访问次数
   * @param {number} nodeIndex - 节点索引
   */
  incrementSlowVisit(nodeIndex) {
    const count = this.slowVisits.get(nodeIndex) || 0;
    this.slowVisits.set(nodeIndex, count + 1);
  }

  /**
   * 增加快指针对节点的访问次数
   * @param {number} nodeIndex - 节点索引
   */
  incrementFastVisit(nodeIndex) {
    const count = this.fastVisits.get(nodeIndex) || 0;
    this.fastVisits.set(nodeIndex, count + 1);
  }

  /**
   * 获取慢指针对节点的访问次数
   * @param {number} nodeIndex - 节点索引
   * @returns {number} 访问次数
   */
  getSlowVisitCount(nodeIndex) {
    return this.slowVisits.get(nodeIndex) || 0;
  }

  /**
   * 获取快指针对节点的访问次数
   * @param {number} nodeIndex - 节点索引
   * @returns {number} 访问次数
   */
  getFastVisitCount(nodeIndex) {
    return this.fastVisits.get(nodeIndex) || 0;
  }

  /**
   * 检查节点是否被重复访问（任一指针访问超过1次）
   * @param {number} nodeIndex - 节点索引
   * @returns {boolean} 是否被重复访问
   */
  isRevisited(nodeIndex) {
    return this.getSlowVisitCount(nodeIndex) > 1 || 
           this.getFastVisitCount(nodeIndex) > 1;
  }

  /**
   * 重置所有访问计数
   */
  reset() {
    this.slowVisits.clear();
    this.fastVisits.clear();
  }
}

export default VisitCounter;
