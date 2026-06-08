import { existsSync, readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { processPatterns } from '@ielts/cloud';
const BASE = join(homedir(), '.ielts');
function loadJSON(p) {
    if (!existsSync(p))
        return null;
    try {
        return JSON.parse(readFileSync(p, 'utf-8'));
    }
    catch {
        return null;
    }
}
export function registerReportCommands(program) {
    const report = program.command('report').description('Generate reports');
    report.command('weekly')
        .description('Generate weekly progress report')
        .action(() => {
        const stats = loadJSON(join(BASE, 'stats.json'));
        const plan = loadJSON(join(BASE, 'plans', 'current.json'));
        const profile = loadJSON(join(BASE, 'profile.json'));
        if (!stats) {
            console.log('No data. Run ielts snapshot first.');
            return;
        }
        const now = new Date();
        const lines = [];
        lines.push('');
        lines.push('='.repeat(50));
        lines.push('  IELTS Weekly Report — ' + now.toISOString().slice(0, 10));
        lines.push('='.repeat(50));
        lines.push('');
        lines.push('Training Volume');
        lines.push('  Writing: ' + (stats.writing?.totalEssays ?? 0) + ' essays');
        lines.push('  Reading: ' + (stats.reading?.totalPassages ?? 0) + ' passages');
        lines.push('  Listening: ' + (stats.listening?.totalSections ?? 0) + ' sections');
        lines.push('  Vocab: ' + (stats.vocab?.wordsReviewed ?? 0) + ' words');
        lines.push('');
        lines.push('Score Snapshot');
        lines.push('  Writing: ' + (stats.writing?.averageScores?.overall ?? 'N/A'));
        lines.push('  Reading: ' + (stats.reading?.averageBand ?? 'N/A'));
        lines.push('  Listening: ' + (stats.listening?.averageBand ?? 'N/A'));
        lines.push('  Overall: ' + (stats.combined?.overallBand ?? 'N/A'));
        lines.push('');
        if (plan?.tasks) {
            const done = plan.tasks.filter((t) => t.status === 'done').length;
            const skipped = plan.tasks.filter((t) => t.status === 'skipped').length;
            lines.push('Plan: ' + done + '/' + plan.tasks.length + ' done, ' + skipped + ' skipped');
            lines.push('');
        }
        lines.push('Top Error Patterns');
        for (const p of processPatterns(stats).slice(0, 5)) {
            lines.push('  [' + p.pattern.severity + '] ' + p.pattern.name + ' (' + p.score + ')');
        }
        lines.push('');
        if (profile?.examDate) {
            const d = Math.max(0, Math.ceil((new Date(profile.examDate).getTime() - Date.now()) / 86400000));
            lines.push('Exam in ' + d + ' days');
        }
        lines.push('='.repeat(50));
        lines.push('');
        for (const l of lines)
            console.log(l);
    });
}
//# sourceMappingURL=index.js.map