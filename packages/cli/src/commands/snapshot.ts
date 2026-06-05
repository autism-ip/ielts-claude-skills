import { readdirSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const BASE = join(homedir(), '.ielts');
const STATS = join(BASE, 'stats.json');
const PROFILE = join(BASE, 'profile.json');

function parseFm(content: string): Record<string, any> {
  const m = content.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return {};
  const r: Record<string, any> = {};
  let currentKey = '';
  for (const line of m[1].split('\n')) {
    const indent = line.search(/\S/);
    if (indent === 0) {
      const [k, ...rest] = line.split(':');
      if (k && rest.length) {
        currentKey = k.trim();
        r[currentKey] = isNaN(Number(rest.join(':').trim())) ? rest.join(':').trim() : Number(rest.join(':').trim());
      } else if (k && !rest.length) {
        currentKey = k.trim();
        r[currentKey] = {};
      }
    } else if (indent > 0 && currentKey && typeof r[currentKey] === 'object' && !Array.isArray(r[currentKey])) {
      const [k, ...rest] = line.trim().split(':');
      if (k && rest.length) r[currentKey][k.trim()] = isNaN(Number(rest.join(':').trim())) ? rest.join(':').trim() : Number(rest.join(':').trim());
    }
  }
  return r;
}

function fmRecords(dir: string): Record<string, any>[] {
  const p = join(BASE, dir);
  if (!existsSync(p)) return [];
  return readdirSync(p).filter(f => f.endsWith('.md')).map(f => parseFm(readFileSync(join(p, f), 'utf-8'))).filter(r => Object.keys(r).length > 0);
}

function countErrors(recs: Record<string, any>[]): { category: string; count: number }[] {
  const map = new Map<string, number>();
  for (const r of recs) {
    for (const e of (Array.isArray(r.errors) ? r.errors : [])) {
      const cat = typeof e === 'object' ? e.errorCategory || e.category : '';
      if (cat) map.set(cat, (map.get(cat) || 0) + 1);
    }
  }
  return [...map.entries()].map(([c, n]) => ({ category: c, count: n })).sort((a, b) => b.count - a.count);
}

export function snapshotCommand(): void {
  const write = fmRecords('writing');
  const read = fmRecords('reading');
  const listen = fmRecords('listening');
  const avg = (a: number[]) => a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0;
  const ws = (r: any) => r.bandScore || r;
  const wrAvg = (f: string) => avg(write.map(r => Number(ws(r)[f] ?? 0)));

  let daysUntilExam = 0, overallBand = 0;
  try {
    const profile = JSON.parse(readFileSync(PROFILE, 'utf-8'));
    if (profile.examDate) daysUntilExam = Math.max(0, Math.ceil((new Date(profile.examDate).getTime() - Date.now()) / 86400000));
  } catch { /* no profile */ }

  const writingAvg = write.length ? (wrAvg('tr') + wrAvg('cc') + wrAvg('lr') + wrAvg('gra')) / 4 : 0;
  const readingAvg = avg(read.map(r => Number(r.bandEstimate ?? 0)));
  const listeningAvg = avg(listen.map(r => Number(r.bandEstimate ?? 0)));
  const bands = [writingAvg, readingAvg, listeningAvg].filter(b => b > 0);
  if (bands.length > 0) overallBand = Math.round(bands.reduce((a, b) => a + b, 0) / bands.length * 2) / 2;

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
