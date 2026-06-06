/**
 * [INPUT]: 依赖 @ielts/schemas
 * [OUTPUT]: 对外提供 Intervention 类型、getInterventions、getAllModules
 * [POS]: packages/adaptive 的干预库，写作/阅读/听力/口语/词汇错误标签→训练任务
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
const CATALOG = [
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
export function getInterventions(errorTag, module) {
    let result = CATALOG;
    if (errorTag)
        result = result.filter(i => i.errorTag === errorTag);
    if (module)
        result = result.filter(i => i.module === module);
    return [...result];
}
export function getAllModules() {
    return [...new Set(CATALOG.map(i => i.module))];
}
//# sourceMappingURL=interventions.js.map