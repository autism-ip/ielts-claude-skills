# CI/CD 门禁

> 来源：GitHub open issues #1-#15；Linear 项目 `IELTS Claude Skills v3.0`，issues ZEN-50 到 ZEN-64。

## 门禁目标

当前仓库是 v1.0：四个 prompt-only Claude Code skills，无依赖、无状态。v3.0 issues 要求它进化成 local-first 训练系统：monorepo、Zod schemas、CLI、archive、dashboard、plugin packaging、release verification。

门禁必须先保护现状，再等待未来结构出现时自动变硬。

## Issue 映射

| Issue | 风险 | 门禁 |
| --- | --- | --- |
| GitHub #15 / ZEN-64 | 测试和 release verification 缺席 | `.github/workflows/ci.yml` 必须调用 `node scripts/ci-gate.mjs`；v3 package 出现后必须有 `scripts.test` |
| GitHub #2 / ZEN-51 | monorepo 结构半迁移 | `packages/`、`pnpm-workspace.yaml`、`package.json` 任一出现后进入 v3 package gate |
| GitHub #3 / ZEN-52 | schema 契约无测试 | v3 workspace 必须暴露 test command，CI 执行 test |
| GitHub #4 / ZEN-53 | CLI 命令不可验证 | CI 预留 `validate` script；存在时自动执行 |
| GitHub #5-#8 / ZEN-54-ZEN-57 | 写作、阅读、听力、词汇记录结构漂移 | skill frontmatter、router 引用、README 引用必须一致；v3 schema 测试由 package gate 承接 |
| GitHub #9-#10 / ZEN-58-ZEN-59 | stats/dashboard 快照无构建保护 | v3 package 出现后 CI 自动执行 build |
| GitHub #12 / ZEN-61 | plugin packaging 不完整 | `.claude-plugin/plugin.json` 出现后必须有 name/version |

## 当前硬门禁

1. 所有 `SKILL.md` 必须有 YAML frontmatter：`name`、`description`、`metadata.version`。
2. skill 文件夹名必须等于 frontmatter `name`，避免安装路径和命令名分裂。
3. 根路由 skill `ielts` 必须引用所有子 skill 命令。
4. `README.md` 必须引用每个 skill 名和 slash command。
5. `.github/workflows/ci.yml` 必须覆盖 `pull_request`、`main` push、手动触发。
6. GEB 文档镜像必须存在：L1 `CLAUDE.md`、每个模块 L2 `CLAUDE.md`、代码/CI 文件 L3 头部。
7. 禁止提交 `node_modules`、`.DS_Store`、`__pycache__` 等生成物。
8. 默认文件不超过 800 行；每层文件数不超过 8 个。

## v3 自动加硬

当 `package.json`、`packages/`、`pnpm-workspace.yaml` 或 `.claude-plugin/` 出现时：

1. 必须存在 `package.json`。
2. 必须暴露 `scripts.test`。
3. 使用 `pnpm-workspace.yaml` 时，`packageManager` 必须声明 `pnpm@...`。
4. CI 安装依赖后执行 `test`，并在脚本存在时执行 `lint`、`build`、`validate`。
5. `.claude-plugin/plugin.json` 出现后必须声明 `name` 和 `version`。

## 本地执行

```bash
node scripts/ci-gate.mjs
```

这条命令是发布前最小门禁。它不下载依赖，不触碰用户目录，只读取仓库。
