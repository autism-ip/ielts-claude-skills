"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var scoring_js_1 = require("../src/scoring.js");
function makeStats(overrides) {
    if (overrides === void 0) { overrides = {}; }
    return __assign({ version: '3.0.0', lastSnapshot: new Date().toISOString(), writing: { totalEssays: 5, averageBand: 6.2, topErrors: [{ category: 'grammar', count: 3 }, { category: 'coherence', count: 2 }] }, reading: { totalPassages: 3, averageBand: 6.0, topErrors: [{ category: 'tfng_logic', count: 5 }, { category: 'gap_fill', count: 3 }] }, listening: { totalSections: 4, averageBand: 5.8, topErrors: [{ category: 'inference', count: 4 }, { category: 'distraction', count: 3 }] }, speaking: { totalPractices: 2, topicsCovered: 4 }, vocab: { wordsReviewed: 55, retentionRate: 0.75 }, combined: { overallBand: 6.0, daysUntilExam: 78 } }, overrides);
}
function makeProfile(overrides) {
    if (overrides === void 0) { overrides = {}; }
    return __assign({ target: { overall: 7.0, writing: 6.5, reading: 7.5, listening: 8.0, speaking: 7.0 }, examDate: '2026-08-23', preferences: { dailyGoal: 90, focusAreas: ['writing', 'reading'] } }, overrides);
}
(0, vitest_1.describe)('computePriority', function () {
    (0, vitest_1.it)('returns deterministic score for writing', function () {
        var r = (0, scoring_js_1.computePriority)('writing', makeStats(), makeProfile());
        (0, vitest_1.expect)(r.module).toBe('writing');
        (0, vitest_1.expect)(r.score).toBeGreaterThanOrEqual(0);
        (0, vitest_1.expect)(r.score).toBeLessThanOrEqual(100);
        (0, vitest_1.expect)(r.reasons).toHaveLength(5);
    });
    (0, vitest_1.it)('higher score with larger target gap', function () {
        var big = (0, scoring_js_1.computePriority)('writing', makeStats({ writing: { totalEssays: 1, averageBand: 5, topErrors: [] } }), makeProfile());
        var small = (0, scoring_js_1.computePriority)('writing', makeStats({ writing: { totalEssays: 10, averageBand: 7, topErrors: [] } }), makeProfile());
        (0, vitest_1.expect)(big.score).toBeGreaterThan(small.score);
    });
    (0, vitest_1.it)('near exam scores higher than far exam', function () {
        var near = (0, scoring_js_1.computePriority)('reading', makeStats(), makeProfile({ examDate: new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10) }));
        var far = (0, scoring_js_1.computePriority)('reading', makeStats(), makeProfile({ examDate: new Date(Date.now() + 200 * 86400000).toISOString().slice(0, 10) }));
        (0, vitest_1.expect)(near.score).toBeGreaterThan(far.score);
    });
    (0, vitest_1.it)('works without exam date', function () {
        var r = (0, scoring_js_1.computePriority)('listening', makeStats(), makeProfile({ examDate: null }));
        (0, vitest_1.expect)(r.score).toBeGreaterThanOrEqual(0);
    });
    (0, vitest_1.it)('is deterministic', function () {
        var stats = makeStats();
        var profile = makeProfile();
        (0, vitest_1.expect)((0, scoring_js_1.computePriority)('vocab', stats, profile)).toEqual((0, scoring_js_1.computePriority)('vocab', stats, profile));
    });
});
(0, vitest_1.describe)('getAllScores', function () {
    (0, vitest_1.it)('scores all 5 modules descending', function () {
        var scores = (0, scoring_js_1.getAllScores)(['writing', 'reading', 'listening', 'speaking', 'vocab'], makeStats(), makeProfile());
        (0, vitest_1.expect)(scores).toHaveLength(5);
        (0, vitest_1.expect)(scores[0].score).toBeGreaterThanOrEqual(scores[1].score);
    });
});
