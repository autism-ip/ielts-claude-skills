/**
 * [INPUT]: 依赖 node:fs, node:os, node:path, node:child_process 的系统检查
 * [OUTPUT]: 对外提供 doctorCommand 函数，诊断 IELTS 安装健康状态
 * [POS]: packages/cli 的诊断命令，被 index.ts 注册为 `ielts doctor`
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { existsSync, readFileSync, accessSync, constants, statSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import { ProfileSchema, StatsSchema } from '@ielts/schemas';
const BASE = join(homedir(), '.ielts');
const SKILLS_DIR = process.env.SKILLS_DIR || join(homedir(), '.claude', 'skills');
const REQUIRED_SKILLS = ['ielts', 'ielts-writing', 'ielts-reading', 'ielts-speaking', 'ielts-listening', 'ielts-vocab', 'ielts-diagnose', 'ielts-dashboard'];
const MODULE_DIRS = ['writing', 'reading', 'listening', 'speaking', 'speaking/stories', 'vocab', 'diagnosis'];
function check(condition, passMsg, failMsg, hint) {
    return condition ? { status: 'pass', message: passMsg } : { status: 'fail', message: failMsg, hint };
}
function checkNodeVersion() {
    const v = process.versions.node;
    const major = parseInt(v.split('.')[0], 10);
    return check(major >= 20, `Node.js ${v} (>= 20)`, `Node.js ${v} (< 20)`, `Install Node.js >= 20: https://nodejs.org`);
}
function checkPnpm() {
    try {
        const out = execSync('pnpm --version', { encoding: 'utf-8', timeout: 5000 }).trim();
        return { status: 'pass', message: `pnpm ${out}` };
    }
    catch {
        /* 如果没有 pnpm 但有 npm，只给 warn 而非 fail */
        try {
            execSync('npm --version', { encoding: 'utf-8', timeout: 3000 });
            return { status: 'warn', message: 'pnpm not found (npm available)', hint: 'Install pnpm: npm install -g pnpm' };
        }
        catch {
            return { status: 'warn', message: 'pnpm not found in PATH', hint: 'Install pnpm: npm install -g pnpm' };
        }
    }
}
function checkCLIBuild() {
    const distUrl = new URL('../index.js', import.meta.url);
    const distPath = fileURLToPath(distUrl);
    if (!existsSync(distPath))
        return { status: 'fail', message: 'CLI dist not built', hint: 'Run: pnpm build' };
    const built = statSync(distPath).mtime;
    return { status: 'pass', message: `CLI built (${built.toISOString().slice(0, 10)})` };
}
function checkIeltsDir() {
    let st;
    try {
        st = statSync(BASE);
    }
    catch {
        return { status: 'fail', message: '~/.ielts/ not found', hint: 'Run: ielts init (or ielts init --fixtures for test data)' };
    }
    if (!st.isDirectory())
        return { status: 'fail', message: '~/.ielts/ is not a directory', hint: 'Remove the file and re-run ielts init' };
    try {
        accessSync(BASE, constants.R_OK | constants.W_OK | constants.X_OK);
    }
    catch {
        return { status: 'fail', message: '~/.ielts/ not accessible', hint: 'Fix permissions: chmod -R u+rwx ~/.ielts' };
    }
    return { status: 'pass', message: '~/.ielts/ exists and writable' };
}
function checkProfile() {
    const p = join(BASE, 'profile.json');
    if (!existsSync(p))
        return { status: 'fail', message: 'profile.json missing', hint: 'Run: ielts init (or ielts init --fixtures for test data)' };
    try {
        const data = JSON.parse(readFileSync(p, 'utf-8'));
        ProfileSchema.parse(data);
        if (typeof data.target?.overall !== 'number' || typeof data.preferences?.dailyGoal !== 'number') {
            return { status: 'fail', message: 'profile.json missing required fields', hint: 'Fix or delete ~/.ielts/profile.json and re-run ielts init' };
        }
        if (data.examDate) {
            const d = new Date(data.examDate);
            if (isNaN(d.getTime()))
                return { status: 'warn', message: `profile.json: invalid examDate "${data.examDate}"`, hint: 'Set examDate to a valid YYYY-MM-DD or null' };
        }
        return { status: 'pass', message: 'profile.json valid' };
    }
    catch (e) {
        const msg = e?.message || 'validation failed';
        return { status: 'fail', message: `profile.json: ${msg}`, hint: 'Fix or delete ~/.ielts/profile.json and re-run ielts init' };
    }
}
function checkStats() {
    const p = join(BASE, 'stats.json');
    if (!existsSync(p))
        return { status: 'warn', message: 'stats.json missing', hint: 'Run: ielts snapshot' };
    try {
        const data = JSON.parse(readFileSync(p, 'utf-8'));
        StatsSchema.parse(data);
        if (!data.lastSnapshot || typeof data.combined?.overallBand !== 'number') {
            return { status: 'warn', message: 'stats.json has no snapshot data', hint: 'Run: ielts snapshot' };
        }
        return { status: 'pass', message: 'stats.json valid' };
    }
    catch (e) {
        const msg = e?.message || 'invalid';
        return { status: 'warn', message: `stats.json: ${msg}`, hint: 'Run: ielts snapshot' };
    }
}
function checkModuleDirs() {
    const missing = [];
    for (const d of MODULE_DIRS) {
        const fp = join(BASE, d);
        try {
            if (!statSync(fp).isDirectory()) {
                missing.push(d);
                continue;
            }
            accessSync(fp, constants.R_OK);
        }
        catch {
            missing.push(d);
        }
    }
    if (missing.length === 0)
        return { status: 'pass', message: `All ${MODULE_DIRS.length} module dirs present` };
    return { status: 'warn', message: `Missing dirs: ${missing.join(', ')}`, hint: 'Run: ielts init (or ielts init --fixtures for test data)' };
}
function checkSkills() {
    let pass = 0, fail = 0, missing = [];
    for (const skill of REQUIRED_SKILLS) {
        const skillPath = join(SKILLS_DIR, skill);
        try {
            const st = statSync(skillPath);
            if (st.isDirectory() && existsSync(join(skillPath, 'SKILL.md'))) {
                pass++;
            }
            else {
                fail++;
                missing.push(skill);
            }
        }
        catch {
            fail++;
            missing.push(skill);
        }
    }
    if (fail === 0)
        return { status: 'pass', message: `All ${pass}/8 skills installed` };
    return { status: 'warn', message: `${pass}/8 skills OK, ${fail} missing: ${missing.join(', ')}`, hint: `Copy skills/ to ${SKILLS_DIR}/` };
}
function checkFeishu() {
    const p = join(BASE, 'secrets.json');
    if (!existsSync(p))
        return { status: 'pass', message: 'Feishu not configured (optional)' };
    try {
        const data = JSON.parse(readFileSync(p, 'utf-8'));
        if (typeof data.app_id === 'string' && data.app_id.trim() && typeof data.app_secret === 'string' && data.app_secret.trim())
            return { status: 'pass', message: 'Feishu configured (secrets OK)' };
        return { status: 'warn', message: 'Feishu secrets incomplete', hint: 'Run: ielts cloud setup (available in v3.2+)' };
    }
    catch {
        return { status: 'warn', message: 'Feishu secrets.json malformed', hint: 'Remove ~/.ielts/secrets.json and re-run ielts cloud setup' };
    }
}
function color(status, text) {
    if (status === 'pass')
        return `\x1b[32m✓ ${text}\x1b[0m`;
    if (status === 'fail')
        return `\x1b[31m✗ ${text}\x1b[0m`;
    return `\x1b[33m⚠ ${text}\x1b[0m`;
}
export function doctorCommand() {
    const results = [
        checkNodeVersion(),
        checkPnpm(),
        checkCLIBuild(),
        checkIeltsDir(),
        checkProfile(),
        checkStats(),
        checkModuleDirs(),
        checkSkills(),
        checkFeishu(),
    ];
    let passed = 0, warned = 0, failed = 0;
    console.log('\n  IELTS Doctor — System Diagnostics\n');
    for (const r of results) {
        if (r.status === 'pass')
            passed++;
        else if (r.status === 'warn')
            warned++;
        else
            failed++;
        console.log(`  ${color(r.status, r.message)}`);
        if (r.hint)
            console.log(`         ${r.hint}`);
    }
    const total = results.length;
    console.log(`\n  ${passed}/${total} passed, ${warned} warnings, ${failed} failures`);
    if (failed > 0) {
        console.log('\n  ❌ Some checks failed — see hints above');
        process.exitCode = 1;
    }
}
//# sourceMappingURL=doctor.js.map