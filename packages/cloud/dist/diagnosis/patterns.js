/**
 * [INPUT]: 依赖 stats.json 的 topErrors 结构
 * [OUTPUT]: 对外提供 processPatterns、getPatternRules 函数和类型
 * [POS]: packages/cloud/diagnosis 的错误模式识别引擎
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
const RULES = [
    { name: 'underdeveloped-arguments', module: 'writing', description: 'Arguments lack depth or miss key comparisons', severity: 'high', tags: ['task_response'], suggestedInterventions: ['tr-drill'] },
    { name: 'cohesion-weakness', module: 'writing', description: 'Transitions between ideas are abrupt', severity: 'medium', tags: ['coherence'], suggestedInterventions: ['cc-structure'] },
    { name: 'limited-vocabulary', module: 'writing', description: 'Repeated use of common words', severity: 'medium', tags: ['lexical'], suggestedInterventions: ['lr-synonym'] },
    { name: 'grammar-inaccuracy', module: 'writing', description: 'Subject-verb agreement, article misuse, tense shifts', severity: 'high', tags: ['grammar'], suggestedInterventions: ['gra-gap-fill'] },
    { name: 'tfng-over-inference', module: 'reading', description: 'Over-inferring, marking NOT GIVEN as TRUE/FALSE', severity: 'high', tags: ['tfng_logic'], suggestedInterventions: ['tfng-drill'] },
    { name: 'heading-confusion', module: 'reading', description: 'Difficulty matching headings to paragraphs', severity: 'medium', tags: ['heading', 'matching'], suggestedInterventions: ['heading-matching'] },
    { name: 'gap-fill-strategy', module: 'reading', description: 'Word type prediction failures in gap-fill', severity: 'medium', tags: ['gap_fill'], suggestedInterventions: ['gap-fill-strategy'] },
    { name: 'distractor-traps', module: 'listening', description: 'Falling for speaker corrections and multiple options', severity: 'high', tags: ['distraction'], suggestedInterventions: ['distractor-id'] },
    { name: 'spelling-accuracy', module: 'listening', description: 'Common spelling errors in Section 1', severity: 'medium', tags: ['spelling'], suggestedInterventions: ['listening-spelling'] },
    { name: 'inference-gap', module: 'listening', description: 'Missing implied meaning in dialogues', severity: 'high', tags: ['inference'], suggestedInterventions: ['inference-drill'] },
    { name: 'fluency-block', module: 'speaking', description: 'Long pauses and hesitation in extended speech', severity: 'high', tags: ['fluency'], suggestedInterventions: ['fluency-drill'] },
    { name: 'retention-gap', module: 'vocab', description: 'Low vocabulary retention rate', severity: 'medium', tags: ['retention'], suggestedInterventions: ['srs-review'] },
];
export function getPatternRules(module) {
    return module ? RULES.filter(r => r.module === module) : [...RULES];
}
export function processPatterns(stats) {
    const results = [];
    for (const rule of RULES) {
        const total = rule.tags.reduce((s, tag) => {
            const errs = stats[rule.module]?.topErrors ?? [];
            return s + errs.filter((e) => (e.category === tag || e.errorCategory === tag)).reduce((a, e) => a + e.count, 0);
        }, 0);
        if (total === 0)
            continue;
        results.push({ pattern: rule, evidence: { recordIds: [], summary: `${total} occurrences — ${rule.name}` }, score: Math.min(100, total * 20) });
    }
    return results.sort((a, b) => b.score - a.score);
}
//# sourceMappingURL=patterns.js.map