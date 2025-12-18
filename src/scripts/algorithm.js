/**
 * 算法引擎 - 生成环形链表检测算法的每一步状态
 */

// Java 代码模板（用于代码面板展示）
export const JAVA_CODE = `public class Solution {
    public boolean hasCycle(ListNode head) {
        if (head == null || head.next == null) {
            return false;
        }
        ListNode slow = head;
        ListNode fast = head.next;
        while (slow != fast) {
            if (fast == null || fast.next == null) {
                return false;
            }
            slow = slow.next;
            fast = fast.next.next;
        }
        return true;
    }
}`;

// 代码行号映射
export const CODE_LINES = {
  METHOD_START: 2,
  NULL_CHECK: 3,
  RETURN_FALSE_EMPTY: 4,
  INIT_SLOW: 6,
  INIT_FAST: 7,
  WHILE_CHECK: 8,
  FAST_NULL_CHECK: 9,
  RETURN_FALSE_NO_CYCLE: 10,
  SLOW_NEXT: 12,
  FAST_NEXT: 13,
  RETURN_TRUE: 15
};

/**
 * 算法引擎类
 */
export class AlgorithmEngine {
  constructor() {
    this.values = [];
    this.pos = -1;
    this.steps = [];
  }

  /**
   * 初始化链表数据
   * @param {number[]} values - 节点值数组
   * @param {number} pos - 环的位置，-1 表示无环
   */
  initialize(values, pos) {
    this.values = values;
    this.pos = pos;
    this.steps = [];
    this.generateAllSteps();
  }


  /**
   * 生成所有算法步骤
   */
  generateAllSteps() {
    this.steps = [];
    let stepNumber = 0;

    // 步骤1: 方法开始
    this.steps.push({
      stepNumber: stepNumber++,
      codeLine: CODE_LINES.METHOD_START,
      slowPos: -1,
      fastPos: -1,
      variables: [],
      description: '开始执行 hasCycle 方法',
      hasCycle: null
    });

    // 步骤2: 空链表检查
    if (this.values.length === 0) {
      this.steps.push({
        stepNumber: stepNumber++,
        codeLine: CODE_LINES.NULL_CHECK,
        slowPos: -1,
        fastPos: -1,
        variables: [{ name: 'head', value: 'null', line: 3 }],
        description: '检查 head 是否为 null',
        hasCycle: null
      });
      this.steps.push({
        stepNumber: stepNumber++,
        codeLine: CODE_LINES.RETURN_FALSE_EMPTY,
        slowPos: -1,
        fastPos: -1,
        variables: [],
        description: '链表为空，返回 false',
        hasCycle: false
      });
      return;
    }

    // 步骤3: 单节点检查
    if (this.values.length === 1 && this.pos === -1) {
      this.steps.push({
        stepNumber: stepNumber++,
        codeLine: CODE_LINES.NULL_CHECK,
        slowPos: 0,
        fastPos: -1,
        variables: [
          { name: 'head', value: `节点(${this.values[0]})`, line: 3 },
          { name: 'head.next', value: 'null', line: 3 }
        ],
        description: '检查 head.next 是否为 null',
        hasCycle: null
      });
      this.steps.push({
        stepNumber: stepNumber++,
        codeLine: CODE_LINES.RETURN_FALSE_EMPTY,
        slowPos: 0,
        fastPos: -1,
        variables: [],
        description: '只有一个节点且无环，返回 false',
        hasCycle: false
      });
      return;
    }

    // 步骤4: 初始化指针
    this.steps.push({
      stepNumber: stepNumber++,
      codeLine: CODE_LINES.NULL_CHECK,
      slowPos: 0,
      fastPos: -1,
      variables: [
        { name: 'head', value: `节点(${this.values[0]})`, line: 3 }
      ],
      description: '检查链表是否为空或只有一个节点',
      hasCycle: null
    });

    this.steps.push({
      stepNumber: stepNumber++,
      codeLine: CODE_LINES.INIT_SLOW,
      slowPos: 0,
      fastPos: -1,
      variables: [
        { name: 'slow', value: `节点(${this.values[0]}) [索引:0]`, line: 6 }
      ],
      description: '初始化慢指针 slow = head',
      hasCycle: null
    });

    this.steps.push({
      stepNumber: stepNumber++,
      codeLine: CODE_LINES.INIT_FAST,
      slowPos: 0,
      fastPos: 1,
      variables: [
        { name: 'slow', value: `节点(${this.values[0]}) [索引:0]`, line: 6 },
        { name: 'fast', value: `节点(${this.values[1]}) [索引:1]`, line: 7 }
      ],
      description: '初始化快指针 fast = head.next',
      hasCycle: null
    });

    // 模拟快慢指针移动
    let slow = 0;
    let fast = 1;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      // while 条件检查
      this.steps.push({
        stepNumber: stepNumber++,
        codeLine: CODE_LINES.WHILE_CHECK,
        slowPos: slow,
        fastPos: fast,
        variables: [
          { name: 'slow', value: `节点(${this.values[slow]}) [索引:${slow}]`, line: 6 },
          { name: 'fast', value: `节点(${this.values[fast]}) [索引:${fast}]`, line: 7 }
        ],
        description: `检查 slow != fast: ${slow} != ${fast}`,
        hasCycle: null
      });

      if (slow === fast) {
        // 找到环
        this.steps.push({
          stepNumber: stepNumber++,
          codeLine: CODE_LINES.RETURN_TRUE,
          slowPos: slow,
          fastPos: fast,
          variables: [],
          description: '快慢指针相遇，检测到环！返回 true',
          hasCycle: true
        });
        return;
      }

      // 检查 fast 是否到达末尾
      const fastNext = this.getNextIndex(fast);
      if (fastNext === -1) {
        this.steps.push({
          stepNumber: stepNumber++,
          codeLine: CODE_LINES.FAST_NULL_CHECK,
          slowPos: slow,
          fastPos: fast,
          variables: [
            { name: 'fast', value: `节点(${this.values[fast]})`, line: 9 },
            { name: 'fast.next', value: 'null', line: 9 }
          ],
          description: 'fast.next 为 null，无环',
          hasCycle: null
        });
        this.steps.push({
          stepNumber: stepNumber++,
          codeLine: CODE_LINES.RETURN_FALSE_NO_CYCLE,
          slowPos: slow,
          fastPos: fast,
          variables: [],
          description: '快指针到达末尾，返回 false',
          hasCycle: false
        });
        return;
      }

      const fastNextNext = this.getNextIndex(fastNext);
      if (fastNextNext === -1) {
        this.steps.push({
          stepNumber: stepNumber++,
          codeLine: CODE_LINES.FAST_NULL_CHECK,
          slowPos: slow,
          fastPos: fast,
          variables: [
            { name: 'fast.next', value: `节点(${this.values[fastNext]})`, line: 9 },
            { name: 'fast.next.next', value: 'null', line: 9 }
          ],
          description: 'fast.next.next 为 null，无环',
          hasCycle: null
        });
        this.steps.push({
          stepNumber: stepNumber++,
          codeLine: CODE_LINES.RETURN_FALSE_NO_CYCLE,
          slowPos: slow,
          fastPos: fast,
          variables: [],
          description: '快指针到达末尾，返回 false',
          hasCycle: false
        });
        return;
      }

      // 移动指针
      const newSlow = this.getNextIndex(slow);
      this.steps.push({
        stepNumber: stepNumber++,
        codeLine: CODE_LINES.SLOW_NEXT,
        slowPos: newSlow,
        fastPos: fast,
        variables: [
          { name: 'slow', value: `节点(${this.values[newSlow]}) [索引:${newSlow}]`, line: 12 }
        ],
        description: `慢指针移动: ${slow} -> ${newSlow}`,
        hasCycle: null
      });
      slow = newSlow;

      this.steps.push({
        stepNumber: stepNumber++,
        codeLine: CODE_LINES.FAST_NEXT,
        slowPos: slow,
        fastPos: fastNextNext,
        variables: [
          { name: 'fast', value: `节点(${this.values[fastNextNext]}) [索引:${fastNextNext}]`, line: 13 }
        ],
        description: `快指针移动: ${fast} -> ${fastNextNext}`,
        hasCycle: null
      });
      fast = fastNextNext;
    }
  }

  /**
   * 获取下一个节点的索引
   * @param {number} index - 当前索引
   * @returns {number} 下一个索引，-1 表示无下一个节点
   */
  getNextIndex(index) {
    if (index < 0 || index >= this.values.length) {
      return -1;
    }
    if (index === this.values.length - 1) {
      return this.pos >= 0 ? this.pos : -1;
    }
    return index + 1;
  }

  /**
   * 获取指定步骤
   * @param {number} index - 步骤索引
   * @returns {object} 步骤对象
   */
  getStep(index) {
    if (index < 0 || index >= this.steps.length) {
      return null;
    }
    return this.steps[index];
  }

  /**
   * 获取总步骤数
   * @returns {number} 总步骤数
   */
  getTotalSteps() {
    return this.steps.length;
  }

  /**
   * 获取所有步骤
   * @returns {object[]} 步骤数组
   */
  getAllSteps() {
    return this.steps;
  }
}

export default AlgorithmEngine;
