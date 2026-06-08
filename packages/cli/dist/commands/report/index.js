/**
 * [INPUT]: 依赖 commander 的 Command 类
 * [OUTPUT]: 对外提供 registerReportCommands 函数，注册 report 子命令
 * [POS]: packages/cli/commands/report 的入口，供 packages/cli/index.ts 消费
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
export function registerReportCommands(program) {
    const report = program.command('report').description('Generate training reports');
    report.command('progress')
        .description('Show progress report')
        .action(() => {
        console.log('Report command not yet implemented');
    });
}
//# sourceMappingURL=index.js.map