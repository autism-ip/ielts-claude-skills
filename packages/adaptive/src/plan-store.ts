/**
 * [INPUT]: 依赖 node:fs 读写 ~/.ielts/plans/ 目录
 * [OUTPUT]: 对外提供 planComplete, planSkip 函数
 * [POS]: packages/adaptive 的计划存储，管理计划文件的持久化
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

export function planComplete(taskId: string): void {}

export function planSkip(taskId: string): void {}
