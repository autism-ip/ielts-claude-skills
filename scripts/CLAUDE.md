# scripts/
> L2 | 父级: ../CLAUDE.md

成员清单
ci-gate.mjs: 零依赖 CI 门禁执行器，扫描 SKILL.md frontmatter、README/路由引用、GEB 文档、workflow、未来 v3 package 契约。

模块职责
scripts/ 只放可本地运行的工程命令。命令必须默认只读仓库，除非文件名和文档明确说明会写入。

依赖边界
ci-gate.mjs 只依赖 Node.js 标准库，不依赖 npm 包；GitHub Actions 和本地开发共用同一入口。

变更日志
- 2026-06-05: 创建 ci-gate.mjs，作为 CI 与本地发布前门禁。

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
