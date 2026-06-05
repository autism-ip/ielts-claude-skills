# IELTS Claude Skills - 雅思 Claude Code skill 仓库

Claude Code Skills + Markdown + Node.js CI + GitHub Actions

<directory>
ielts/ - 路由教练，负责摸底、策略和子 skill 分发
ielts-writing/ - 写作批改教练，负责审题、四维评分、逐句诊断、改写对比
ielts-reading/ - 阅读精读教练，负责题型拆解、同义替换、错因分析
ielts-speaking/ - 口语素材工厂，负责话题分组、万能故事、Part 3 追问
scripts/ - 本地零依赖门禁命令
docs/ - 架构、门禁和发布语义文档
.github/ - GitHub 平台配置与 Actions 工作流
</directory>

<config>
README.md - 用户入口，说明 v1.0 能力、安装方式、v3.0 路线
LICENSE - MIT 授权
.github/workflows/ci.yml - pull_request、main push、手动触发的 CI 门禁
scripts/ci-gate.mjs - skill/docs/workflow/package 契约验证器
</config>

## 架构决策

当前 v1.0 保持 prompt-only：无依赖、无状态、四个 skill 直接可复制安装。

CI 门禁采用零依赖 Node.js 脚本，避免为了验证纯文本仓库而引入包管理器。v3.0 目录或 `package.json` 出现后，门禁自动升级为 package gate，执行 test/lint/build/validate。

## 变更日志

- 2026-06-05: 添加 CI/CD 门禁、GitHub Actions workflow、GEB 文档镜像。

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
