"use strict";
/**
 * [INPUT]: 依赖 @ielts/schemas 的 Stats/Profile 类型
 * [OUTPUT]: 对外提供 PriorityFactor 类型、computePriority、getAllScores 函数
 * [POS]: packages/adaptive 的评分引擎，纯函数，无副作用
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.computePriority = computePriority;
exports.getAllScores = getAllScores;
var FACTORS = [
    {
        name: 'target-gap', weight: 0.35,
        score: function (s, p) { var _a, _b, _c, _d, _e; var tgt = (_b = (_a = p.target) === null || _a === void 0 ? void 0 : _a.writing) !== null && _b !== void 0 ? _b : 0; var cur = (_e = (_d = (_c = s.writing) === null || _c === void 0 ? void 0 : _c.averageScores) === null || _d === void 0 ? void 0 : _d.overall) !== null && _e !== void 0 ? _e : 0; return tgt > 0 ? Math.min(100, (tgt - cur) * 25) : 0; },
        reason: function (s, p) { var _a, _b, _c, _d, _e; return "gap ".concat((((_b = (_a = p.target) === null || _a === void 0 ? void 0 : _a.writing) !== null && _b !== void 0 ? _b : 0) - ((_e = (_d = (_c = s.writing) === null || _c === void 0 ? void 0 : _c.averageScores) === null || _d === void 0 ? void 0 : _d.overall) !== null && _e !== void 0 ? _e : 0)).toFixed(1)); },
    },
    {
        name: 'error-rate', weight: 0.25,
        score: function (s) { var _a, _b; var t = 0; for (var _i = 0, _c = ['writing', 'reading', 'listening']; _i < _c.length; _i++) {
            var m = _c[_i];
            t += ((_b = (_a = s[m]) === null || _a === void 0 ? void 0 : _a.topErrors) !== null && _b !== void 0 ? _b : []).reduce(function (a, e) { return a + e.count; }, 0);
        } return Math.min(100, t * 6); },
        reason: function (s) { return "errors ".concat(['writing', 'reading', 'listening'].map(function (m) { var _a, _b; return ((_b = (_a = s[m]) === null || _a === void 0 ? void 0 : _a.topErrors) !== null && _b !== void 0 ? _b : []).reduce(function (a, e) { return a + e.count; }, 0); }).join('/')); },
    },
    {
        name: 'recency', weight: 0.15,
        score: function (s) { return s.lastSnapshot ? Math.max(0, 100 - Math.round((Date.now() - new Date(s.lastSnapshot).getTime()) / 86400000) * 5) : 50; },
        reason: function (s) { return s.lastSnapshot ? "".concat(Math.round((Date.now() - new Date(s.lastSnapshot).getTime()) / 86400000), "d ago") : 'no snapshot'; },
    },
    {
        name: 'exam-urgency', weight: 0.15,
        score: function (_s, p) { if (!p.examDate)
            return 20; var d = Math.max(0, Math.ceil((new Date(p.examDate).getTime() - Date.now()) / 86400000)); return d <= 7 ? 100 : d <= 30 ? 80 : d <= 60 ? 50 : d <= 90 ? 30 : 10; },
        reason: function (_s, p) { return p.examDate ? "".concat(Math.max(0, Math.ceil((new Date(p.examDate).getTime() - Date.now()) / 86400000)), "d left") : 'no exam date'; },
    },
    {
        name: 'srs-due', weight: 0.1,
        score: function (s) { var _a, _b, _c; return ((_a = s.vocab) === null || _a === void 0 ? void 0 : _a.wordsReviewed) > 0 ? Math.min(100, Math.max(0, (1 - ((_c = (_b = s.vocab) === null || _b === void 0 ? void 0 : _b.retentionRate) !== null && _c !== void 0 ? _c : 0)) * 100)) : 30; },
        reason: function (s) { var _a, _b; return "".concat((_b = (_a = s.vocab) === null || _a === void 0 ? void 0 : _a.wordsReviewed) !== null && _b !== void 0 ? _b : 0, " words reviewed"); },
    },
];
function computePriority(module, stats, profile) {
    var total = 0;
    var reasons = [];
    for (var _i = 0, FACTORS_1 = FACTORS; _i < FACTORS_1.length; _i++) {
        var f = FACTORS_1[_i];
        var s = f.score(stats, profile) * f.weight;
        total += s;
        reasons.push("".concat(f.name, ": ").concat(s.toFixed(1)));
    }
    return { module: module, score: Math.min(100, Math.max(0, Math.round(total))), reasons: reasons };
}
function getAllScores(modules, stats, profile) {
    return modules.map(function (m) { return computePriority(m, stats, profile); }).sort(function (a, b) { return b.score - a.score; });
}
