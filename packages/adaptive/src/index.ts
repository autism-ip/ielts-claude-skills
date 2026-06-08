<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
/**
 * [INPUT]: 依赖 @ielts/schemas 的类型定义
 * [OUTPUT]: 对外提供计划/评分/干预 API
 * [POS]: packages/adaptive 的主入口
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

export { planToday, planWeek } from './scheduler.js';
export { planComplete, planSkip } from './plan-store.js';
export { computePriority, getAllScores } from './scoring.js';
export { getInterventions } from './interventions.js';

export type { PriorityFactor, PriorityScore } from './scoring.js';
export type { Intervention } from './interventions.js';
=======
export { planToday, planWeek, planComplete, planSkip } from './scheduler.js';
export type { AdaptiveTask } from './scheduler.js';
>>>>>>> origin/feat/gh-46-adaptive-plan-schema
=======
export { getInterventions, getAllModules } from './interventions.js';
export type { Intervention } from './interventions.js';
>>>>>>> origin/feat/gh-48-intervention-library
=======
export { computePriority, getAllScores } from './scoring.js';
export type { PriorityFactor, PriorityScore } from './scoring.js';
export { getInterventions, getAllModules } from './interventions.js';
export type { Intervention } from './interventions.js';
export { planToday, planWeek, planComplete, planSkip } from './scheduler.js';
export type { AdaptiveTask } from './scheduler.js';
>>>>>>> origin/feat/gh-49-plan-cli
=======
export { planToday, planWeek, planComplete, planSkip } from './scheduler.js';
export type { AdaptiveTask } from './scheduler.js';
>>>>>>> origin/feat/gh-50-plan-complete-skip
=======
export { planToday, planWeek, planComplete, planSkip } from './scheduler.js';
export type { AdaptiveTask } from './scheduler.js';
>>>>>>> origin/feat/gh-51-dashboard-plan
=======
export { planToday, planWeek, planComplete, planSkip } from './scheduler.js';
export type { AdaptiveTask } from './scheduler.js';
>>>>>>> origin/feat/gh-53-feishu-auth
=======
export { planToday, planWeek, planComplete, planSkip } from './scheduler.js';
export type { AdaptiveTask } from './scheduler.js';
>>>>>>> origin/feat/gh-54-feishu-client
=======
export { planToday, planWeek, planComplete, planSkip } from './scheduler.js';
export type { AdaptiveTask } from './scheduler.js';
>>>>>>> origin/feat/gh-55-feishu-mappers
