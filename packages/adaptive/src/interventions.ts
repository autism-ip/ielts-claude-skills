/**
 * [INPUT]: 依赖 @ielts/schemas 的类型定义
 * [OUTPUT]: 对外提供 Intervention 类型、getInterventions、getAllModules 函数
 * [POS]: packages/adaptive 的干预库，错误标签到训练任务的映射
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

export interface Intervention {
  module: string;
  errorTag: string;
  taskType: string;
  duration: number;
  instructions: string;
  successCriteria: string;
}

const CATALOG: Intervention[] = [
  { module: 'writing', errorTag: 'task_response', taskType: 'tr-drill', duration: 30, instructions: 'Write thesis + 2 supporting points for 3 Task 2 prompts', successCriteria: 'Each thesis addresses all prompt parts' },
  { module: 'writing', errorTag: 'coherence', taskType: 'cc-structure', duration: 20, instructions: 'Reorganize unordered essay into intro->BP1->BP2->conclusion', successCriteria: 'Each paragraph has clear topic sentence' },
  { module: 'writing', errorTag: 'lexical', taskType: 'lr-synonym', duration: 20, instructions: 'Replace 10 common words with academic synonyms', successCriteria: 'No repetition within paragraph' },
  { module: 'writing', errorTag: 'grammar', taskType: 'gra-gap-fill', duration: 20, instructions: 'Complete 10 sentences: SVA, articles, conditionals, clauses', successCriteria: '8/10 correct' },
  { module: 'writing', errorTag: 'spelling', taskType: 'spelling-drill', duration: 10, instructions: 'Spell 20 common IELTS words from dictation', successCriteria: '18/20 correct' },
  { module: 'reading', errorTag: 'tfng_logic', taskType: 'tfng-drill', duration: 25, instructions: 'Answer 10 T/F/NG with highlighted evidence', successCriteria: '8/10 correct' },
  { module: 'reading', errorTag: 'matching', taskType: 'matching-drill', duration: 20, instructions: 'Match 8 headings to paragraphs with keyword justification', successCriteria: '7/8 correct' },
  { module: 'reading', errorTag: 'gap_fill', taskType: 'gap-fill-strategy', duration: 15, instructions: 'Predict POS and word type for 10 gap-fills before scanning', successCriteria: '8/10 predicted correctly' },
  { module: 'reading', errorTag: 'heading', taskType: 'heading-write', duration: 20, instructions: 'Write 3-word summary heading per paragraph before choosing', successCriteria: '4/5 match correct option' },
  { module: 'reading', errorTag: 'time_pressure', taskType: 'speed-reading', duration: 20, instructions: 'Read passage in 3min, answer 8 questions without re-read', successCriteria: '6/8 correct' },
  { module: 'listening', errorTag: 'spelling', taskType: 'listen-spell', duration: 15, instructions: 'Transcribe 20 Section 1 words (names, addresses, dates)', successCriteria: '18/20 correct' },
  { module: 'listening', errorTag: 'number', taskType: 'number-dictation', duration: 10, instructions: 'Transcribe 15 number sequences from audio', successCriteria: '13/15 correct' },
  { module: 'listening', errorTag: 'distraction', taskType: 'distractor-id', duration: 25, instructions: 'Identify distractor + correct answer in 3 conversations', successCriteria: '80% distractor identified' },
  { module: 'listening', errorTag: 'speed', taskType: 'slow-down', duration: 20, instructions: 'Transcribe Section 3/4 at 0.75x, then at normal speed', successCriteria: '90% transcription accuracy' },
  { module: 'listening', errorTag: 'inference', taskType: 'inference-drill', duration: 20, instructions: 'Answer who/where/relationship/next from 5 dialogues', successCriteria: '4/5 inference sets correct' },
  { module: 'speaking', errorTag: 'fluency', taskType: 'fluency-drill', duration: 15, instructions: 'Speak 2 min non-stop on random topic', successCriteria: 'No pauses >3s' },
  { module: 'speaking', errorTag: 'lexical', taskType: 'lexical-variety', duration: 20, instructions: 'Describe photo using 10 topic-specific vocab items', successCriteria: '10+ terms used naturally' },
  { module: 'speaking', errorTag: 'grammar', taskType: 'grammar-structures', duration: 20, instructions: 'Answer 5 Part 3 questions using 5 specific structures', successCriteria: 'All 5 structures used' },
  { module: 'vocab', errorTag: 'retention', taskType: 'srs-review', duration: 10, instructions: 'Review 20 due SRS words with definition + new sentence', successCriteria: '18/20 recalled' },
  { module: 'vocab', errorTag: 'tier-gap', taskType: 'tier-drill', duration: 15, instructions: 'Write 8 tier-7/8 words in 3 grammatical forms each', successCriteria: '6/8 words correct' },
];

export function getInterventions(errorTag?: string, module?: string): Intervention[] {
  let r = CATALOG;
  if (errorTag) r = r.filter((i) => i.errorTag === errorTag);
  if (module) r = r.filter((i) => i.module === module);
  return r;
}

export function getAllModules(): string[] {
  return [...new Set(CATALOG.map((i) => i.module))];
}
