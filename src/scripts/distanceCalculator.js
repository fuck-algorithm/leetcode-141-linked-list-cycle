/**
 * DistanceCalculator - 计算快慢指针之间的距离
 */
export class DistanceCalculator {
  /**
   * 计算线性距离（不考虑环）
   * @param {number} slowPos - 慢指针位置
   * @param {number} fastPos - 快指针位置
   * @returns {number} 节点距离
   */
  calculateLinearDistance(slowPos, fastPos) {
    if (slowPos < 0 || fastPos < 0) return -1;
    return Math.abs(fastPos - slowPos);
  }

  /**
   * 计算环感知距离
   * @param {number} slowPos - 慢指针位置
   * @param {number} fastPos - 快指针位置
   * @param {number} cyclePos - 环入口位置 (-1 表示无环)
   * @param {number} totalNodes - 总节点数
   * @returns {CycleDistance} 距离信息
   */
  calculateCycleAwareDistance(slowPos, fastPos, cyclePos, totalNodes) {
    const linearDistance = this.calculateLinearDistance(slowPos, fastPos);
    
    if (cyclePos < 0 || slowPos < cyclePos || fastPos < cyclePos) {
      return {
        forwardDistance: linearDistance,
        cycleDistance: 0,
        isInCycle: false
      };
    }

    const cycleLength = totalNodes - cyclePos;
    const slowInCycle = slowPos - cyclePos;
    const fastInCycle = fastPos - cyclePos;
    
    let forwardDistance = (fastInCycle - slowInCycle + cycleLength) % cycleLength;
    let backwardDistance = (slowInCycle - fastInCycle + cycleLength) % cycleLength;

    return {
      forwardDistance: forwardDistance,
      cycleDistance: Math.min(forwardDistance, backwardDistance),
      isInCycle: true
    };
  }
}

export default DistanceCalculator;
