"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.planToday = planToday;
exports.planWeek = planWeek;
exports.planComplete = planComplete;
exports.planSkip = planSkip;
var scoring_js_1 = require("./scoring.js");
var interventions_js_1 = require("./interventions.js");
var c = 0;
function nid(p) { return "".concat(p, "-").concat(Date.now(), "-").concat(++c); }
function planToday(stats, profile) {
    var _a, _b, _c;
    var scores = (0, scoring_js_1.getAllScores)(['writing', 'reading', 'listening', 'speaking', 'vocab'], stats, profile);
    var goal = (_b = (_a = profile.preferences) === null || _a === void 0 ? void 0 : _a.dailyGoal) !== null && _b !== void 0 ? _b : 60;
    var tasks = [];
    var total = 0;
    var _loop_1 = function (s) {
        var tags = (((_c = stats[s.module]) === null || _c === void 0 ? void 0 : _c.topErrors) || []).map(function (e) { return e.category || e.errorCategory; });
        var ip = (0, interventions_js_1.getInterventions)(undefined, s.module);
        var match = tags.length ? ip.filter(function (i) { return tags.includes(i.errorTag); }) : ip;
        var picked = match.length ? match[0] : ip[0];
        if (!picked || total + picked.duration > goal)
            return "continue";
        tasks.push({ id: nid(s.module), module: s.module, taskType: picked.taskType, priorityScore: s.score, reason: s.reasons[0] || '', estimatedMinutes: picked.duration, status: 'todo' });
        total += picked.duration;
    };
    for (var _i = 0, scores_1 = scores; _i < scores_1.length; _i++) {
        var s = scores_1[_i];
        _loop_1(s);
    }
    return tasks;
}
function planWeek(stats, profile) { return planToday(stats, profile); }
function planComplete(_id) { }
function planSkip(_id) { }
