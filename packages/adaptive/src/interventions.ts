<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
/**
 * [INPUT]: 依赖 @ielts/schemas 的类型定义
<<<<<<< HEAD
 * [OUTPUT]: 对外提供 Intervention 类型、getInterventions 函数
 * [POS]: packages/adaptive 的干预库，错误标签 → 训练任务映射
=======
 * [OUTPUT]: 对外提供 Intervention 类型、getInterventions、getAllModules 函数
 * [POS]: packages/adaptive 的干预库，错误标签到训练任务的映射
>>>>>>> origin/feat/gh-46-adaptive-plan-schema
=======
/**
 * [INPUT]: 依赖 @ielts/schemas
 * [OUTPUT]: 对外提供 Intervention 类型、getInterventions、getAllModules
 * [POS]: packages/adaptive 的干预库，写作/阅读/听力/口语/词汇错误标签→训练任务
>>>>>>> origin/feat/gh-48-intervention-library
=======
=======
>>>>>>> origin/feat/gh-51-dashboard-plan
=======
>>>>>>> origin/feat/gh-53-feishu-auth
=======
>>>>>>> origin/feat/gh-54-feishu-client
=======
>>>>>>> origin/feat/gh-55-feishu-mappers
=======
>>>>>>> origin/feat/gh-56-sync-state
=======
>>>>>>> origin/feat/gh-57-cloud-cli
/**
 * [INPUT]: 依赖 @ielts/schemas 的类型定义
 * [OUTPUT]: 对外提供 Intervention 类型、getInterventions、getAllModules 函数
 * [POS]: packages/adaptive 的干预库，错误标签到训练任务的映射
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> origin/feat/gh-50-plan-complete-skip
=======
>>>>>>> origin/feat/gh-51-dashboard-plan
=======
>>>>>>> origin/feat/gh-53-feishu-auth
=======
>>>>>>> origin/feat/gh-54-feishu-client
=======
>>>>>>> origin/feat/gh-55-feishu-mappers
=======
>>>>>>> origin/feat/gh-56-sync-state
=======
>>>>>>> origin/feat/gh-57-cloud-cli
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

export interface Intervention {
  module: string;
  errorTag: string;
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
  taskType: string;
>>>>>>> origin/feat/gh-46-adaptive-plan-schema
=======
  taskType: string;
>>>>>>> origin/feat/gh-48-intervention-library
=======
  taskType: string;
>>>>>>> origin/feat/gh-50-plan-complete-skip
=======
  taskType: string;
>>>>>>> origin/feat/gh-51-dashboard-plan
=======
  taskType: string;
>>>>>>> origin/feat/gh-53-feishu-auth
=======
  taskType: string;
>>>>>>> origin/feat/gh-54-feishu-client
=======
  taskType: string;
>>>>>>> origin/feat/gh-55-feishu-mappers
=======
  taskType: string;
>>>>>>> origin/feat/gh-56-sync-state
=======
  taskType: string;
>>>>>>> origin/feat/gh-57-cloud-cli
  duration: number;
  instructions: string;
  successCriteria: string;
}

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
const INTERVENTIONS: Intervention[] = [];

export function getInterventions(errorTag?: string): Intervention[] {
  if (errorTag) return INTERVENTIONS.filter(i => i.errorTag === errorTag);
  return [...INTERVENTIONS];
=======
=======
>>>>>>> origin/feat/gh-50-plan-complete-skip
=======
>>>>>>> origin/feat/gh-51-dashboard-plan
=======
>>>>>>> origin/feat/gh-53-feishu-auth
=======
>>>>>>> origin/feat/gh-54-feishu-client
=======
>>>>>>> origin/feat/gh-55-feishu-mappers
=======
>>>>>>> origin/feat/gh-56-sync-state
=======
>>>>>>> origin/feat/gh-57-cloud-cli
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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> origin/feat/gh-46-adaptive-plan-schema
=======
export interface Intervention { module: string; errorTag: string; duration: number; instructions: string; successCriteria: string; }
const LIST: Intervention[] = [];
export function getInterventions(errorTag?: string): Intervention[] {
  return errorTag ? LIST.filter(i => i.errorTag === errorTag) : LIST;
>>>>>>> origin/feat/gh-47-priority-scoring
=======
const CATALOG: Intervention[] = [
  /* ── Writing ── */
  { module: 'writing', errorTag: 'task_response', taskType: 'tr-drill', duration: 30,
    instructions: 'Read 3 Task 2 prompts and write topic-specific thesis + 2 supporting points for each',
    successCriteria: 'Each thesis directly addresses all parts of the prompt' },
  { module: 'writing', errorTag: 'task_response', taskType: 'task1-data-select', duration: 25,
    instructions: 'Given 3 Task 1 charts, identify the single most important trend, highest value, and lowest value before writing overview',
    successCriteria: 'Overview sentences contain comparison of max/min/trend in <2 sentences' },
  { module: 'writing', errorTag: 'coherence', taskType: 'cc-structure', duration: 20,
    instructions: 'Take an unstructured essay and reorganize it into: intro → BP1 (topic+explain+example) → BP2 → conclusion',
    successCriteria: 'Each paragraph has clear topic sentence + supporting detail + link to next' },
  { module: 'writing', errorTag: 'coherence', taskType: 'cc-linking', duration: 15,
    instructions: 'Add appropriate linking words to 5 gap-filled sentences. Mark each link as additive/contrastive/causal/sequential',
    successCriteria: '80%+ linking words correctly classified by function' },
  { module: 'writing', errorTag: 'lexical', taskType: 'lr-synonym', duration: 20,
    instructions: 'Replace 10 common words (important, good, bad, big, small, many, thing, people, problem, change) in essay context with academic synonyms',
    successCriteria: 'No word repeated within the same paragraph' },
  { module: 'writing', errorTag: 'lexical', taskType: 'lr-collocation', duration: 15,
    instructions: 'Match 10 verb-noun collocations (e.g., pose a threat, hold a view, draw a conclusion) and use each in a sentence',
    successCriteria: '8/10 collocations used correctly in context' },
  { module: 'writing', errorTag: 'grammar', taskType: 'gra-gap-fill', duration: 20,
    instructions: 'Complete 10 sentences by choosing the correct tense/form: subject-verb agreement, articles, conditionals, relative clauses',
    successCriteria: '8/10 correct' },
  { module: 'writing', errorTag: 'grammar', taskType: 'gra-error-correction', duration: 15,
    instructions: 'Find and correct 10 grammatical errors in a sample essay (article misuse, tense shift, subject-verb disagreement)',
    successCriteria: '8/10 errors correctly identified and fixed' },
  { module: 'writing', errorTag: 'spelling', taskType: 'spelling-drill', duration: 10,
    instructions: 'Write the correct spelling of 20 commonly misspelled IELTS words (accommodation, government, environment, etc.) from audio dictation',
    successCriteria: '18/20 correct' },

  /* ── Reading ── */
  { module: 'reading', errorTag: 'tfng_logic', taskType: 'tfng-drill', duration: 25,
    instructions: 'Read 3 passages with 10 T/F/NG questions. For each answer, highlight the exact sentence in the passage that supports TRUE/FALSE, or mark NOT GIVEN with reasoning',
    successCriteria: '8/10 correct with supporting evidence highlighted' },
  { module: 'reading', errorTag: 'tfng_logic', taskType: 'tfng-paraphrase', duration: 20,
    instructions: 'For 10 T/F/NG statements, underline the paraphrased key terms in both the statement and passage. Classify each as identical/paraphrased/not mentioned',
    successCriteria: '90% paraphrases correctly identified' },
  { module: 'reading', errorTag: 'matching', taskType: 'matching-drill', duration: 20,
    instructions: 'Match 8 headings to paragraphs. For each, write 1-2 keywords from the paragraph that justify your choice',
    successCriteria: '7/8 headings correctly matched' },
  { module: 'reading', errorTag: 'gap_fill', taskType: 'gap-fill-strategy', duration: 15,
    instructions: 'For 10 gap-fill questions: identify the part of speech needed, predict the word type (noun/verb/adj/adv), then scan for the answer',
    successCriteria: '8/10 predicted successfully before scanning' },
  { module: 'reading', errorTag: 'heading', taskType: 'heading-matching', duration: 20,
    instructions: 'Read a 5-paragraph passage. Write a 3-word summary heading for each paragraph BEFORE looking at the options',
    successCriteria: '4/5 self-written headings match the correct option' },
  { module: 'reading', errorTag: 'true_false', taskType: 'tf-identification', duration: 15,
    instructions: 'Given 8 statements with a passage, classify each and identify whether the test is fact/opinion/claim vs passage claim',
    successCriteria: '7/8 correctly classified' },
  { module: 'reading', errorTag: 'time_pressure', taskType: 'speed-reading', duration: 20,
    instructions: 'Read a passage in 3min (vs normal 5-7min). Answer 8 questions without re-reading. Then verify with re-read',
    successCriteria: '6/8 correct after speed pass' },

  /* ── Listening ── */
  { module: 'listening', errorTag: 'spelling', taskType: 'listening-spelling', duration: 15,
    instructions: 'Listen to 20 Section 1 common words (names, addresses, dates) and write them down. Check spelling against answer key',
    successCriteria: '18/20 correctly spelled' },
  { module: 'listening', errorTag: 'number', taskType: 'number-dictation', duration: 10,
    instructions: 'Listen to 15 number sequences (phone, price, date, time, postcode, measurements) and transcribe',
    successCriteria: '13/15 numbers correct' },
  { module: 'listening', errorTag: 'distraction', taskType: 'distractor-id', duration: 25,
    instructions: 'Listen to 3 conversations with built-in distractors (speaker corrects themselves, multiple options mentioned, negatives). Write BOTH the distractor and the final correct answer',
    successCriteria: 'Identify distractor in 80% of questions with distractor present' },
  { module: 'listening', errorTag: 'speed', taskType: 'slow-down-practice', duration: 20,
    instructions: 'Listen to a Section 3/4 passage at 0.75x speed. Transcribe. Then listen at normal speed and note what you missed',
    successCriteria: '90% transcription accuracy at 0.75x' },
  { module: 'listening', errorTag: 'inference', taskType: 'inference-drill', duration: 20,
    instructions: 'Listen to 5 short dialogues. For each, answer: who is speaking, where are they, what is their relationship, and what will happen next',
    successCriteria: '4/5 inference sets correct' },

  /* ── Speaking ── */
  { module: 'speaking', errorTag: 'fluency', taskType: 'fluency-drill', duration: 15,
    instructions: 'Speak for 2 minutes without stopping on a random topic. Use filler phrases (well, you know, actually) if needed to maintain flow',
    successCriteria: 'No pauses >3 seconds during the 2-minute monologue' },
  { module: 'speaking', errorTag: 'lexical', taskType: 'lexical-variety', duration: 20,
    instructions: 'Describe a photo using at least 10 topic-specific vocabulary items from the environment/education/technology word bank',
    successCriteria: '10+ topic-specific terms used naturally' },
  { module: 'speaking', errorTag: 'grammar', taskType: 'grammar-structures', duration: 20,
    instructions: 'Answer 5 Part 3 questions using specified structures: conditional (1 question), passive (1), relative clause (1), comparison (1), perfect tense (1)',
    successCriteria: 'All 5 structure types used correctly' },

  /* ── Vocab ── */
  { module: 'vocab', errorTag: 'retention', taskType: 'srs-review', duration: 10,
    instructions: 'Review 20 due words from SRS queue. For each: recall definition, read example sentence, create new sentence',
    successCriteria: '18/20 definitions correctly recalled' },
  { module: 'vocab', errorTag: 'tier-gap', taskType: 'tier-drill', duration: 15,
    instructions: 'Study 10 tier-7/8 words from the wordlist. Write each in 3 different grammatical forms (e.g., noun, verb, adjective) with example sentences',
    successCriteria: '8/10 words used in 3 correct grammatical forms each' },
  { module: 'vocab', errorTag: 'retention', taskType: 'active-recall', duration: 10,
    instructions: 'Given 10 definitions, recall the target word. Then use it in an IELTS-relevant sentence',
    successCriteria: '8/10 words correctly recalled and used' },
];

export function getInterventions(errorTag?: string, module?: string): Intervention[] {
  let result = CATALOG;
  if (errorTag) result = result.filter(i => i.errorTag === errorTag);
  if (module) result = result.filter(i => i.module === module);
  return [...result];
}

export function getAllModules(): string[] {
  return [...new Set(CATALOG.map(i => i.module))];
>>>>>>> origin/feat/gh-48-intervention-library
}
=======
export interface Intervention { module: string; errorTag: string; taskType: string; duration: number; instructions: string; successCriteria: string; }

const C: Intervention[] = [
  {module:'writing',errorTag:'task_response',taskType:'tr-drill',duration:30,instructions:'Write thesis + 2 supporting points for 3 Task 2 prompts',successCriteria:'Each thesis addresses all prompt parts'},
  {module:'writing',errorTag:'coherence',taskType:'cc-structure',duration:20,instructions:'Reorganize unordered essay into intro→BP1→BP2→conclusion',successCriteria:'Each paragraph has clear topic sentence'},
  {module:'writing',errorTag:'lexical',taskType:'lr-synonym',duration:20,instructions:'Replace 10 common words with academic synonyms',successCriteria:'No repetition within paragraph'},
  {module:'writing',errorTag:'grammar',taskType:'gra-gap-fill',duration:20,instructions:'Complete 10 sentences: SVA, articles, conditionals, clauses',successCriteria:'8/10 correct'},
  {module:'writing',errorTag:'spelling',taskType:'spelling-drill',duration:10,instructions:'Spell 20 common IELTS words from dictation',successCriteria:'18/20 correct'},
  {module:'reading',errorTag:'tfng_logic',taskType:'tfng-drill',duration:25,instructions:'Answer 10 T/F/NG with highlighted evidence',successCriteria:'8/10 correct'},
  {module:'reading',errorTag:'matching',taskType:'matching-drill',duration:20,instructions:'Match 8 headings to paragraphs with keyword justification',successCriteria:'7/8 correct'},
  {module:'reading',errorTag:'gap_fill',taskType:'gap-fill-strategy',duration:15,instructions:'Predict POS and word type for 10 gap-fills before scanning',successCriteria:'8/10 predicted correctly'},
  {module:'reading',errorTag:'heading',taskType:'heading-write',duration:20,instructions:'Write 3-word summary heading per paragraph before choosing',successCriteria:'4/5 match correct option'},
  {module:'reading',errorTag:'time_pressure',taskType:'speed-reading',duration:20,instructions:'Read passage in 3min, answer 8 questions without re-read',successCriteria:'6/8 correct'},
  {module:'listening',errorTag:'spelling',taskType:'listen-spell',duration:15,instructions:'Transcribe 20 Section 1 words (names, addresses, dates)',successCriteria:'18/20 correct'},
  {module:'listening',errorTag:'number',taskType:'number-dictation',duration:10,instructions:'Transcribe 15 number sequences from audio',successCriteria:'13/15 correct'},
  {module:'listening',errorTag:'distraction',taskType:'distractor-id',duration:25,instructions:'Identify distractor + correct answer in 3 conversations',successCriteria:'80% distractor identified'},
  {module:'listening',errorTag:'speed',taskType:'slow-down',duration:20,instructions:'Transcribe Section 3/4 at 0.75x, then at normal speed',successCriteria:'90% transcription accuracy'},
  {module:'listening',errorTag:'inference',taskType:'inference-drill',duration:20,instructions:'Answer who/where/relationship/next from 5 dialogues',successCriteria:'4/5 inference sets correct'},
  {module:'speaking',errorTag:'fluency',taskType:'fluency-drill',duration:15,instructions:'Speak 2 min non-stop on random topic',successCriteria:'No pauses >3s'},
  {module:'speaking',errorTag:'lexical',taskType:'lexical-variety',duration:20,instructions:'Describe photo using 10 topic-specific vocab items',successCriteria:'10+ terms used naturally'},
  {module:'speaking',errorTag:'grammar',taskType:'grammar-structures',duration:20,instructions:'Answer 5 Part 3 questions using 5 specific structures',successCriteria:'All 5 structures used'},
  {module:'vocab',errorTag:'retention',taskType:'srs-review',duration:10,instructions:'Review 20 due SRS words with definition + new sentence',successCriteria:'18/20 recalled'},
  {module:'vocab',errorTag:'tier-gap',taskType:'tier-drill',duration:15,instructions:'Write 8 tier-7/8 words in 3 grammatical forms each',successCriteria:'6/8 words correct'},
];

export function getInterventions(errorTag?: string, module?: string): Intervention[] {
  let r = C; if (errorTag) r = r.filter(i => i.errorTag === errorTag); if (module) r = r.filter(i => i.module === module); return r;
}
export function getAllModules(): string[] { return [...new Set(C.map(i => i.module))]; }
>>>>>>> origin/feat/gh-49-plan-cli
=======
}
>>>>>>> origin/feat/gh-50-plan-complete-skip
=======
}
>>>>>>> origin/feat/gh-51-dashboard-plan
=======
}
>>>>>>> origin/feat/gh-53-feishu-auth
=======
}
>>>>>>> origin/feat/gh-54-feishu-client
=======
}
>>>>>>> origin/feat/gh-55-feishu-mappers
=======
}
>>>>>>> origin/feat/gh-56-sync-state
=======
}
>>>>>>> origin/feat/gh-57-cloud-cli
