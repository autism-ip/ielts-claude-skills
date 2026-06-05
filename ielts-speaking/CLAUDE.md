# ielts-speaking/
> L2 | 父级: ../CLAUDE.md

成员清单
SKILL.md: 口语素材工厂，覆盖话题分组、万能故事、Part 2 回答、Part 3 追问预测。

模块职责
ielts-speaking/ 只生成可练素材，不做实时口语对话训练；训练执行交给 Gemini Live 或 ChatGPT Voice。

依赖边界
被 ielts/SKILL.md 路由引用；新增故事库、覆盖率或表达库持久化时必须接入 v3 package gate。

变更日志
- 2026-06-05: 创建 L2 模块地图，纳入 GEB 文档回环。

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
