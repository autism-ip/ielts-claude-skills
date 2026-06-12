# packages/dashboard/
> L2 | 父级: /CLAUDE.md

雅思备考 Dashboard。Vite + React 18 + TypeScript + Recharts 单页应用。

## 成员清单

**src/**

- `App.tsx`: SPA 入口与核心渲染器。含 date nav、scoreboard（Recharts 图表面板）、reading/writing/listening/vocab 四个详情页、Synonyms Bank 积累库。内部函数：renderOverview/renderReading/renderWriting/renderListening/renderVocab，TabPane 过渡容器，Nav 侧栏导航。
- `main.tsx`: ReactDOM.createRoot 挂载点，引入 App 组件。
- `vite-env.d.ts`: Vite 类型声明。

**public/**

- `stats.json`: 由 `scripts/sync-dashboard.mjs` 自动生成，Dashboard 的唯一数据源。含 history（所有训练记录）、combined（统计汇总）、trends（分数趋势）、todaySession（今日计划）、vocab（词汇统计）、speaking（口语）。

**root**

- `index.html`: Vite SPA 入口 HTML。
- `vite.config.ts` (`^5.4.0`): Vite 构建配置 + @vitejs/plugin-react。
- `tsconfig*.json`: TypeScript 编译配置。
- `package.json`: `@ielts/dashboard`，依赖 react ^18.3 + recharts ^3.8 + vite ^5.4。

**dist/**

- 构建产物。由 `vite build` 生成，`sync-dashboard.mjs` 会同步 public/stats.json 到此目录。

## 架构决策

- 单文件 SPA：所有页面渲染集中在 App.tsx 中，用 TabPane 做 tab 切换过渡。不引入路由库。
- TabPane 使用 useState 缓存 children 以实现退出/进入动画，**注意**：同 tab 内 state 变化时，必须在 `else` 分支中调用 `setCont(children)` 立即更新缓存，否则内容卡在旧快照。
- 颜色体系定在 `c` 常量中：暖色调 paper/card 基底，深酒红 accent，墨绿 gold，藏蓝 blue。
- 数据完全由 stats.json 驱动，Fetch-on-load 模式，无客户端状态库。

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
