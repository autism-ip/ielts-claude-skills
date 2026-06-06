import { describe, it, expect } from 'vitest';
import { mapProfile, mapWriting, mapReading, mapListening, mapVocab, mapSpeaking, mapPlan } from '../src/providers/feishu/mappers.js';

describe('mappers', () => {
  it('mapProfile produces stable fields', () => {
    const r = mapProfile({ target: { overall: 7, writing: 6.5 }, examDate: '2026-08-23', preferences: { dailyGoal: 90 } });
    expect(r.fields.target_overall).toBe(7); expect(r.stableHash).toBeTruthy();
  });
  it('mapWriting handles errors', () => {
    const r = mapWriting({ createdAt: '2026-05-10T09:00Z', taskType: 'task2', bandScore: { overall: 6 }, errors: [{ category: 'grammar' }, { category: 'coherence' }] });
    expect(r.fields.error_count).toBe(2);
  });
  it('mapReading respects privacy', () => {
    const r = mapReading({ createdAt: '2026-05-10T09:00Z', passageTitle: 'A'.repeat(300), totalQuestions: 13, correctCount: 8, bandEstimate: 6 });
    expect((r.fields.passage as string).length).toBeLessThan(200);
  });
  it('mapListening extracts section', () => {
    const r = mapListening({ createdAt: '2026-05-10T09:00Z', section: 3, totalQuestions: 10, correctCount: 6, bandEstimate: 5.5 });
    expect(r.fields.section).toBe(3);
  });
  it('mapVocab maps review day', () => {
    expect(mapVocab({ date: '2026-05-26', reviewed: 10 }).fields.reviewed).toBe(10);
  });
  it('mapSpeaking extracts story', () => {
    expect(mapSpeaking({ name: 'test', applicableTopics: ['travel'], part2Length: 120, lastPracticed: '2026-05-28T09:00Z' }).fields.story_name).toBe('test');
  });
  it('mapPlan calculates stats', () => {
    const r = mapPlan({ startDate: '2026-06-07', tasks: [{ status: 'done' }, { status: 'todo' }, { status: 'skipped' }] });
    expect(r.fields.completed).toBe(1); expect(r.fields.total_tasks).toBe(3);
  });
  it('hashes are unique across mappers', () => {
    const h = [mapProfile({target:{overall:7}}), mapWriting({createdAt:'2026-05-10T09:00Z',taskType:'t2',bandScore:{overall:6}})].map(r=>r.stableHash);
    expect(new Set(h).size).toBe(h.length);
  });
});
