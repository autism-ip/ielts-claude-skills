"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var scheduler_js_1 = require("../src/scheduler.js");
function ms() { return { lastSnapshot: new Date().toISOString(), writing: { totalEssays: 5, averageScores: { overall: 6.2 }, topErrors: [{ category: 'grammar', count: 3 }] }, reading: { totalPassages: 3, averageBand: 6.0, topErrors: [{ category: 'tfng_logic', count: 5 }] }, listening: { totalSections: 4, averageBand: 5.8, topErrors: [{ category: 'inference', count: 4 }] }, speaking: { totalPractices: 2 }, vocab: { wordsReviewed: 55, retentionRate: 0.75 }, combined: { overallBand: 6.0 } }; }
function mp() { return { target: { overall: 7.0, writing: 6.5 }, examDate: '2026-08-23', preferences: { dailyGoal: 90 } }; }
(0, vitest_1.describe)('planToday', function () {
    (0, vitest_1.it)('returns tasks with required fields', function () { for (var _i = 0, _a = (0, scheduler_js_1.planToday)(ms(), mp()); _i < _a.length; _i++) {
        var t = _a[_i];
        (0, vitest_1.expect)(t.id).toBeTruthy();
        (0, vitest_1.expect)(t.module).toBeTruthy();
        (0, vitest_1.expect)(t.taskType).toBeTruthy();
        (0, vitest_1.expect)(t.priorityScore).toBeGreaterThanOrEqual(0);
        (0, vitest_1.expect)(t.estimatedMinutes).toBeGreaterThan(0);
        (0, vitest_1.expect)(t.status).toBe('todo');
    } });
    (0, vitest_1.it)('respects dailyGoal', function () { (0, vitest_1.expect)((0, scheduler_js_1.planToday)(ms(), mp()).reduce(function (s, t) { return s + t.estimatedMinutes; }, 0)).toBeLessThanOrEqual(90); });
    (0, vitest_1.it)('handles empty data', function () { (0, vitest_1.expect)(Array.isArray((0, scheduler_js_1.planToday)({}, {}))).toBe(true); });
});
(0, vitest_1.describe)('planWeek', function () { (0, vitest_1.it)('returns tasks', function () { (0, vitest_1.expect)((0, scheduler_js_1.planWeek)(ms(), mp()).length).toBeGreaterThan(0); }); });
