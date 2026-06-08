"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.planComplete = planComplete;
exports.planSkip = planSkip;
var node_fs_1 = require("node:fs");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var P = (0, node_path_1.join)((0, node_os_1.homedir)(), ".ielts", "plans", "current.json");
function planComplete(taskId) {
    if (!(0, node_fs_1.existsSync)(P))
        return;
    var p = JSON.parse((0, node_fs_1.readFileSync)(P, "utf-8"));
    for (var _i = 0, _a = p.tasks || []; _i < _a.length; _i++) {
        var t = _a[_i];
        if (t.id === taskId && t.status === "todo") {
            t.status = "done";
            t.completedAt = new Date().toISOString();
            (0, node_fs_1.writeFileSync)(P, JSON.stringify(p, null, 2));
            return;
        }
    }
}
function planSkip(taskId) {
    if (!(0, node_fs_1.existsSync)(P))
        return;
    var p = JSON.parse((0, node_fs_1.readFileSync)(P, "utf-8"));
    for (var _i = 0, _a = p.tasks || []; _i < _a.length; _i++) {
        var t = _a[_i];
        if (t.id === taskId && t.status === "todo") {
            t.status = "skipped";
            t.skippedAt = new Date().toISOString();
            (0, node_fs_1.writeFileSync)(P, JSON.stringify(p, null, 2));
            return;
        }
    }
}
