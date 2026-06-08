import { readdirSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
const BASE = join(homedir(), '.ielts');
const STATS = join(BASE, 'stats.json');
const PROFILE = join(BASE, 'profile.json');
function parseFm(content) {
    const m = content.match(/^---\n([\s\S]*?)\n---/);
    if (!m)
        return {};
    const r = {};
    const stack = [{ obj: r, indent: -1 }];
    const lines = m[1].split('\n');
    /* 预扫描：标记哪些 key 是数组 */
    const arrayKeys = new Set();
    for (let i = 0; i < lines.length; i++) {
        const t = lines[i].trim();
        if (!t || t.includes(':'))
            continue;
        if (t.startsWith('- ') || t === '-') {
            for (let j = i - 1; j >= 0; j--) {
                if (lines[j].trim().includes(':')) {
                    const ci = lines[j].indexOf(':');
                    const k = lines[j].slice(0, ci).trimEnd();
                    const kl = lines[j].length - lines[j].trimStart().length;
                    const tl = lines[i].length - lines[i].trimStart().length;
                    if (tl > kl || tl === kl + 2) {
                        arrayKeys.add(k);
                    }
                    break;
                }
            }
        }
    }
    for (const raw of lines) {
        const trimmed = raw.trimEnd();
        const content = raw.trim();
        if (!content)
            continue;
        const indent = raw.length - raw.trimStart().length;
        while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
            stack.pop();
        }
        if (content.startsWith('- ') || content === '-') {
            const val = content.replace(/^- */, '');
            const parent = stack[stack.length - 1].obj;
            if (!Array.isArray(parent))
                continue;
            if (!val) {
                const obj = {};
                parent.push(obj);
                stack.push({ obj, indent });
            }
            else {
                parent.push(parseValue(val));
            }
            continue;
        }
        const colonIdx = content.indexOf(':');
        if (colonIdx === -1)
            continue;
        const k = content.slice(0, colonIdx).trimEnd();
        const v = content.slice(colonIdx + 1).trim();
        const target = stack[stack.length - 1].obj;
        if (v === '') {
            target[k] = arrayKeys.has(k) ? [] : {};
            stack.push({ obj: target[k], indent });
        }
        else {
            target[k] = parseValue(v);
        }
    }
    return r;
}
function parseValue(v) {
    if (v === 'true')
        return true;
    if (v === 'false')
        return false;
    const stripped = v.replace(/^"|"$/g, '');
    const num = Number(stripped);
    if (!isNaN(num) && stripped !== '')
        return num;
    return stripped;
}
function fmRecords(dir) {
    const p = join(BASE, dir);
    if (!existsSync(p))
        return [];
    return readdirSync(p).filter(f => f.endsWith('.md')).map(f => parseFm(readFileSync(join(p, f), 'utf-8'))).filter(r => Object.keys(r).length > 0);
}
function countErrors(recs) {
    const map = new Map();
    for (const r of recs) {
        for (const e of (Array.isArray(r.errors) ? r.errors : [])) {
            const cat = typeof e === 'object' ? e.errorCategory || e.category : '';
            if (cat)
                map.set(cat, (map.get(cat) || 0) + 1);
        }
    }
    return [...map.entries()].map(([c, n]) => ({ category: c, count: n })).sort((a, b) => b.count - a.count);
}
export function snapshotCommand() {
    const write = fmRecords('writing');
    const read = fmRecords('reading');
    const listen = fmRecords('listening');
    const avg = (a) => a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0;
    const ws = (r) => r.bandScore || r;
    const wrAvg = (f) => avg(write.map(r => Number(ws(r)[f] ?? 0)));
    let daysUntilExam = 0, overallBand = 0;
    try {
        const profile = JSON.parse(readFileSync(PROFILE, 'utf-8'));
        if (profile.examDate)
            daysUntilExam = Math.max(0, Math.ceil((new Date(profile.examDate).getTime() - Date.now()) / 86400000));
    }
    catch { /* no profile */ }
    const writingAvg = write.length ? (wrAvg('tr') + wrAvg('cc') + wrAvg('lr') + wrAvg('gra')) / 4 : 0;
    const readingAvg = avg(read.map(r => Number(r.bandEstimate ?? 0)));
    const listeningAvg = avg(listen.map(r => Number(r.bandEstimate ?? 0)));
    const bands = [writingAvg, readingAvg, listeningAvg].filter(b => b > 0);
    if (bands.length > 0)
        overallBand = Math.round(bands.reduce((a, b) => a + b, 0) / bands.length * 2) / 2;
    const s = {
        version: '3.0.0', lastSnapshot: new Date().toISOString(),
        writing: {
            totalEssays: write.length,
            averageScores: write.length ? { tr: wrAvg('tr'), cc: wrAvg('cc'), lr: wrAvg('lr'), gra: wrAvg('gra'), overall: wrAvg('overall') } : undefined,
            topErrors: countErrors(write),
        },
        reading: { totalPassages: read.length, averageCorrect: avg(read.map(r => Number(r.correctCount ?? 0))), averageBand: readingAvg, topErrors: countErrors(read) },
        listening: { totalSections: listen.length, averageCorrect: avg(listen.map(r => Number(r.correctCount ?? 0))), averageBand: listeningAvg, topErrors: countErrors(listen) },
        speaking: { totalPractices: 0, topicsCovered: 0 },
        vocab: { wordsReviewed: 0, retentionRate: 0 },
        combined: { overallBand, daysUntilExam },
    };
    writeFileSync(STATS, JSON.stringify(s, null, 2));
    console.log(`Snapshot -> ${STATS}`);
    console.log(`Writing: ${s.writing.totalEssays} | Reading: ${s.reading.totalPassages} | Listening: ${s.listening.totalSections}`);
    console.log(`Overall: ${s.combined.overallBand} | Exam: ${s.combined.daysUntilExam}d`);
}
//# sourceMappingURL=snapshot.js.map