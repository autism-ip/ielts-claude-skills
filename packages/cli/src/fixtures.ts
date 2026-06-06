/**
 * [INPUT]: 依赖 node:fs, node:path, node:os 的文件系统操作
 * [OUTPUT]: 对外提供 installFixtures 函数，安装完整的 IELTS 测试夹具数据集
 * [POS]: packages/cli 的夹具模块，被 init 命令消费
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import { writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const BASE = join(homedir(), '.ielts');

/* ── 辅助：写 frontmatter .md 文件 ── */
function writeFm(path: string, data: Record<string, unknown>, body?: string): void {
  const lines = ['---'];
  const walk = (obj: Record<string, unknown>, indent = 0) => {
    for (const [k, v] of Object.entries(obj)) {
      const pad = '  '.repeat(indent);
      if (v === null || v === undefined) continue;
      if (Array.isArray(v)) {
        lines.push(`${pad}${k}:`);
        for (const item of v) {
          if (typeof item === 'object' && item !== null) {
            lines.push(`${pad}  -`);
            walk(item as Record<string, unknown>, indent + 2);
          } else {
            lines.push(`${pad}  - ${JSON.stringify(item)}`);
          }
        }
      } else if (typeof v === 'object') {
        lines.push(`${pad}${k}:`);
        walk(v as Record<string, unknown>, indent + 1);
      } else {
        lines.push(`${pad}${k}: ${JSON.stringify(v)}`);
      }
    }
  };
  walk(data);
  lines.push('---');
  if (body) lines.push('', body);
  writeFileSync(path, lines.join('\n') + '\n');
}

function writeJson(path: string, data: unknown): void {
  writeFileSync(path, JSON.stringify(data, null, 2) + '\n');
}

/* ── 夹具：Profile ── */
function makeProfile(): Record<string, unknown> {
  return {
    version: '3.0.0',
    createdAt: '2026-03-01T00:00:00.000Z',
    updatedAt: '2026-06-01T00:00:00.000Z',
    target: { overall: 7.0, writing: 6.5, reading: 7.5, listening: 8.0, speaking: 7.0 },
    examDate: '2026-08-23',
    timezone: 'Asia/Shanghai',
    preferences: { dailyGoal: 90, focusAreas: ['writing', 'reading', 'listening'] },
  };
}

/* ── 夹具：Writing Records ── */
function makeWritingFixtures(): Record<string, unknown>[] {
  const records: Record<string, unknown>[] = [
    {
      type: 'writing', taskType: 'task2', topic: 'Some people believe that unpaid community service should be a compulsory part of high school programmes',
      wordCount: 312, rewritten: false,
      bandScore: { tr: 6.0, cc: 6.0, lr: 6.5, gra: 5.5, overall: 6.0 },
      errors: [
        { category: 'grammar', severity: 'major', location: 'paragraph 2, line 4', description: 'Subject-verb agreement: "the government have" should be "the government has"' },
        { category: 'coherence', severity: 'minor', location: 'paragraph 3', description: 'Transition between contrasting ideas is abrupt' },
        { category: 'lexical', severity: 'minor', location: 'paragraph 1', description: 'Repetition of "important" three times' },
      ],
      createdAt: '2026-05-10T09:15:00.000Z',
    },
    {
      type: 'writing', taskType: 'task1', topic: 'The chart below shows the percentage of households with various types of technology in the UK from 1997 to 2021',
      wordCount: 195, rewritten: true,
      bandScore: { tr: 6.5, cc: 6.5, lr: 6.0, gra: 6.0, overall: 6.0 },
      errors: [
        { category: 'task_response', severity: 'minor', location: 'overview', description: 'Missing comparison of highest and lowest values in overview' },
        { category: 'spelling', severity: 'minor', location: 'paragraph 2', description: '"percentange" should be "percentage"' },
      ],
      createdAt: '2026-05-15T14:30:00.000Z',
    },
    {
      type: 'writing', taskType: 'task2', topic: 'In many countries, people are living in a throwaway society where they use things once and then discard them',
      wordCount: 285, rewritten: false,
      bandScore: { tr: 6.5, cc: 6.0, lr: 6.5, gra: 6.0, overall: 6.5 },
      errors: [
        { category: 'coherence', severity: 'minor', location: 'paragraph 4', description: 'Conclusion introduces a new idea not discussed earlier' },
        { category: 'grammar', severity: 'minor', location: 'paragraph 1', description: 'Article missing before "throwaway society"' },
      ],
      createdAt: '2026-05-20T11:00:00.000Z',
    },
    {
      type: 'writing', taskType: 'letter', topic: 'You recently attended a job interview and would like to thank the interviewer',
      wordCount: 168, rewritten: false,
      bandScore: { tr: 7.0, cc: 7.0, lr: 6.5, gra: 6.5, overall: 7.0 },
      errors: [
        { category: 'lexical', severity: 'minor', location: 'body', description: 'Register inconsistency: too formal for a semi-formal letter' },
      ],
      createdAt: '2026-05-25T16:45:00.000Z',
    },
    {
      type: 'writing', taskType: 'task2', topic: 'Some experts believe that it is better for children to begin learning a foreign language at primary school rather than secondary school',
      wordCount: 298, rewritten: false,
      bandScore: { tr: 5.5, cc: 5.5, lr: 6.0, gra: 5.5, overall: 5.5 },
      errors: [
        { category: 'task_response', severity: 'major', location: 'paragraph 2', description: 'Argument does not fully address the "primary vs secondary" comparison' },
        { category: 'grammar', severity: 'major', location: 'paragraph 3', description: 'Run-on sentences and comma splices throughout' },
        { category: 'coherence', severity: 'major', location: 'entire essay', description: 'Ideas jump between topics without logical progression' },
      ],
      createdAt: '2026-06-01T08:30:00.000Z',
    },
  ];
  return records;
}

/* ── 夹具：Reading Records ── */
function makeReadingFixtures(): Record<string, unknown>[] {
  return [
    {
      type: 'reading', passageTitle: 'The Development of the International Sports Movement',
      totalQuestions: 13, correctCount: 8, bandEstimate: 6.0,
      questionTypes: ['tfng', 'matching-headings', 'gap-fill'],
      errors: [
        { questionNumber: 3, type: 'tfng', userAnswer: 'FALSE', correctAnswer: 'NOT GIVEN', errorCategory: 'tfng_logic' },
        { questionNumber: 5, type: 'tfng', userAnswer: 'NOT GIVEN', correctAnswer: 'TRUE', errorCategory: 'tfng_logic' },
        { questionNumber: 7, type: 'tfng', userAnswer: 'TRUE', correctAnswer: 'FALSE', errorCategory: 'tfng_logic' },
        { questionNumber: 10, type: 'matching-headings', userAnswer: 'iv', correctAnswer: 'vi', errorCategory: 'matching' },
        { questionNumber: 12, type: 'gap-fill', userAnswer: 'tradition', correctAnswer: 'heritage', errorCategory: 'gap_fill' },
      ],
      synonymsExtracted: [
        { source: 'global sporting events', match: 'international sports movement', context: 'paragraph A' },
        { source: 'promoted', match: 'advocated', context: 'paragraph B' },
      ],
      createdAt: '2026-05-12T10:00:00.000Z',
    },
    {
      type: 'reading', passageTitle: 'The Economic Impact of Tourism on Developing Nations',
      totalQuestions: 14, correctCount: 10, bandEstimate: 6.5,
      questionTypes: ['heading', 'true-false', 'gap-fill'],
      errors: [
        { questionNumber: 2, type: 'heading', userAnswer: 'iii', correctAnswer: 'v', errorCategory: 'heading' },
        { questionNumber: 8, type: 'true-false', userAnswer: 'TRUE', correctAnswer: 'FALSE', errorCategory: 'true_false' },
        { questionNumber: 11, type: 'gap-fill', userAnswer: 'revenue', correctAnswer: 'income', errorCategory: 'gap_fill' },
        { questionNumber: 13, type: 'gap-fill', userAnswer: 'infrastructure', correctAnswer: 'transportation', errorCategory: 'gap_fill' },
      ],
      synonymsExtracted: [
        { source: 'economic benefits', match: 'financial advantages', context: 'paragraph C' },
        { source: 'local communities', match: 'indigenous populations', context: 'paragraph D' },
      ],
      createdAt: '2026-05-18T15:30:00.000Z',
    },
    {
      type: 'reading', passageTitle: 'The Science of Habit Formation',
      totalQuestions: 13, correctCount: 7, bandEstimate: 5.5,
      questionTypes: ['tfng', 'gap-fill', 'matching-headings'],
      errors: [
        { questionNumber: 1, type: 'tfng', userAnswer: 'TRUE', correctAnswer: 'NOT GIVEN', errorCategory: 'tfng_logic' },
        { questionNumber: 4, type: 'tfng', userAnswer: 'NOT GIVEN', correctAnswer: 'FALSE', errorCategory: 'tfng_logic' },
        { questionNumber: 6, type: 'tfng', userAnswer: 'FALSE', correctAnswer: 'TRUE', errorCategory: 'tfng_logic' },
        { questionNumber: 9, type: 'gap-fill', userAnswer: 'trigger', correctAnswer: 'cue', errorCategory: 'gap_fill' },
        { questionNumber: 11, type: 'matching-headings', userAnswer: 'ii', correctAnswer: 'iv', errorCategory: 'matching' },
        { questionNumber: 13, type: 'gap-fill', userAnswer: 'automatic', correctAnswer: 'unconscious', errorCategory: 'gap_fill' },
      ],
      synonymsExtracted: [
        { source: 'daily routines', match: 'habitual behaviors', context: 'paragraph A' },
        { source: 'brain patterns', match: 'neural pathways', context: 'paragraph B' },
      ],
      createdAt: '2026-05-22T09:00:00.000Z',
    },
  ];
}

/* ── 夹具：Listening Records ── */
function makeListeningFixtures(): Record<string, unknown>[] {
  return [
    {
      type: 'listening', section: 1, totalQuestions: 10, correctCount: 8, bandEstimate: 6.5,
      errors: [
        { questionNumber: 3, userAnswer: '14th March', correctAnswer: '15th March', errorCategory: 'distraction' },
        { questionNumber: 7, userAnswer: 'Library', correctAnswer: 'Liberty', errorCategory: 'spelling' },
      ],
      createdAt: '2026-05-14T10:30:00.000Z',
    },
    {
      type: 'listening', section: 2, totalQuestions: 10, correctCount: 7, bandEstimate: 6.0,
      errors: [
        { questionNumber: 12, userAnswer: '25', correctAnswer: '30', errorCategory: 'number' },
        { questionNumber: 15, userAnswer: 'September', correctAnswer: 'December', errorCategory: 'distraction' },
        { questionNumber: 18, userAnswer: 'parking', correctAnswer: 'parking lot', errorCategory: 'inference' },
      ],
      createdAt: '2026-05-19T14:00:00.000Z',
    },
    {
      type: 'listening', section: 3, totalQuestions: 10, correctCount: 6, bandEstimate: 5.5,
      errors: [
        { questionNumber: 22, userAnswer: 'qualitative', correctAnswer: 'quantitative', errorCategory: 'speed' },
        { questionNumber: 25, userAnswer: 'essay', correctAnswer: 'dissertation', errorCategory: 'inference' },
        { questionNumber: 27, userAnswer: 'reading', correctAnswer: 'readings', errorCategory: 'spelling' },
        { questionNumber: 29, userAnswer: 'group work', correctAnswer: 'pair work', errorCategory: 'distraction' },
      ],
      createdAt: '2026-05-26T11:15:00.000Z',
    },
    {
      type: 'listening', section: 4, totalQuestions: 10, correctCount: 5, bandEstimate: 5.0,
      errors: [
        { questionNumber: 32, userAnswer: 'climate', correctAnswer: 'climatic', errorCategory: 'speed' },
        { questionNumber: 34, userAnswer: 'eruption', correctAnswer: 'volcanic eruption', errorCategory: 'inference' },
        { questionNumber: 36, userAnswer: '1870', correctAnswer: '1871', errorCategory: 'number' },
        { questionNumber: 38, userAnswer: 'ecosystem', correctAnswer: 'ecosystems', errorCategory: 'spelling' },
        { questionNumber: 40, userAnswer: 'carbon', correctAnswer: 'carbon dioxide', errorCategory: 'inference' },
      ],
      createdAt: '2026-06-02T16:00:00.000Z',
    },
  ];
}

/* ── 夹具：Speaking ── */
function makeSpeakingFixtures(): Record<string, unknown> {
  return {
    type: 'speaking-topic-group',
    lastUpdated: '2026-05-30T12:00:00.000Z',
    groups: [
      { name: 'Education & Learning', stories: ['learning-to-code'], part2Count: 2, part3Count: 3 },
      { name: 'Travel & Culture', stories: ['backpacking-in-japan'], part2Count: 2, part3Count: 2 },
    ],
  };
}

function makeSpeakingStories(): Record<string, unknown>[] {
  return [
    {
      type: 'speaking-story', name: 'learning-to-code',
      applicableTopics: ['skill', 'learning', 'challenge', 'achievement', 'technology'],
      part2Length: 115, lastPracticed: '2026-05-28T09:00:00.000Z',
    },
    {
      type: 'speaking-story', name: 'backpacking-in-japan',
      applicableTopics: ['travel', 'culture', 'food', 'memorable experience', 'adventure'],
      part2Length: 130, lastPracticed: '2026-05-20T14:00:00.000Z',
    },
  ];
}

/* ── 夹具：Vocab ── */
function makeVocabFixtures(): Record<string, unknown> {
  return {
    type: 'vocab-wordlist',
    tiers: { band6: 5, band7: 2, band8: 1 },
    entries: [
      { word: 'significant', tier: 'B6', definition: 'important or large enough to be noticed', example: 'There has been a significant increase in sales this quarter.' },
      { word: 'consequently', tier: 'B6', definition: 'as a result', example: 'The company failed to innovate; consequently, it lost market share.' },
      { word: 'approach', tier: 'B6', definition: 'a way of dealing with something', example: 'We need to adopt a different approach to solve this problem.' },
      { word: 'widespread', tier: 'B6', definition: 'existing or happening in many places', example: 'The use of smartphones is widespread among young people.' },
      { word: 'inevitable', tier: 'B6', definition: 'certain to happen and impossible to avoid', example: 'Change is inevitable in any growing organisation.' },
      { word: 'compelling', tier: 'B7', definition: 'very convincing or interesting', example: 'The lawyer presented a compelling argument to the jury.' },
      { word: 'harbour', tier: 'B7', definition: 'to keep thoughts or feelings in your mind for a long time', example: 'She still harbours doubts about the decision.' },
      { word: 'ubiquitous', tier: 'B8', definition: 'seeming to be everywhere', example: 'Social media has become ubiquitous in modern society.' },
    ],
  };
}

function makeVocabReviewLog(): Record<string, unknown> {
  return {
    type: 'vocab-review-log',
    days: [
      { date: '2026-05-26', reviewed: 10, newWords: 5, correct: 7 },
      { date: '2026-05-27', reviewed: 12, newWords: 3, correct: 9 },
      { date: '2026-05-28', reviewed: 8, newWords: 4, correct: 5 },
      { date: '2026-05-30', reviewed: 15, newWords: 0, correct: 12 },
      { date: '2026-06-01', reviewed: 10, newWords: 4, correct: 8 },
    ],
  };
}

/* ── 夹具：Stats ── */
function makeStats(): Record<string, unknown> {
  return {
    version: '3.0.0',
    lastSnapshot: '2026-06-03T12:00:00.000Z',
    writing: {
      totalEssays: 5,
      averageScores: { tr: 6.3, cc: 6.2, lr: 6.3, gra: 5.9, overall: 6.2 },
      topErrors: [
        { category: 'grammar', count: 3 },
        { category: 'coherence', count: 3 },
        { category: 'task_response', count: 2 },
        { category: 'lexical', count: 2 },
        { category: 'spelling', count: 1 },
      ],
    },
    reading: {
      totalPassages: 3,
      averageCorrect: 8.3,
      averageBand: 6.0,
      topErrors: [
        { category: 'tfng_logic', count: 5 },
        { category: 'gap_fill', count: 4 },
        { category: 'matching', count: 2 },
        { category: 'heading', count: 1 },
        { category: 'true_false', count: 1 },
      ],
    },
    listening: {
      totalSections: 4,
      averageCorrect: 6.5,
      averageBand: 5.8,
      topErrors: [
        { category: 'inference', count: 5 },
        { category: 'distraction', count: 3 },
        { category: 'spelling', count: 3 },
        { category: 'number', count: 2 },
        { category: 'speed', count: 2 },
      ],
    },
    speaking: { totalPractices: 2, topicsCovered: 4 },
    vocab: { wordsReviewed: 55, retentionRate: 0.75 },
    combined: { overallBand: 6.0, daysUntilExam: 81 },
  };
}

/* ── 主入口 ── */
export function installFixtures(): void {
  /* 清理旧记录，确保幂等性 */
  const dirs = ['writing', 'reading', 'listening', 'speaking/stories', 'vocab', 'diagnosis'];
  for (const dir of dirs) {
    const p = join(BASE, dir);
    try { rmSync(p, { recursive: true, force: true }); } catch { /* 不存在 */ }
    mkdirSync(p, { recursive: true });
  }

  writeJson(join(BASE, 'profile.json'), makeProfile());
  writeJson(join(BASE, 'stats.json'), makeStats());

  /* Writing: date-based filenames with body content */
  makeWritingFixtures().forEach((rec) => {
    const date = (rec.createdAt as string).slice(0, 10);
    const slug = rec.taskType as string;
    writeFm(join(BASE, 'writing', `${date}-${slug}.md`), rec,
      `This is a sample IELTS Writing Task ${slug === 'task1' ? 1 : slug === 'task2' ? 2 : 'General Training Letter'} essay on the topic: "${rec.topic}".\n\n[Full essay text omitted for fixture brevity.]`);
  });

  /* Reading: date-based filenames */
  makeReadingFixtures().forEach((rec) => {
    const date = (rec.createdAt as string).slice(0, 10);
    const slug = (rec.passageTitle as string).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    writeFm(join(BASE, 'reading', `${date}-${slug}.md`), rec);
  });

  /* Listening: date-based filenames */
  makeListeningFixtures().forEach((rec) => {
    const date = (rec.createdAt as string).slice(0, 10);
    writeFm(join(BASE, 'listening', `${date}-section-${rec.section}.md`), rec);
  });

  /* Speaking: clean root dir + write topic groups + stories with body */
  try { rmSync(join(BASE, 'speaking', 'topic_groups.md'), { force: true }); } catch { /* ok */ }
  try { rmSync(join(BASE, 'speaking', 'topic-groups.md'), { force: true }); } catch { /* ok */ }
  writeFm(join(BASE, 'speaking', 'topic_groups.md'), makeSpeakingFixtures());
  makeSpeakingStories().forEach(rec => {
    const body = `I once decided to learn programming on my own. At first, it felt overwhelming — there were so many concepts to grasp. But I started with small projects, like building a simple calculator, and gradually moved to more complex applications. The key was consistency: I practiced for at least an hour every day. After six months, I could build a basic website. This experience taught me that any skill can be mastered with patience and persistent effort.`;
    writeFm(join(BASE, 'speaking', 'stories', `${rec.name}.md`), rec, body);
  });

  writeFm(join(BASE, 'vocab', 'wordlist.md'), makeVocabFixtures());
  writeFm(join(BASE, 'vocab', 'review_log.md'), makeVocabReviewLog());

  const w = makeWritingFixtures();
  const r = makeReadingFixtures();
  const l = makeListeningFixtures();
  const s = makeSpeakingStories();

  console.log(`Installed fixture dataset to ~/.ielts/`);
  console.log(`  Writing: ${w.length} essays`);
  console.log(`  Reading: ${r.length} passages`);
  console.log(`  Listening: ${l.length} sections`);
  console.log(`  Speaking: ${s.length} stories, 2 topic groups`);
  console.log(`  Vocab: 8 words`);
  console.log(`  Profile: target 7.0, exam 2026-08-23`);
}
