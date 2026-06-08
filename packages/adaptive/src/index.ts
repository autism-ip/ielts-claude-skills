<<<<<<< HEAD
/**
 * [INPUT]: 依赖 @ielts/schemas 的类型定义
 * [OUTPUT]: 对外提供 planToday, planWeek, planComplete, planSkip 函数
 * [POS]: packages/adaptive 的主入口，聚合调度器/评分/干预库
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

export { planToday, planWeek } from './scheduler.js';
export { planComplete, planSkip } from './plan-store.js';
export { computePriority } from './scoring.js';
export { getInterventions } from './interventions.js';

export type { PriorityScore } from './scoring.js';
export type { Intervention } from './interventions.js';
=======
export { planToday, planWeek, planComplete, planSkip } from './scheduler.js';
export type { AdaptiveTask } from './scheduler.js';
>>>>>>> origin/feat/gh-46-adaptive-plan-schema
