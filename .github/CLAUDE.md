# .github/
> L2 | 父级: ../CLAUDE.md

成员清单
workflows/: GitHub Actions 工作流目录，当前只承载 CI 门禁。

模块职责
.github/ 只描述 GitHub 平台行为。仓库验证逻辑必须下沉到 scripts/，避免 CI 和本地检查出现两套规则。

依赖边界
.github/workflows/ci.yml 调用 scripts/ci-gate.mjs；workflow 不直接理解 skill 结构。

变更日志
- 2026-06-05: 新增 CI workflow 平台入口。

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
