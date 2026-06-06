const DEF = { syncRawText: false, syncScores: true };
function hash(f) {
    const s = JSON.stringify(Object.entries(f).sort(([a], [b]) => a < b ? -1 : 1));
    return Array.from(s).reduce((h, c) => ((h << 5) - h + c.charCodeAt(0)) | 0, 0).toString(36);
}
export function mapProfile(p, _privacy = DEF) {
    const f = { target_overall: p.target?.overall ?? 0, target_writing: p.target?.writing ?? 0, target_reading: p.target?.reading ?? 0, target_listening: p.target?.listening ?? 0, target_speaking: p.target?.speaking ?? 0, exam_date: p.examDate, daily_goal: p.preferences?.dailyGoal ?? 60 };
    return { fields: f, stableHash: hash(f) };
}
export function mapWriting(r, p = DEF) {
    const tags = (r.errors || []).map((e) => e.category || e.errorCategory).filter(Boolean);
    const title = p.syncRawText ? (r.topic ?? '') : (r.topic ?? '').slice(0, 200);
    const scores = p.syncScores
        ? { tr_score: r.bandScore?.tr ?? 0, cc_score: r.bandScore?.cc ?? 0, lr_score: r.bandScore?.lr ?? 0, gra_score: r.bandScore?.gra ?? 0, overall: r.bandScore?.overall ?? 0 }
        : { tr_score: null, cc_score: null, lr_score: null, gra_score: null, overall: null };
    const f = { date: (r.createdAt ?? '').slice(0, 10), task_type: r.taskType ?? '', topic: title, word_count: r.wordCount ?? 0, ...scores, error_tags: tags, error_count: tags.length };
    return { fields: f, stableHash: hash(f) };
}
export function mapReading(r, p = DEF) {
    const tags = (r.errors || []).map((e) => e.errorCategory || e.type).filter(Boolean);
    const title = p.syncRawText ? (r.passageTitle ?? '') : (r.passageTitle ?? '').slice(0, 100);
    const f = { date: (r.createdAt ?? '').slice(0, 10), passage: title, total_questions: r.totalQuestions ?? 0, correct_count: r.correctCount ?? 0, band_estimate: r.bandEstimate ?? 0, error_tags: tags, error_count: tags.length };
    return { fields: f, stableHash: hash(f) };
}
export function mapListening(r) {
    const tags = (r.errors || []).map((e) => e.errorCategory).filter(Boolean);
    const f = { date: (r.createdAt ?? '').slice(0, 10), section: r.section ?? 0, total_questions: r.totalQuestions ?? 0, correct_count: r.correctCount ?? 0, band_estimate: r.bandEstimate ?? 0, error_tags: tags, error_count: tags.length };
    return { fields: f, stableHash: hash(f) };
}
export function mapVocab(r) {
    const f = { date: r.date ?? '', reviewed: r.reviewed ?? 0, new_words: r.newWords ?? 0, correct: r.correct ?? 0 };
    return { fields: f, stableHash: hash(f) };
}
export function mapSpeaking(r, p = DEF) {
    const f = { date: (r.lastPracticed ?? '').slice(0, 10), story_name: r.name ?? '', applicable_topics: r.applicableTopics || [], part2_length: r.part2Length ?? 0 };
    return { fields: f, stableHash: hash(f) };
}
export function mapPlan(r) {
    const ts = r.tasks || [];
    const f = { date: r.startDate ?? '', total_tasks: ts.length, completed: ts.filter((t) => t.status === 'done').length, skipped: ts.filter((t) => t.status === 'skipped').length };
    return { fields: f, stableHash: hash(f) };
}
//# sourceMappingURL=mappers.js.map