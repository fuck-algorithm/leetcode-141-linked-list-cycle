/**
 * CycleAnalyzer - 分析链表环形结构的属性
 */
export class CycleAnalyzer {
  /**
   * 分析链表的环形结构
   * @param {number[]} values - 链表节点值数组
   * @param {number} cyclePos - 环入口位置 (-1 表示无环)
   * @returns {CycleInfo} 环形结构信息
   */
  analyze(values, cyclePos) {
    const totalNodes = values.length;
    const hasCycle = cyclePos >= 0 && cyclePos < totalNodes;

    if (!hasCycle) {
      return {
        hasCycle: false,
        cycleLength: 0,
        tailLength: totalNodes,
        cycleNodes: [],
        tailNodes: Array.from({ length: totalNodes }, (_, i) => i)
      };
    }

    const cycleLength = totalNodes - cyclePos;
    const tailLength = cyclePos;
    const cycleNodes = Array.from({ length: cycleLength }, (_, i) => cyclePos + i);
    const tailNodes = Array.from({ length: tailLength }, (_, i) => i);

    return {
      hasCycle,
      cycleLength,
      tailLength,
      cycleNodes,
      tailNodes
    };
  }
}

export default CycleAnalyzer;
