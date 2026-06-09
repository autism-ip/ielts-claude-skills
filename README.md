# IELTS Claude Skills · v3.2

> 一套跑在 Claude Code 上的雅思备考 AI 教练 skill。
> **本地持久化数据 + 8 skill 协同 + 自适应计划 + Feishu 云同步 + React Dashboard。**

---

## 这是什么

8 个 [Claude Code Skill](https://docs.claude.com/en/docs/claude-code/skills)，构成一个完整的雅思备考系统：

| Skill | 干啥 | 触发词 |
|-------|------|--------|
| `/ielts` | 路由入口 + 摸底 + 每日计划 | 「我要备考雅思」「IELTS」 |
| `/ielts-writing` | 写作四维批改 + 改写对比 + 审题 + 分数校准 | 「批改作文」「帮我看看这篇」 |
| `/ielts-reading` | 同义替换提取 + T/F/NG 拆解 + 错题诊断 | 「分析阅读」「这道为什么错」 |
| `/ielts-speaking` | 话题分组 + 万能故事 + Part 3 预测 | 「口语素材」「Part 2 准备」 |
| `/ielts-listening` | Section 级分析 + 精听训练 + 场景词汇 | 「听力」「精听」 |
| `/ielts-vocab` | SRS 间隔重复 + 同义替换 + Anki 导出 | 「背单词」「复习词汇」 |
| `/ielts-diagnose` | 全科诊断 + 弱点分析 + 训练计划 | 「诊断」「学习计划」 |
| `/ielts-dashboard` | 统计数据概览 + 趋势展示 | 「Dashboard」「统计」 |

**特点：**
- 自适应学习计划 — 基于评分引擎自动生成每日/每周训练计划
- 错误模式识别 — 从简单标签统计升级到跨模块模式识别
- Feishu 云同步 — 本地记录 ↔ 飞书多维表格双向同步
- 写作评分校准 — 追踪 AI 评分与真实分数的偏差
- 周报生成 — 训练量/分数趋势/错误模式/下周建议
- 数据持久化 — 所有记录自动存档到 `~/.ielts/`，跨会话可用
- CLI 工具 — 20+ 个命令覆盖全部操作
- Zod 校验 — 所有数据格式有运行时校验
- 中文交互 + 英文术语
- MIT License，开源免费

---

## 安装

### 前提
- 安装 [Claude Code](https://docs.claude.com/en/docs/claude-code)
- 安装 [Node.js](https://nodejs.org/) >= 18
- 安装 [pnpm](https://pnpm.io/)（`npm install -g pnpm`）

### 一键安装

```bash
bash <(curl -s https://raw.githubusercontent.com/autism-ip/ielts-claude-skills/main/install.sh)
```

### 手动安装

```bash
git clone https://github.com/autism-ip/ielts-claude-skills.git
cd ielts-claude-skills
cp -r skills/* ~/.claude/skills/
pnpm install && pnpm build
ielts init --fixtures
ielts doctor
```

---

## CLI 命令

| 命令 | 说明 |
|------|------|
| `ielts init` | 初始化 `~/.ielts/` |
| `ielts init --fixtures` | 安装测试夹具 |
| `ielts profile` | 查看档案 |
| `ielts ls` | 列出记录 |
| `ielts snapshot` | 生成统计快照 |
| `ielts doctor` | 诊断安装 |
| `ielts plan today\|week` | 生成计划 |
| `ielts plan complete\|skip` | 管理任务 |
| `ielts report weekly` | 生成周报 |
| `ielts cloud setup\|test\|sync\|status` | 云同步 |
| `ielts cloud init-feishu\|doctor\|pull` | 云管理 |
| `ielts backup\|restore` | 备份/恢复 |

---

## 架构

```
packages/
├── schemas/     — Zod 数据模型
├── cli/         — CLI 入口
├── adaptive/    — 自适应计划引擎
├── cloud/       — 飞书云同步
└── dashboard/   — React 可视化
```

## License

[MIT](./LICENSE)
