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

运行 `pnpm --filter @ielcts/dashboard dev`。

Dashboard 页面：
- / 概览页：四科分数卡片、雷达图
- /writing 写作详情：趋势 + 错误分布
- /reading 阅读详情：题型表现矩阵
- /diagnosis 诊断：弱点分布

---

## 边界

- 不做诊断 → `/ielts-diagnose`
- 不批改作文 → `/ielts-writing`
- 不分析阅读 → `/ielts-reading`
- 不做词汇训练 → `/ielts-vocab`
