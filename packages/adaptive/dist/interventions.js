const C = [
    /* writing */
    { module: 'writing', errorTag: 'task_response', taskType: 'tr-drill', duration: 30, instructions: 'Write thesis + 2 supporting points for 3 Task 2 prompts', successCriteria: 'Each thesis addresses all prompt parts' },
    { module: 'writing', errorTag: 'grammar', taskType: 'gra-gap-fill', duration: 20, instructions: 'Complete 10 sentences: SVA, articles, conditionals', successCriteria: '8/10 correct' },
    { module: 'writing', errorTag: 'coherence', taskType: 'cc-logic', duration: 25, instructions: 'Reorder 3 jumbled paragraphs and label cohesion devices', successCriteria: 'All paragraphs in correct order' },
    { module: 'writing', errorTag: 'lexical', taskType: 'lx-upgrade', duration: 20, instructions: 'Replace 10 basic words with academic synonyms', successCriteria: '8/10 appropriate replacements' },
    /* reading */
    { module: 'reading', errorTag: 'tfng_logic', taskType: 'tfng-drill', duration: 25, instructions: 'Answer 10 T/F/NG with highlighted evidence', successCriteria: '8/10 correct' },
    { module: 'reading', errorTag: 'gap_fill', taskType: 'gap-fill', duration: 15, instructions: 'Predict POS and type for 10 gap-fills', successCriteria: '8/10 predicted' },
    { module: 'reading', errorTag: 'matching', taskType: 'match-heading', duration: 20, instructions: 'Match 7 headings to paragraphs with keyword evidence', successCriteria: '6/7 correct' },
    { module: 'reading', errorTag: 'heading', taskType: 'heading-predict', duration: 20, instructions: 'Predict heading before reading each paragraph', successCriteria: '5/7 correct' },
    /* listening */
    { module: 'listening', errorTag: 'spelling', taskType: 'listen-spell', duration: 15, instructions: 'Transcribe 20 Section 1 words', successCriteria: '18/20 correct' },
    { module: 'listening', errorTag: 'distraction', taskType: 'distractor-id', duration: 25, instructions: 'Identify distractor + correct answer from 5 dialogues', successCriteria: '80% identified' },
    { module: 'listening', errorTag: 'number', taskType: 'number-dictation', duration: 15, instructions: 'Dictate 15 number sequences (phone, date, price)', successCriteria: '13/15 correct' },
    { module: 'listening', errorTag: 'speed', taskType: 'speed-adaptive', duration: 20, instructions: 'Transcribe 2 passages at 1.25x speed', successCriteria: '70% word accuracy' },
    { module: 'listening', errorTag: 'inference', taskType: 'inference-map', duration: 20, instructions: 'Answer 8 inference questions with speaker attitude labels', successCriteria: '6/8 correct' },
    /* speaking */
    { module: 'speaking', errorTag: 'fluency', taskType: 'fluency-drill', duration: 15, instructions: 'Speak 2 min non-stop on a random topic', successCriteria: 'No pauses >3s' },
    { module: 'speaking', errorTag: 'lexical', taskType: 'speak-bank', duration: 20, instructions: 'Practice 10 topic-specific lexical items in full sentences', successCriteria: '8/10 used accurately' },
    { module: 'speaking', errorTag: 'grammar', taskType: 'speak-self-correct', duration: 20, instructions: 'Record 3 answers then self-correct grammar errors', successCriteria: '90% of errors identified' },
    { module: 'speaking', errorTag: 'pronunciation', taskType: 'pronounce-drill', duration: 15, instructions: 'Shadow 5 native sentences focusing on stress and intonation', successCriteria: '4/5 with accurate stress' },
    /* vocab */
    { module: 'vocab', errorTag: 'retention', taskType: 'srs-review', duration: 10, instructions: 'Review 20 due SRS words', successCriteria: '18/20 recalled' },
    { module: 'vocab', errorTag: 'tier-gap', taskType: 'tier-drill', duration: 15, instructions: 'Replace 10 basic words with tier-2 academic alternatives', successCriteria: '8/10 appropriate' },
    { module: 'vocab', errorTag: 'collocation', taskType: 'collo-build', duration: 15, instructions: 'Complete 15 adjective-noun and verb-noun collocations', successCriteria: '12/15 correct' },
];
export function getInterventions(errorTag, module) {
    let r = CATALOG;
    if (errorTag)
        r = r.filter((i) => i.errorTag === errorTag);
    if (module)
        r = r.filter((i) => i.module === module);
    return r;
}
export function getAllModules() {
    return [...new Set(CATALOG.map((i) => i.module))];
}
//# sourceMappingURL=interventions.js.map