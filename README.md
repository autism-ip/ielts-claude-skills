# IELTS Claude Skills · v3.0

> 一套跑在 Claude Code 上的雅思备考 AI 教练 skill。
> **本地持久化数据 + 8 skill 协同 + 可选的 React Dashboard。**

---

## 这是什么

8 个 [Claude Code Skill](https://docs.claude.com/en/docs/claude-code/skills)，构成一个完整的雅思备考系统：

| Skill | 干啥 | 触发词 |
|-------|------|--------|
| `/ielts` | 路由入口 + 摸底 + 每日计划 | 「我要备考雅思」「IELTS」 |
| `/ielts-writing` | 写作四维批改 + 改写对比 + 审题 | 「批改作文」「帮我看看这篇」 |
| `/ielts-reading` | 同义替换提取 + T/F/NG 拆解 + 错题诊断 | 「分析阅读」「这道为什么错」 |
| `/ielts-speaking` | 话题分组 + 万能故事 + Part 3 预测 | 「口语素材」「Part 2 准备」 |
| `/ielts-listening` | Section 级分析 + 精听训练 + 场景词汇 | 「听力」「精听」 |
| `/ielts-vocab` | SRS 间隔重复 + 同义替换 + Anki 导出 | 「背单词」「复习词汇」 |
| `/ielts-diagnose` | 全科诊断 + 弱点分析 + 训练计划 | 「诊断」「学习计划」 |
| `/ielts-dashboard` | 统计数据概览 + 趋势展示 | 「Dashboard」「统计」 |

**特点：**
- **数据持久化** — 所有记录自动存档到 `~/.ielts/`，跨会话可用
- **CLI 工具** — `ielts init/profile/ls/snapshot/backup/restore`
- **可选的 React Dashboard** — `cd packages/dashboard && pnpm dev`
- **Zod 校验** — 所有数据格式有运行时校验
- 中文交互 + 英文术语
- MIT License，开源免费

---

## 适合谁

- 备考雅思、想用 AI 当陪练的考生
- 已经在用 Claude Code 的开发者
- 想看看雅思 skill 怎么写的人（拿去改成自己的版本）

**想要进度追踪、错题本、可视化 Dashboard？** 看下面 [v3.0 功能表](#功能一览)。

---

## 安装

### 前提
- 安装 [Claude Code](https://docs.claude.com/en/docs/claude-code)
- 安装 [Node.js](https://nodejs.org/) >= 18（CLI 和 Dashboard 需要）

### 方法一：一键安装（推荐）

```bash
bash <(curl -s https://raw.githubusercontent.com/autism-ip/ielts-claude-skills/main/install.sh)
```

### 方法二：直接复制

```bash
# Mac / Linux
cp -r skills/* ~/.claude/skills/
```

```powershell
# Windows PowerShell
Copy-Item -Recurse skills\* $env:USERPROFILE\.claude\skills\
```

### 方法三：克隆

```bash
git clone https://github.com/autism-ip/ielts-claude-skills.git
cd ielts-claude-skills
cp -r skills/* ~/.claude/skills/
pnpm install     # 安装 CLI + Dashboard 依赖
```

装完之后重启 Claude Code，输入 `/ielts` 就能用。

### CLI 安装（可选）

```bash
cd packages/cli && pnpm build && pnpm link --global
ielts init       # 初始化 ~/.ielts/
ielts profile    # 查看档案
```

---

## 怎么用

### 场景 1：全科诊断 + 计划生成

```
你：/ielts-diagnose
AI：（读取所有训练记录 → 生成综合报告）
   → 写作 6.1、阅读 6.5、听力 7.0 ...
   → 优先级：阅读 T/F/NG（差距最大）
   → 8 周训练计划
```

### 场景 2：直接批改作文

```
你：/ielts-writing
   [粘贴题目 + 你的作文]
AI：
- 四维评分（TR / CC / LR / GRA）
- 句子级标注每个问题
- 改写成目标分数版本
- 自动存档到 ~/.ielts/writing/
```

### 场景 3：分析阅读错题

```
你：/ielts-reading
   [粘贴文章 + 题目 + 你的答案 + 标准答案]
AI：
- 逐题拆解错因
- 提取同义替换词表 → 追加到累积库
- T/F/NG 逻辑分析
```

### 场景 4：听力诊断

```
你：/ielts-listening
   [Section 编号 + 你的答案 + 正确答案]
AI：
- 错因分类（spelling/number/distraction/speed/inference）
- 跨篇错因统计
- 精听训练建议
```

### 场景 5：词汇 SRS 复习

```
你：/ielts-vocab review
AI：
- SRS 算法计算今日复习词
- 逐个出题 + 正确率反馈
- 自动更新复习日志
```

### 场景 6：Dashboard 数据可视化

```
你：/ielts-dashboard
AI：展示终端统计表
你：/ielts-dashboard launch
→ 浏览器打开 localhost:5173
   趋势图 / 雷达图 / 错题分布热力图
```

### 场景 7：口语素材准备

```
你：/ielts-speaking
   "帮我准备 Part 2 描述一次旅行"
AI：
- 从故事库加载匹配故事
- 200-250 词 Part 2 回答
- 4-6 个 Part 3 追问预测
- 关键表达标注
```

---

## 文件结构

```
ielts-claude-skills/
├── skills/                     # Claude Code Skills (8 个)
│   ├── ielts/SKILL.md          # 路由教练
│   ├── ielts-writing/SKILL.md  # 写作批改
│   ├── ielts-reading/SKILL.md  # 阅读分析
│   ├── ielts-speaking/SKILL.md # 口语素材
│   ├── ielts-listening/SKILL.md# 听力诊断
│   ├── ielts-vocab/SKILL.md    # 词汇训练
│   ├── ielts-diagnose/SKILL.md # 全科诊断
│   └── ielts-dashboard/SKILL.md# Dashboard 控制
├── packages/                   # TypeScript 包
│   ├── schemas/                # Zod 数据模型 + 单元测试
│   ├── cli/                    # CLI 工具 (init/profile/ls/snapshot)
│   └── dashboard/              # Vite + React Dashboard
├── docs/                       # 架构文档
├── install.sh                  # 一键安装脚本
├── pnpm-workspace.yaml
└── tsconfig.base.json
```

每个 skill 就是一个文件夹 + 一个 `SKILL.md`。Claude Code 通过 `name` 字段识别和触发。

---

## 怎么改

想改成自己的版本：

1. Fork 一份
2. 改对应的 `SKILL.md`——人格、评分标准、模板都在里面
3. 重新复制到 `~/.claude/skills/` 或运行 `./install.sh`
4. 重启 Claude Code

**常见改法：**
- 改 SOUL 段落 → 换教练人格
- 改评分标准表 → 适配托福/GRE
- 改模式表 → 加新的工作流
- 改边界段 → 调整 skill 之间的分工

---

## 功能一览

| 功能 | v3.0 |
|------|------|
| Skill 数量 | **8 个**（写作/阅读/口语/听力/词汇/诊断/Dashboard/路由） |
| 数据持久化 | ✅ `~/.ielts/` 跨会话记忆 |
| 批改历史 | ✅ 每篇作文自动归档，带评分 |
| 进度追踪 | ✅ 自动统计四科趋势 |
| 可视化 Dashboard | ✅ 本地 React 网页：趋势图 / 雷达图 / 错题热力图 |
| 错题本 | ✅ 自动聚合高频错误标签 |
| 同义替换库 | ✅ 跨篇累计，可搜索 |
| 备考计划 | ✅ 数据驱动诊断 + 个人化训练计划 |
| 听力错题分析 | ✅ `/ielts-listening` 题型追踪 + 精听任务 |
| 词汇训练 | ✅ `/ielts-vocab` 间隔重复 + Anki 导出 |
| 数据格式校验 | ✅ Zod schema 运行时校验 |
| CLI 工具 | ✅ init / profile / ls / snapshot / backup / restore |
| 安装脚本 | ✅ `install.sh` 一键安装 |
| 备份/迁移 | ✅ 一键 backup / restore |
| License | ✅ MIT 开源免费 |

### 数据流向

```
你（Claude Code 里）
  ↓ 输入 /ielts-/xxx
8 个 Skill 协同工作
  ↓ 写入 ~/.ielts/（你电脑本地，没有云端）
ielts snapshot → stats.json
  ↓ 可选
本地 React Dashboard（localhost:5173）
  ↓ 浏览器打开看
趋势图 / 雷达图 / 错题分布热力图
```

---

## License

[MIT](./LICENSE)

随便用、随便改、随便商用。注明出处不强制但欢迎。

---

## 反馈

发 [issue](https://github.com/autism-ip/ielts-claude-skills/issues) 或者 PR。
