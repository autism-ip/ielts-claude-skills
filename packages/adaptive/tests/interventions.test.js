"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var interventions_js_1 = require("../src/interventions.js");
(0, vitest_1.describe)('Intervention Library', function () {
    (0, vitest_1.it)('returns all interventions by default', function () {
        (0, vitest_1.expect)((0, interventions_js_1.getInterventions)().length).toBeGreaterThan(20);
    });
    (0, vitest_1.it)('filters by errorTag', function () {
        var r = (0, interventions_js_1.getInterventions)('tfng_logic');
        (0, vitest_1.expect)(r.every(function (i) { return i.errorTag === 'tfng_logic'; })).toBe(true);
    });
    (0, vitest_1.it)('filters by module', function () {
        (0, vitest_1.expect)((0, interventions_js_1.getInterventions)(undefined, 'writing').every(function (i) { return i.module === 'writing'; })).toBe(true);
    });
    (0, vitest_1.it)('each has all required fields', function () {
        for (var _i = 0, _a = (0, interventions_js_1.getInterventions)(); _i < _a.length; _i++) {
            var i = _a[_i];
            (0, vitest_1.expect)(i.module).toBeTruthy();
            (0, vitest_1.expect)(i.errorTag).toBeTruthy();
            (0, vitest_1.expect)(i.taskType).toBeTruthy();
            (0, vitest_1.expect)(i.duration).toBeGreaterThan(0);
            (0, vitest_1.expect)(i.instructions).toBeTruthy();
            (0, vitest_1.expect)(i.successCriteria).toBeTruthy();
        }
    });
    (0, vitest_1.it)('covers all 5 modules', function () {
        (0, vitest_1.expect)((0, interventions_js_1.getAllModules)()).toHaveLength(5);
    });
    (0, vitest_1.it)('returns empty for unknown tag', function () {
        (0, vitest_1.expect)((0, interventions_js_1.getInterventions)('no-such-tag')).toHaveLength(0);
    });
});
