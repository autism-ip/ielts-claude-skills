# .github/workflows/
> L2 | 父级: ../CLAUDE.md

成员清单
ci.yml: GitHub Actions CI 门禁，在 pull_request、main push、workflow_dispatch 上运行 skill/docs gate，并在 v3 package 出现时执行 package scripts。

模块职责
workflows/ 只保存平台编排。具体判断放在 scripts/ci-gate.mjs，包管理器命令只在 package.json 出现后执行。

依赖边界
ci.yml 依赖 actions/checkout、actions/setup-node、Node.js 22，以及仓库内 scripts/ci-gate.mjs。

变更日志
- 2026-06-05: 创建 CI Gate workflow。

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
