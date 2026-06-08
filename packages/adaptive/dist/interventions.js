const C = [
    { module: 'writing', errorTag: 'task_response', taskType: 'tr-drill', duration: 30, instructions: 'Write thesis + 2 supporting points for 3 Task 2 prompts', successCriteria: 'Each thesis addresses all prompt parts' },
    { module: 'writing', errorTag: 'grammar', taskType: 'gra-gap-fill', duration: 20, instructions: 'Complete 10 sentences: SVA, articles, conditionals', successCriteria: '8/10 correct' },
    { module: 'reading', errorTag: 'tfng_logic', taskType: 'tfng-drill', duration: 25, instructions: 'Answer 10 T/F/NG with highlighted evidence', successCriteria: '8/10 correct' },
    { module: 'reading', errorTag: 'gap_fill', taskType: 'gap-fill', duration: 15, instructions: 'Predict POS and type for 10 gap-fills', successCriteria: '8/10 predicted' },
    { module: 'listening', errorTag: 'spelling', taskType: 'listen-spell', duration: 15, instructions: 'Transcribe 20 Section 1 words', successCriteria: '18/20 correct' },
    { module: 'listening', errorTag: 'distraction', taskType: 'distractor-id', duration: 25, instructions: 'Identify distractor + correct answer', successCriteria: '80% identified' },
    { module: 'speaking', errorTag: 'fluency', taskType: 'fluency-drill', duration: 15, instructions: 'Speak 2 min non-stop', successCriteria: 'No pauses >3s' },
    { module: 'vocab', errorTag: 'retention', taskType: 'srs-review', duration: 10, instructions: 'Review 20 due SRS words', successCriteria: '18/20 recalled' },
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