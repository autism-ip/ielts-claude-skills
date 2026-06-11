import { readFileSync, readdirSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

const HOME = homedir();
const ROOT = join(HOME, '.ielts');
const OUT = join(process.cwd(), 'packages/dashboard/public/stats.json');

const read = (p) => { try { return readFileSync(p, 'utf-8') } catch { return null } };
const readJSON = (p) => { try { return JSON.parse(readFileSync(p, 'utf-8')) } catch { return null } };
const yf = (yaml, key) => { const m = yaml.match(new RegExp(`^\\s*${key}:\\s*(.+)`, 'm')); return m ? m[1].trim() : null };
const yn = (yaml, key) => { const v = yf(yaml, key); return v ? parseFloat(v) : 0 };
const dateFromName = (name) => { const m = name.match(/^(\d{4}-\d{2}-\d{2})/); return m ? m[1] : null };
const extractYAML = (content) => { const m = content.match(/^---\n([\s\S]*?)\n---/); return m ? m[1] : '' };

/** Parse multi-line list items from a specific YAML key section */
function yamlSectionList(yaml, sectionKey) {
  const items = [];
  const lines = yaml.split('\n');
  let inSection = false, inItem = false, current = {}, listIndent = 0;
  for (const line of lines) {
    if (line.match(new RegExp(`^${sectionKey}:`))) { inSection = true; continue; }
    if (!inSection) continue;
    // Detect the indentation level of list items: first line starting with "  - "
    if (!listIndent && line.match(/^\s+- /)) listIndent = line.search(/\S/);
    // Detect end of section — a line at the same root level as the section key
    if (listIndent > 0 && line.trim() && !line.startsWith(' ') && line.match(/^\w+:/)) break;
    if (line.match(/^\s+- /)) {
      if (inItem && Object.keys(current).length > 0) items.push(current);
      current = {}; inItem = true;
      const kv = line.trimStart().slice(2).match(/^(\w+):\s*(.+)/);
      if (kv) current[kv[1]] = kv[2].replace(/^["']|["']$/g, '');
    } else if (inItem && line.trimStart().match(/^\w+:/)) {
      const kv = line.trimStart().match(/^(\w+):\s*(.+)/);
      if (kv) current[kv[1]] = kv[2].replace(/^["']|["']$/g, '');
    }
  }
  if (inItem && Object.keys(current).length > 0) items.push(current);
  return items;
}

/** Parse simple synonym pairs from reading body content */
function extractSynonyms(content) {
  const syns = [];
  const lines = content.split('\n');
  let inSyn = false;
  for (const line of lines) {
    if (line.match(/同义替换词表|synonyms?:/i) && !inSyn) { inSyn = true; continue; }
    if (inSyn) {
      const m = line.match(/^\|\s*(.+?)\s*\|\s*(.+?)\s*\|/);
      if (m && !m[1].includes('题目用词')) syns.push({ from: m[1].trim(), to: m[2].trim() });
      if (line.trim() === '' && syns.length > 0) break;
    }
  }
  return syns;
}

/** Parse inline YAML array items (single-line: - key: val; key2: val2) */
function yamlInlineList(yaml, key) {
  const items = [];
  const lines = yaml.split('\n');
  let inList = false;
  for (const line of lines) {
    const trimmed = line.trimStart();
    if (trimmed.startsWith(`${key}:`)) { inList = true; continue; }
    if (inList) {
      if (trimmed.startsWith('- ')) {
        const obj = {};
        const parts = trimmed.slice(2).split(';');
        for (const p of parts) {
          const kv = p.match(/^\s*(\w+):\s*(.+)/);
          if (kv) obj[kv[1]] = kv[2].replace(/^["']|["']$/g, '').trim();
        }
        if (Object.keys(obj).length) items.push(obj);
      } else if (!trimmed.startsWith('  ') && !trimmed.startsWith('-')) { break; }
    }
  }
  return items;
}

function parseReadingMD(filePath) {
  const content = read(filePath);
  if (!content) return null;
  const y = extractYAML(content);
  if (!y) return null;
  const name = filePath.split('/').pop();
  const errors = yamlSectionList(y, 'errors');
  const allAnswers = yamlInlineList(y, 'answers');
  const synonyms = yamlInlineList(y, 'synonyms');
  return {
    date: dateFromName(name),
    type: 'reading',
    title: yf(y, 'passageTitle'),
    totalQuestions: yn(y, 'totalQuestions'),
    correctCount: yn(y, 'correctCount'),
    questionTypes: (yf(y, 'questionTypes') || '').replace(/[\[\]"]/g, '').split(',').filter(Boolean),
    errors: errors.map(e => ({ q: e.questionNumber, type: e.errorCategory, detail: e.detail })),
    answers: allAnswers.length > 0 ? allAnswers : undefined,
    synonyms: synonyms.length > 0 ? synonyms : undefined,
  };
}

function parseWritingMD(filePath) {
  const content = read(filePath);
  if (!content) return null;
  const y = extractYAML(content);
  if (!y) return null;
  const name = filePath.split('/').pop();
  const errors = yamlSectionList(y, 'errors');
  const highlights = yamlInlineList(y, 'rewriteHighlights');
  const priorities = yamlInlineList(y, 'upgradePriorities');
  return {
    date: dateFromName(name),
    type: 'writing',
    title: yf(y, 'taskType'),
    topic: yf(y, 'topic'),
    wordCount: yn(y, 'wordCount'),
    dimensions: { tr: yn(y, 'tr'), cc: yn(y, 'cc'), lr: yn(y, 'lr'), gra: yn(y, 'gra') },
    overall: yn(y, 'overall'),
    errors: errors.map(e => ({ q: e.location, type: e.category, severity: e.severity, detail: e.description })),
    rewriteHighlights: highlights.length > 0 ? highlights : undefined,
    upgradePriorities: priorities.length > 0 ? priorities.map(p => Object.values(p)[0] || p) : undefined,
  };
}

function parseListeningMD(filePath) {
  const content = read(filePath);
  if (!content) return null;
  const y = extractYAML(content);
  if (!y) return null;
  const name = filePath.split('/').pop();
  const questions = yamlInlineList(y, 'questions');
  const errors = yamlSectionList(y, 'errors');
  const files = yamlInlineList(y, 'archivedFiles');
  return {
    date: dateFromName(name),
    type: 'listening',
    book: yf(y, 'book'),
    test: yn(y, 'test'),
    totalQuestions: yn(y, 'totalQuestions'),
    correctCount: yn(y, 'correctCount'),
    sections: yf(y, 'sectionsCompleted'),
    sectionScores: { s1: yf(y, 'section1'), s2: yf(y, 'section2') },
    questions: questions.length > 0 ? questions.map(q => ({ q: q.q, text: q.text, options: q.options, user: q.user, correct: q.correct })) : undefined,
    errors: errors.map(e => ({ q: e.questionNumber, type: e.errorCategory, userAnswer: e.userAnswer, correctAnswer: e.correctAnswer, section: e.section, detail: e.detail })),
    archivedFiles: files.length > 0 ? files.map(f => Object.values(f)[0] || f) : undefined,
  };
}

function main() {
  const stats = readJSON(join(ROOT, 'stats.json')) || {};
  const profile = readJSON(join(ROOT, 'profile.json')) || {};
  const progress = readJSON(join(ROOT, 'materials/progress.json')) || {};
  const plan = readJSON(join(ROOT, 'plans/current.json')) || {};

  const allSessions = [];
  for (const dir of ['reading', 'writing', 'listening']) {
    const dirPath = join(ROOT, dir);
    if (!existsSync(dirPath)) continue;
    for (const file of readdirSync(dirPath)) {
      if (!file.endsWith('.md') || file === 'synonyms.md') continue;
      let session = null;
      if (dir === 'reading') session = parseReadingMD(join(dirPath, file));
      else if (dir === 'writing') session = parseWritingMD(join(dirPath, file));
      else if (dir === 'listening') session = parseListeningMD(join(dirPath, file));
      if (session && session.date) allSessions.push(session);
    }
  }
  allSessions.sort((a, b) => b.date.localeCompare(a.date));

  const daysMap = {};
  for (const s of allSessions) {
    if (!daysMap[s.date]) daysMap[s.date] = { date: s.date, sessions: 0, subjects: [] };
    daysMap[s.date].sessions++;
    if (!daysMap[s.date].subjects.includes(s.type)) daysMap[s.date].subjects.push(s.type);
  }
  const days = Object.values(daysMap).sort((a, b) => b.date.localeCompare(a.date));

  const trends = { reading: [], writing: [], listening: [] };
  const byType = { reading: [], writing: [], listening: [] };
  for (const s of allSessions) { if (byType[s.type]) byType[s.type].push(s); }
  for (const [type, sessions] of Object.entries(byType)) {
    sessions.sort((a, b) => a.date.localeCompare(b.date));
    for (const s of sessions) {
      if (type === 'writing') trends.writing.push({ date: s.date, band: s.overall, tr: s.dimensions?.tr, cc: s.dimensions?.cc, lr: s.dimensions?.lr, gra: s.dimensions?.gra });
      else if (type === 'reading' && s.totalQuestions > 0) trends.reading.push({ date: s.date, band: +(s.correctCount / s.totalQuestions * 9).toFixed(1), score: `${s.correctCount}/${s.totalQuestions}` });
      else if (type === 'listening' && s.totalQuestions > 0) trends.listening.push({ date: s.date, band: +(s.correctCount / s.totalQuestions * 9).toFixed(1), score: `${s.correctCount}/${s.totalQuestions}` });
    }
  }

  const examDates = profile.exam_dates || [];
  const daysUntilExam = examDates.length > 0 ? Math.max(0, Math.ceil((new Date(examDates[0] + '-30').getTime() - Date.now()) / 864e5)) : 0;

  const vocabWordlist = read(join(ROOT, 'vocab', 'wordlist.md'));
  const vocabReview = read(join(ROOT, 'vocab', 'review_log.md'));
  let vocabData = stats.vocab || { wordsReviewed: 0, newWords: 0, accuracy: '0%' };
  if (vocabReview) {
    const days = vocabReview.split('## Day');
    const latest = days[days.length - 1];
    const reviewed = latest.match(/reviewed:\s*(\d+)/);
    const correct = latest.match(/correct:\s*(\d+)/);
    const newWords = latest.match(/new:\s*(\d+)/);
    if (reviewed) vocabData.wordsReviewed = parseInt(reviewed[1]);
    if (correct && reviewed) vocabData.accuracy = `${Math.round(parseInt(correct[1]) / Math.max(parseInt(reviewed[1]), 1) * 100)}%`;
    if (newWords) vocabData.newWords = parseInt(newWords[1]);
    // Parse review log days for history
    const allDays = vocabReview.split('## Day').slice(1);
    vocabData.reviewHistory = allDays.map(block => {
      const header = block.match(/^(\d+):\s*([\d-]+)/);
      const reviewed = block.match(/reviewed:\s*(\d+)/);
      const correct = block.match(/correct:\s*(\d+)/);
      const accuracy = block.match(/accuracy:\s*(\d+%)/);
      const source = block.match(/source:\s*(.+)/);
      return {
        day: header ? parseInt(header[1]) : 0,
        date: header ? header[2] : '',
        reviewed: reviewed ? parseInt(reviewed[1]) : 0,
        correct: correct ? parseInt(correct[1]) : 0,
        accuracy: accuracy ? accuracy[1] : '',
        source: source ? source[1].trim() : '',
      };
    }).filter(d => d.reviewed > 0);
  }
  if (vocabWordlist) {
    const words = [...vocabWordlist.matchAll(/^\d+\.\s+\*\*(\w+)\*\*/gm)];
    vocabData.totalWords = words.length;
    // Get first 20 Band 6 words for display
    vocabData.sampleWords = words.slice(0, 20).map(m => m[1]);
  }

  const output = {
    version: '3.1.0',
    lastSnapshot: new Date().toISOString(),
    combined: {
      overallBand: stats.writing?.averageOverall || 0,
      daysUntilExam, targetBand: profile.target_band || 7.5,
      examDates, totalStudyDays: days.length,
      totalSessions: allSessions.length,
    },
    days, trends,
    history: allSessions,
    writing: { ...(stats.writing || { totalEssays: 0, averageBand: 0, dimensions: { tr: 0, cc: 0, lr: 0, gra: 0 } }), sessions: allSessions.filter(s => s.type === 'writing') },
    reading: { ...(stats.reading || { totalPassages: 0, averageBand: 0 }), sessions: allSessions.filter(s => s.type === 'reading') },
    listening: { ...(stats.listening || { totalSections: 0, averageBand: 0 }), sessions: allSessions.filter(s => s.type === 'listening') },
    vocab: vocabData,
    speaking: stats.speaking || { storiesPrepared: 0, status: 'pending' },
    todaySession: plan.tasks ? {
      tasksCompleted: plan.tasks.filter(t => t.status === 'done').length,
      tasksPending: plan.tasks.filter(t => t.status === 'todo').length,
      tasks: plan.tasks,
    } : null,
    profile: { targetBand: profile.target_band, examDates: profile.exam_dates },
  };

  writeFileSync(OUT, JSON.stringify(output, null, 2), 'utf-8');
  console.log(`✓ synced ${allSessions.length} sessions across ${days.length} days → ${OUT}`);
}

main();
