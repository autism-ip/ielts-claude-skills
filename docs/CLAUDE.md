# docs/
> L2 | 父级: ../CLAUDE.md

成员清单
CI_CD_GATES.md: CI/CD 门禁说明，记录 GitHub/Linear issues 到验证规则的映射和本地执行方式。

模块职责
docs/ 承载项目语义相：为什么存在这些目录、哪些 issue 驱动哪些门禁、发布前必须证明什么。

依赖边界
docs/ 不参与运行时；scripts/ci-gate.mjs 会读取关键文档，防止门禁和说明分裂。

变更日志
- 2026-06-05: 创建 CI/CD 门禁文档。

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
