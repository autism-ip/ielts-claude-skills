import { readdirSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const BASE = join(homedir(), '.ielts');
const STATS = join(BASE, 'stats.json');

function fmRecords(dir: string): Record<string, any>[] {
  const p = join(BASE, dir);
  if (!existsSync(p)) return [];
  return readdirSync(p).filter(f => f.endsWith('.md')).map(f => {
    const m = readFileSync(join(p, f), 'utf-8').match(/^---\n([\s\S]*?)\n---/);
    if (!m) return null;
    const r: Record<string, any> = {};
    m[1].split('\n').forEach(line => {
      const [k, ...rest] = line.split(':');
      if (k && rest.length) {
        const v = rest.join(':').trim();
        r[k.trim()] = isNaN(Number(v)) ? v : Number(v);
      }
    });
    return r;
  }).filter(Boolean) as Record<string, any>[];
}

export function snapshotCommand(): void {
  const write = fmRecords('writing');
  const read = fmRecords('reading');
  const listen = fmRecords('listening');
  const avg = (a: number[]) => a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0;

  const s = {
    version: '3.0.0',
    lastSnapshot: new Date().toISOString(),
    writing: {
      totalEssays: write.length,
      averageScores: write.length ? {
        tr: avg(write.map(r => r.tr ?? 0)), cc: avg(write.map(r => r.cc ?? 0)),
        lr: avg(write.map(r => r.lr ?? 0)), gra: avg(write.map(r => r.gra ?? 0)),
        overall: avg(write.map(r => r.overall ?? 0)),
      } : undefined, topErrors: [],
    },
    reading: { totalPassages: read.length, averageCorrect: avg(read.map(r => r.correctCount ?? 0)), averageBand: avg(read.map(r => r.bandEstimate ?? 0)), topErrors: [] },
    listening: { totalSections: listen.length, averageCorrect: avg(listen.map(r => r.correctCount ?? 0)), averageBand: avg(listen.map(r => r.bandEstimate ?? 0)), topErrors: [] },
    speaking: { totalPractices: 0, topicsCovered: 0 },
    vocab: { wordsReviewed: 0, retentionRate: 0 },
    combined: { overallBand: 0, daysUntilExam: 0 },
  };

  writeFileSync(STATS, JSON.stringify(s, null, 2));
  console.log(`Snapshot -> ${STATS}`);
  console.log(`Writing: ${s.writing.totalEssays} | Reading: ${s.reading.totalPassages} | Listening: ${s.listening.totalSections}`);
}
