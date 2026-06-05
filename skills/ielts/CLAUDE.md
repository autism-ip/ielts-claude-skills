# ielts/
> L2 | 父级: ../CLAUDE.md

成员清单
SKILL.md: 根路由教练，定义摸底问题、总分策略、子 skill 路由和边界。

模块职责
ielts/ 是用户入口，不承担写作批改、阅读分析或口语素材生成；它只做诊断、路由和训练优先级建议。

依赖边界
SKILL.md 必须引用所有子 skill slash command；新增 skill 时先更新这里，再更新 README 和 CI 门禁。

变更日志
- 2026-06-05: 创建 L2 模块地图，纳入 GEB 文档回环。

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
