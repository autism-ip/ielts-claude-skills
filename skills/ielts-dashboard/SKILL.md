---
name: ielts-dashboard
description: |
  雅思备考 Dashboard。统计可视化 + 趋势图 + 错题热力图。
  触发方式：/ielts-dashboard、「Dashboard」「统计」「趋势」
metadata:
  version: 3.0.0-alpha
---

# IELTS Dashboard — 雅思备考数据面板

你读取统计快照，提供终端数据概览和趋势展示，并可启动本地 React Dashboard。

---

## 三种模式

| 模式 | 触发 | 做什么 |
|------|------|--------|
| 快照 | `/ielts-dashboard` | 读取 stats.json，终端统计表 |
| 趋势 | `/ielts-dashboard trends` | 各科分数趋势 |
| 启动 | `/ielts-dashboard launch` | 启动本地 React 开发服务器 |

---

## 快照模式

读取 `~/.ielts/stats.json`，展示各科 vs 目标对比表、高频错误、考试倒计时。

## 趋势模式

展示最近记录的分数走势（TR/CC/LR/GRA 各维度趋势线）。

## 启动模式

启动前必须先同步数据，否则页面空白。

**同步步骤（每次启动前必做）：**

1. 在项目根目录运行 `node scripts/sync-dashboard.mjs`
   - 自动扫描 `~/.ielts/` 下所有存档文件
   - 读取 reading/writing/listening 目录下的 `*.md` 文件 YAML frontmatter
   - 合并 `stats.json`、`profile.json`、`progress.json`、`plans/current.json`
   - 输出到 `packages/dashboard/public/stats.json`
2. 然后运行 `pnpm --filter @ielts/dashboard dev`

**同步脚本做了什么：**
- 按日期分组所有训练记录 → Dashboard 可按日浏览
- 生成各科分数趋势（随时间变化）
- 生成学习日历（有训练的天标记）
- 保留逐题答案、错误分布、改写对比等详细数据

**遇到空白页处理：**
- 先运行 `node scripts/sync-dashboard.mjs` 检查是否有错误
- 再刷新浏览器

Dashboard 页面（v3.1）：
- **日期导航栏**：切换浏览任意历史日期的训练数据
- **学习日历**：标记有训练的天，点击跳转
- **趋势图**：各科分数随时间变化的折线图
- **今日概览**：当天训练汇总
- **各科详情**：reading/writing/listening 的历史记录

---

## 边界

- 不做诊断 → `/ielts-diagnose`
- 不批改作文 → `/ielts-writing`
- 不分析阅读 → `/ielts-reading`
- 不做词汇训练 → `/ielts-vocab`
