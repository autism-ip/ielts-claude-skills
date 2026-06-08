const C = [
    { module: 'writing', errorTag: 'task_response', taskType: 'tr-drill', duration: 30, instructions: 'Write thesis + supporting points for 3 prompts', successCriteria: 'Each thesis addresses all parts' },
    { module: 'writing', errorTag: 'coherence', taskType: 'cc-structure', duration: 20, instructions: 'Reorganize essay intro->BP1->BP2->conclusion', successCriteria: 'Each paragraph has topic sentence' },
    { module: 'writing', errorTag: 'coherence', taskType: 'cc-linking', duration: 15, instructions: 'Add linking words to gap-filled sentences', successCriteria: '80% correctly classified' },
    { module: 'writing', errorTag: 'lexical', taskType: 'lr-synonym', duration: 20, instructions: 'Replace 10 common words with academic synonyms', successCriteria: 'No repetition within paragraph' },
    { module: 'writing', errorTag: 'lexical', taskType: 'lr-collocation', duration: 15, instructions: 'Match and use 10 verb-noun collocations', successCriteria: '8/10 used correctly' },
    { module: 'writing', errorTag: 'grammar', taskType: 'gra-gap-fill', duration: 20, instructions: 'Complete sentences: SVA, articles, conditionals', successCriteria: '8/10 correct' },
    { module: 'writing', errorTag: 'grammar', taskType: 'gra-error-correction', duration: 15, instructions: 'Find and fix 10 grammar errors', successCriteria: '8/10 fixed' },
    { module: 'writing', errorTag: 'spelling', taskType: 'spelling-drill', duration: 10, instructions: 'Spell 20 common IELTS words', successCriteria: '18/20 correct' },
    { module: 'reading', errorTag: 'tfng_logic', taskType: 'tfng-drill', duration: 25, instructions: '10 T/F/NG with highlighted evidence', successCriteria: '8/10 correct' },
    { module: 'reading', errorTag: 'tfng_logic', taskType: 'tfng-paraphrase', duration: 20, instructions: 'Identify paraphrases in 10 statements', successCriteria: '90% identified' },
    { module: 'reading', errorTag: 'matching', taskType: 'matching-drill', duration: 20, instructions: 'Match 8 headings with keywords', successCriteria: '7/8 correct' },
    { module: 'reading', errorTag: 'gap_fill', taskType: 'gap-fill-strategy', duration: 15, instructions: 'Predict POS for 10 gap-fills', successCriteria: '8/10 predicted' },
    { module: 'reading', errorTag: 'heading', taskType: 'heading-write', duration: 20, instructions: 'Write 3-word summary per paragraph', successCriteria: '4/5 match answer' },
    { module: 'reading', errorTag: 'time_pressure', taskType: 'speed-reading', duration: 20, instructions: 'Read passage in 3min, answer 8 questions', successCriteria: '6/8 correct' },
    { module: 'listening', errorTag: 'spelling', taskType: 'listen-spell', duration: 15, instructions: 'Transcribe 20 Section 1 words', successCriteria: '18/20 correct' },
    { module: 'listening', errorTag: 'number', taskType: 'number-dictation', duration: 10, instructions: 'Transcribe 15 number sequences', successCriteria: '13/15 correct' },
    { module: 'listening', errorTag: 'distraction', taskType: 'distractor-id', duration: 25, instructions: 'Identify distractor + answer in 3 dialogs', successCriteria: '80% identified' },
    { module: 'listening', errorTag: 'speed', taskType: 'slow-down', duration: 20, instructions: 'Transcribe Section 3/4 at 0.75x', successCriteria: '90% accuracy' },
    { module: 'listening', errorTag: 'inference', taskType: 'inference-drill', duration: 20, instructions: 'Answer who/where/relationship from 5 dialogs', successCriteria: '4/5 correct' },
    { module: 'speaking', errorTag: 'fluency', taskType: 'fluency-drill', duration: 15, instructions: 'Speak 2 min non-stop', successCriteria: 'No pauses >3s' },
    { module: 'speaking', errorTag: 'lexical', taskType: 'lexical-variety', duration: 20, instructions: 'Describe photo with 10 topic-specific terms', successCriteria: '10+ terms used' },
    { module: 'speaking', errorTag: 'grammar', taskType: 'grammar-structures', duration: 20, instructions: 'Use 5 specific structures in Part 3', successCriteria: 'All 5 used' },
    { module: 'vocab', errorTag: 'retention', taskType: 'srs-review', duration: 10, instructions: 'Review 20 due SRS words', successCriteria: '18/20 recalled' },
    { module: 'vocab', errorTag: 'tier-gap', taskType: 'tier-drill', duration: 15, instructions: 'Write 8 tier-7/8 words in 3 forms each', successCriteria: '6/8 correct' },
    { module: 'vocab', errorTag: 'retention', taskType: 'active-recall', duration: 10, instructions: 'Recall word from definition, use in sentence', successCriteria: '8/10 correct' },
];
export function getInterventions(errorTag, module) {
    let r = C;
    if (errorTag)
        r = r.filter(i => i.errorTag === errorTag);
    if (module)
        r = r.filter(i => i.module === module);
    return [...r];
}
export function getAllModules() { return [...new Set(C.map(i => i.module))]; }
//# sourceMappingURL=interventions.js.map