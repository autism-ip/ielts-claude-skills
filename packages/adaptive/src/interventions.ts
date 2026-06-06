/**
 * [INPUT]: 依赖 @ielts/schemas 的类型定义
 * [OUTPUT]: 对外提供 Intervention 类型、getInterventions 函数
 * [POS]: packages/adaptive 的干预库，错误标签 → 训练任务映射
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

export interface Intervention {
  module: string;
  errorTag: string;
  duration: number;
  instructions: string;
  successCriteria: string;
}

const INTERVENTIONS: Intervention[] = [];

export function getInterventions(errorTag?: string): Intervention[] {
  if (errorTag) return INTERVENTIONS.filter(i => i.errorTag === errorTag);
  return [...INTERVENTIONS];
}
