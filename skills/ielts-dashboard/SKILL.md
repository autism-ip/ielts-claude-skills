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

启动前必须先将 `~/.ielts/` 下的统计数据同步到 Dashboard 项目，否则页面空白。

**同步步骤（每次启动前必做）：**

1. 读取 `~/.ielts/stats.json`（主统计）
2. 读取 `~/.ielts/profile.json`（获取目标分、考试日期）
3. 读取最近一次的分析存档（reading/writing/listening 最新文件）
4. 将以上数据合并写入 `packages/dashboard/public/stats.json`
5. 格式必须与 App.tsx 的 Stats interface 一致（含 detail/answers 等扩展字段）
6. 然后运行 `pnpm --filter @ielts/dashboard dev`

**注意：stats.json 不只是 `~/.ielts/stats.json` 的镜像。**
- 必须包含每个 Section 的逐题答案表（answers: [{q, user, correct, result, type?, note?}]）
- 必须包含写作四维分数和逐句错误清单
- 必须包含阅读同义替换词表
- 必须包含听力错因分布
- 必须包含今日任务状态

**遇到空白页处理：**
- 先检查 `packages/dashboard/public/stats.json` 是否存在且非空 `{}`
- 空文件 = 未执行同步步骤，立即补充数据

Dashboard 页面：
- / 概览页：四科分数卡片、Subject Comparison 柱状图、Writing Radar 图、错误分布图、今日任务、考试时间线
- /reading 阅读详情：逐题答案表 + 同义替换词表
- /writing 写作详情：四维雷达图 + 逐句错误 + 改写对比 + 提分优先级
- /listening 听力详情：逐题答案表 + 错因饼图
- /diagnosis 诊断：弱点分布

---

## 边界

- 不做诊断 → `/ielts-diagnose`
- 不批改作文 → `/ielts-writing`
- 不分析阅读 → `/ielts-reading`
- 不做词汇训练 → `/ielts-vocab`
